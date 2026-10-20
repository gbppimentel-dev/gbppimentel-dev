// CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Guided heart-counter deployment and migration
import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareImport, sha256 } from './prepare-import.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WORKER = path.join(ROOT, 'cloudflare/hearts');
const CONFIG = path.join(WORKER, 'wrangler.json');
const WRANGLER = path.join(WORKER, 'node_modules/wrangler/bin/wrangler.js');
const PRIVATE = path.join(WORKER, '.migration');
const MANIFEST = path.join(PRIVATE, 'manifest.json');
const DEPLOYMENT = path.join(PRIVATE, 'deployment.json');
const LOCAL_ENV = path.join(ROOT, '.env.development.local');
const SCHEMA = path.join(WORKER, 'schema.sql');
const DEFAULT_ORIGIN = 'https://gbppimentel-dev.github.io';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const exists = async file => { try { await access(file); return true; } catch { return false; } };
const loadJson = async file => JSON.parse(await readFile(file, 'utf8'));
const saveJson = async (file, value) => writeFile(file, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });

function requireNode() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 12)) throw new Error('Use Node.js 22.12 or newer for these deployment tools. Node 24 LTS is suitable.');
}

async function requireWrangler() {
  if (!await exists(WRANGLER)) throw new Error('Install the included tools first: npm --prefix cloudflare/hearts ci');
}

function wrangler(args, { capture = false } = {}) {
  const result = spawnSync(process.execPath, [WRANGLER, ...args], {
    cwd: WORKER, env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
    stdio: ['inherit', capture ? 'pipe' : 'inherit', capture ? 'pipe' : 'inherit'],
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    // Captured D1 output can include browser identifiers. Never echo it.
    throw new Error(`Cloudflare could not complete "${args.slice(0, 2).join(' ')}". Your Supabase data has not been changed. Check your Cloudflare login/account and try again.`);
  }
  return result.stdout || '';
}

function jsonOutput(text) {
  const cleaned = text.replace(/\u001b\[[0-9;]*m/g, '').trim();
  try { return JSON.parse(cleaned); } catch { /* Wrangler may precede JSON with a notice. */ }
  for (let index = 0; index < cleaned.length; index += 1) {
    if (cleaned[index] !== '[' && cleaned[index] !== '{') continue;
    try { return JSON.parse(cleaned.slice(index)); } catch { /* Try the next JSON opening. */ }
  }
  throw new Error('Cloudflare returned an unreadable result. No migration was finalized.');
}

async function configWithDatabase() {
  const config = await loadJson(CONFIG);
  const database = config.d1_databases?.find(binding => binding.binding === 'DB');
  if (!database) throw new Error('The included Worker configuration is missing its DB binding. Restore cloudflare/hearts/wrangler.json from the update.');
  return { config, database };
}

function isRemoteId(value) { return UUID.test(value || '') && value !== NIL_UUID; }

function configureDevelopmentOrigins(config) {
  config.vars ||= {};
  const origins = new Set(String(config.vars.ALLOWED_ORIGINS || DEFAULT_ORIGIN).split(',').map(value => value.trim()).filter(Boolean));
  if (process.env.CODESPACE_NAME) {
    const domain = process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev';
    for (const port of [5173, 4173]) origins.add(`https://${process.env.CODESPACE_NAME}-${port}.${domain}`);
  }
  config.vars.ALLOWED_ORIGINS = [...origins].join(',');
}

async function init() {
  const { config, database } = await configWithDatabase();
  const output = jsonOutput(wrangler(['d1', 'list', '--json'], { capture: true }));
  const databases = Array.isArray(output) ? output : output.result;
  if (!Array.isArray(databases)) throw new Error('Cloudflare did not return a database list. Check the selected account.');
  const idOf = item => item.uuid || item.id;
  let found;
  if (isRemoteId(database.database_id)) {
    found = databases.find(item => idOf(item) === database.database_id);
    if (!found) throw new Error('The configured database belongs to another Cloudflare account or is unavailable. Select the correct account before continuing.');
  } else {
    found = databases.find(item => item.name === database.database_name);
    if (!found) {
      console.log('Creating the heart database on your Cloudflare account.');
      wrangler(['d1', 'create', database.database_name]);
      const fresh = jsonOutput(wrangler(['d1', 'list', '--json'], { capture: true }));
      found = (Array.isArray(fresh) ? fresh : fresh.result)?.find(item => item.name === database.database_name);
    }
    if (!found || !isRemoteId(idOf(found))) throw new Error('The database could not be located after creation. Nothing was deleted.');
    database.database_id = idOf(found);
  }
  configureDevelopmentOrigins(config);
  await saveJson(CONFIG, config);
  await mkdir(PRIVATE, { recursive: true, mode: 0o700 });
  console.log('Preparing the remote heart tables. Existing heart records are retained.');
  wrangler(['d1', 'execute', 'DB', '--remote', '--file', SCHEMA, '--yes'], { capture: true });
  console.log('Remote database is ready. Next: freeze the old counter, export its CSV, then import that CSV.');
}

function queryRows(sql) {
  const output = jsonOutput(wrangler(['d1', 'execute', 'DB', '--remote', '--command', sql, '--json'], { capture: true }));
  const results = Array.isArray(output) ? output : [output];
  if (results.some(result => result.success === false)) throw new Error('The remote database query failed. No migration was finalized.');
  return results.flatMap(result => Array.isArray(result.results) ? result.results : []);
}

function remoteStats() {
  const [row] = queryRows('SELECT (SELECT COUNT(*) FROM portfolio_hearts) AS actual_count, (SELECT count FROM heart_totals WHERE id = 1) AS tracked_count;');
  const actual = Number(row?.actual_count), tracked = Number(row?.tracked_count);
  if (!Number.isSafeInteger(actual) || actual < 0 || actual !== tracked) throw new Error('The remote heart total is not consistent. Stop here and check the database before switching the website.');
  return { count: actual };
}

async function importCsv(csvPath) {
  const { database } = await configWithDatabase();
  if (!isRemoteId(database.database_id)) throw new Error('Initialize your remote database first: npm run hearts:setup -- init');
  const prepared = await prepareImport(csvPath);
  const allowed = new Set(prepared.rows.map(row => row.visitor_id));
  const before = remoteStats();
  const existing = queryRows('SELECT visitor_id FROM portfolio_hearts ORDER BY visitor_id;');
  if (existing.length !== before.count) throw new Error('The complete target record list could not be verified. No records were imported.');
  if (existing.some(row => !allowed.has(String(row.visitor_id).toLowerCase()))) {
    throw new Error('The target database contains hearts outside this frozen export. No records were removed or imported. Stop and review the export before continuing.');
  }
  console.log(`Importing ${prepared.manifest.expected_count} validated heart records. Repeated imports do not add duplicates.`);
  // A zero-heart export has no INSERT statements; its verification still matters.
  if (prepared.rows.length) wrangler(['d1', 'execute', 'DB', '--remote', '--file', prepared.sqlPath, '--yes'], { capture: true });
  const after = remoteStats();
  if (after.count !== prepared.manifest.expected_count) throw new Error('The imported count does not match the export. Do not switch or pause anything; keep the export and rerun this import after reviewing the message.');
  const manifest = { ...prepared.manifest, database_id: database.database_id, imported_at: new Date().toISOString(), verified_remote_count: after.count };
  await saveJson(prepared.manifestPath, manifest);
  console.log(`Verified: ${after.count} hearts in Cloudflare, matching the frozen CSV export.`);
}

function endpoint(value, workerName) {
  let url;
  try { url = new URL(String(value || '').trim()); } catch { throw new Error('Paste the HTTPS workers.dev address printed by the deployment.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !['', '/'].includes(url.pathname)
    || !url.hostname.endsWith('.workers.dev') || !url.hostname.startsWith(workerName + '.')) {
    throw new Error('Use the production HTTPS workers.dev address for this Worker, without a path or query string.');
  }
  return url.origin;
}

async function setLocalEndpoint(url) {
  const old = await exists(LOCAL_ENV) ? await readFile(LOCAL_ENV, 'utf8') : '';
  const lines = old.split(/\r?\n/).filter(line => !/^\s*(?:export\s+)?VITE_HEARTS_API_URL\s*=/.test(line));
  while (lines.at(-1) === '') lines.pop();
  if (url) lines.push(`VITE_HEARTS_API_URL=${JSON.stringify(url)}`);
  lines.push('');
  await writeFile(LOCAL_ENV, lines.join('\n'), { mode: 0o600 });
}

async function expectedImport(database) {
  if (!await exists(MANIFEST)) throw new Error('First import your frozen Supabase export: npm run hearts:setup -- import "path/to/your-export.csv"');
  const manifest = await loadJson(MANIFEST);
  if (manifest.database_id !== database.database_id || manifest.verified_remote_count !== manifest.expected_count || !Number.isSafeInteger(manifest.expected_count)) {
    throw new Error('This database has no verified migration manifest. Import the final frozen export before deployment.');
  }
  const sql = await readFile(path.join(PRIVATE, 'import.sql'));
  if (sha256(sql) !== manifest.sql_sha256) throw new Error('The private import file changed after validation. Re-import the unchanged original CSV.');
  const previous = await exists(DEPLOYMENT) ? await loadJson(DEPLOYMENT) : null;
  const previouslyActivated = previous?.database_id === database.database_id
    && previous.schemaVersion === 1
    && previous.migration_source_sha256 === manifest.source_sha256
    && previous.migration_set_sha256 === manifest.visitor_set_sha256;
  const actual = remoteStats();
  if (actual.count !== manifest.expected_count && !previouslyActivated) throw new Error('The target count changed before its first verified activation. Review the database before changing the website endpoint.');
  return { ...manifest, previouslyActivated };
}

async function verifyEndpoint(url, config, expectedCount) {
  const request = async (route, options = {}) => {
    const response = await fetch(url + route, { ...options, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('The published Worker is not ready yet. Your website configuration was left unchanged. Wait a moment, then rerun deploy with --url and the same address.');
    return response;
  };
  const health = await (await request('/health')).json();
  if (health.ok !== true || health.service !== 'portfolio-hearts' || health.schemaVersion !== 1) throw new Error('The address does not identify the expected heart service. The website endpoint was not changed.');
  const origin = String(config.vars?.ALLOWED_ORIGINS || DEFAULT_ORIGIN).split(',').map(value => value.trim()).find(value => value === DEFAULT_ORIGIN) || DEFAULT_ORIGIN;
  const response = await request('/api/hearts?visitor_id=' + randomUUID(), { headers: { Origin: origin, Accept: 'application/json' } });
  const state = await response.json();
  if (response.headers.get('Access-Control-Allow-Origin') !== origin || typeof state.liked !== 'boolean' || state.count !== expectedCount) throw new Error('The published API count or browser permissions did not match the verified import. Your website endpoint was left unchanged.');
  const preflight = await request('/api/hearts', { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'PUT', 'Access-Control-Request-Headers': 'content-type' } });
  if (preflight.headers.get('Access-Control-Allow-Origin') !== origin || !/\bPUT\b/.test(preflight.headers.get('Access-Control-Allow-Methods') || '')) throw new Error('The API is not permitting the website to save hearts. No website configuration was changed.');
}

async function activate(url, config, manifest) {
  const current = remoteStats();
  if (!manifest.previouslyActivated && current.count !== manifest.expected_count) throw new Error('The target count changed before its first verified activation. Your website configuration was left unchanged.');
  await verifyEndpoint(url, config, current.count);
  await setLocalEndpoint(url);
  await mkdir(PRIVATE, { recursive: true, mode: 0o700 });
  await saveJson(DEPLOYMENT, {
    version: 'HEARTS-CLOUDFLARE-R5', schemaVersion: 1,
    database_id: manifest.database_id,
    migration_source_sha256: manifest.source_sha256,
    migration_set_sha256: manifest.visitor_set_sha256,
    migrated_count: manifest.expected_count, url,
    verified_at: new Date().toISOString(), verified_count: current.count,
  });
  console.log(`Verified Worker: ${url}`);
  console.log(`Verified migrated heart count: ${manifest.expected_count}; current shared count: ${current.count}`);
  console.log('Local configuration is updated. Restart npm run dev to test the Cloudflare counter.');
  console.log('For the live site, set the GitHub Actions repository VARIABLE VITE_HEARTS_API_URL to the Worker address above, then push this update or rerun the Pages workflow.');
  console.log('Keep Supabase frozen and active until the deployed site shows the migrated count and a heart survives a refresh. Only then pause the old portfolio project and resume Salt & Light.');
}

async function deploy(args) {
  const { config, database } = await configWithDatabase();
  const manifest = await expectedImport(database);
  configureDevelopmentOrigins(config);
  await saveJson(CONFIG, config);
  const urlIndex = args.indexOf('--url');
  let url = urlIndex >= 0 ? endpoint(args[urlIndex + 1], config.name) : null;
  if (!url) {
    console.log('Publishing the heart API. Your Supabase project will not be paused or deleted.');
    wrangler(['deploy']);
    const reader = createInterface({ input: stdin, output: stdout });
    try { url = endpoint(await reader.question('Paste the production HTTPS workers.dev address printed above: '), config.name); }
    finally { reader.close(); }
  }
  await activate(url, config, manifest);
}

async function local() {
  const { config } = await configWithDatabase();
  configureDevelopmentOrigins(config);
  await saveJson(CONFIG, config);
  wrangler(['d1', 'execute', 'DB', '--local', '--file', SCHEMA, '--yes'], { capture: true });
  const localUrl = process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-8787.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev'}`
    : 'http://127.0.0.1:8787';
  await setLocalEndpoint(localUrl);
  console.log('Local-only database is ready. Its test hearts do not change the live counter.');
  console.log('Start npm run hearts:dev in this terminal. In a second terminal, start npm run dev.');
  if (process.env.CODESPACE_NAME) console.log('In the Codespaces Ports panel, make port 8787 Public so the browser can call this anonymous development API.');
  console.log('After testing, npm run hearts:setup -- remote restores the verified deployed address.');
}

async function status() {
  const { config, database } = await configWithDatabase();
  if (!isRemoteId(database.database_id)) throw new Error('Remote database is not initialized. Run npm run hearts:setup -- init when you are ready to migrate.');
  const actual = remoteStats();
  console.log(`Cloudflare database heart count: ${actual.count}`);
  if (await exists(MANIFEST)) {
    const manifest = await loadJson(MANIFEST);
    console.log(`Frozen CSV heart count: ${manifest.expected_count}`);
    console.log(`Counts currently match the export: ${actual.count === manifest.expected_count ? 'yes' : 'no (new likes/removals after cutover can change this)'}`);
  }
  if (await exists(DEPLOYMENT)) {
    const saved = await loadJson(DEPLOYMENT);
    const url = endpoint(saved.url, config.name);
    await verifyEndpoint(url, config, actual.count);
    console.log('Published API health and browser access: verified.');
  }
}

async function extraOrigin(value) {
  const { config } = await configWithDatabase();
  const url = new URL(value || '');
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Use an HTTPS website origin such as https://example.com, with no page path.');
  configureDevelopmentOrigins(config);
  const origins = new Set(config.vars.ALLOWED_ORIGINS.split(',')); origins.add(url.origin);
  config.vars.ALLOWED_ORIGINS = [...origins].join(','); await saveJson(CONFIG, config);
  console.log('Website origin added to the local Worker configuration. Redeploy the Worker for it to take effect.');
}

function help() {
  console.log('Heart-counter setup (run from the portfolio folder):\n\n  npm --prefix cloudflare/hearts ci\n  npm run hearts:setup -- login\n  npm run hearts:setup -- init\n  npm run hearts:setup -- import "path/to/export.csv"\n  npm run hearts:setup -- deploy\n  npm run hearts:setup -- status\n\nLocal-only testing:\n  npm run hearts:setup -- local\n  npm run hearts:dev\n  npm run dev   (in a second terminal)\n\nRestore the deployed local endpoint:\n  npm run hearts:setup -- remote\n\nRestore the original local Supabase configuration before cutover:\n  npm run hearts:setup -- supabase\n\nOptional account/origin helpers:\n  npm run hearts:setup -- account YOUR_CLOUDFLARE_ACCOUNT_ID\n  npm run hearts:setup -- origin https://your-website.example\n\nFollow docs/heart-counter-migration.md before freezing or pausing any project.');
}

try {
  requireNode();
  const [command = 'help', ...args] = process.argv.slice(2);
  if (command === 'help' || command === '--help') help();
  else {
    await requireWrangler();
    if (command === 'login') wrangler(['login']);
    else if (command === 'init') await init();
    else if (command === 'import') await importCsv(args[0]);
    else if (command === 'deploy') await deploy(args);
    else if (command === 'local') await local();
    else if (command === 'status') await status();
    else if (command === 'supabase') {
      await setLocalEndpoint(null);
      console.log('The local Cloudflare override is removed; the retained Supabase configuration is used again. Restart npm run dev. This did not unfreeze or resume any Supabase project.');
    }
    else if (command === 'remote') {
      const { config } = await configWithDatabase();
      if (!await exists(DEPLOYMENT)) throw new Error('There is no verified deployed endpoint yet. Complete deploy first.');
      const saved = await loadJson(DEPLOYMENT); await setLocalEndpoint(endpoint(saved.url, config.name));
      console.log('The verified deployed API is restored for local testing. Restart npm run dev.');
    } else if (command === 'account') {
      if (!/^[a-f0-9]{32}$/i.test(args[0] || '')) throw new Error('Paste the 32-character Account ID from the Cloudflare Dashboard. Do not use an API token.');
      const { config } = await configWithDatabase(); config.account_id = args[0].toLowerCase(); await saveJson(CONFIG, config); console.log('Cloudflare account selection saved.');
    } else if (command === 'origin') await extraOrigin(args[0]);
    else throw new Error('Unknown command. Run npm run hearts:setup -- help for the complete commands.');
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
// END OF FILE: HEARTS-CLOUDFLARE-R5 | setup.mjs
