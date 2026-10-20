// CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Validate a private Supabase hearts export
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_OUTPUT = path.join(ROOT, 'cloudflare/hearts/.migration');
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BYTES = 16 * 1024 * 1024;
export const sha256 = value => createHash('sha256').update(value).digest('hex');

// RFC 4180 quoting, including escaped quotes, quoted newlines, BOM, and CRLF.
// Malformed CSV is rejected rather than partially imported.
export function parseCsv(input) {
  const text = String(input).replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', state = 'start';
  const finishField = () => { row.push(field); field = ''; state = 'start'; };
  const finishRow = () => { finishField(); rows.push(row); row = []; };
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (state === 'quoted') {
      if (character === '"') {
        if (text[index + 1] === '"') { field += '"'; index += 1; }
        else state = 'closed';
      } else field += character;
      continue;
    }
    if (character === ',') { finishField(); continue; }
    if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      finishRow(); continue;
    }
    if (state === 'closed') throw new Error(`Malformed CSV near record ${rows.length + 1}: unexpected text after a quoted field.`);
    if (character === '"') {
      if (state !== 'start') throw new Error(`Malformed CSV near record ${rows.length + 1}: unexpected quote.`);
      state = 'quoted';
    } else { field += character; state = 'text'; }
  }
  if (state === 'quoted') throw new Error('Malformed CSV: a quoted field was not closed.');
  if (field !== '' || row.length || state === 'closed') finishRow();
  return rows.filter(record => record.some(value => value.trim() !== ''));
}

function normalizeTimestamp(value, record) {
  const text = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(\.\d{1,6})?(Z|([+-])(\d{2})(?::?(\d{2}))?)$/i.exec(text);
  if (!match) throw new Error(`Record ${record}: created_at must be the timestamp from the Supabase export.`);
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, fraction = '', zone, sign, offsetHours, offsetMinutes = '00'] = match;
  const [year, month, day, hour, minute, second] = [yearText, monthText, dayText, hourText, minuteText, secondText].map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > monthDays[month - 1]
    || hour > 23 || minute > 59 || second > 59 || Number(offsetHours || 0) > 23 || Number(offsetMinutes) > 59) {
    throw new Error(`Record ${record}: created_at contains an invalid date or time.`);
  }
  const suffix = zone.toUpperCase() === 'Z' ? 'Z' : `${sign}${offsetHours}:${offsetMinutes}`;
  const normalized = `${yearText}-${monthText}-${dayText}T${hourText}:${minuteText}:${secondText}${fraction}${suffix}`;
  if (!Number.isFinite(Date.parse(normalized))) throw new Error(`Record ${record}: created_at could not be read.`);
  // Keep the original fractional precision: Date.toISOString would discard microseconds.
  return normalized;
}

export function validateExport(input) {
  const records = parseCsv(input);
  if (!records.length) throw new Error('The CSV is empty. Export the query results with column headers, even when there are no hearts.');
  const headers = records.shift().map(value => value.trim());
  if (headers.length !== 2 || new Set(headers).size !== 2 || !headers.includes('visitor_id') || !headers.includes('created_at')) {
    throw new Error('Expected exactly these CSV columns: visitor_id, created_at. Use the provided export SQL file.');
  }
  const visitorColumn = headers.indexOf('visitor_id'), dateColumn = headers.indexOf('created_at');
  const seen = new Set();
  const rows = records.map((record, index) => {
    if (record.length !== headers.length) throw new Error(`Record ${index + 2}: the number of CSV columns is incorrect.`);
    const visitorId = record[visitorColumn].trim().toLowerCase();
    if (!UUID_V4.test(visitorId)) throw new Error(`Record ${index + 2}: visitor_id is not a valid browser UUID.`);
    if (seen.has(visitorId)) throw new Error(`Record ${index + 2}: duplicate visitor_id. No records were imported.`);
    seen.add(visitorId);
    return { visitor_id: visitorId, created_at: normalizeTimestamp(record[dateColumn], index + 2) };
  });
  rows.sort((left, right) => left.visitor_id.localeCompare(right.visitor_id));
  return rows;
}

const sqlText = value => `'${String(value).replaceAll("'", "''")}'`;

export async function prepareImport(csvPath, { outputDirectory = DEFAULT_OUTPUT } = {}) {
  if (!csvPath) throw new Error('Provide the path to the CSV downloaded from the Supabase SQL Editor.');
  const sourcePath = path.resolve(csvPath);
  const info = await stat(sourcePath);
  if (!info.isFile() || info.size > MAX_BYTES) throw new Error('The export must be a CSV file smaller than 16 MiB.');
  const contents = await readFile(sourcePath);
  const rows = validateExport(contents.toString('utf8'));
  const statements = ['-- CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Private validated heart migration', '-- Keep this file private. Do not commit it or upload it to the portfolio.'];
  for (let index = 0; index < rows.length; index += 100) {
    const batch = rows.slice(index, index + 100);
    statements.push('INSERT OR IGNORE INTO portfolio_hearts (visitor_id, created_at) VALUES\n' + batch.map(row => `(${sqlText(row.visitor_id)}, ${sqlText(row.created_at)})`).join(',\n') + ';');
  }
  statements.push('-- END OF FILE: HEARTS-CLOUDFLARE-R5');
  const sql = statements.join('\n\n') + '\n';
  const manifest = {
    version: 'HEARTS-CLOUDFLARE-R5', generated_at: new Date().toISOString(),
    expected_count: rows.length, source_sha256: sha256(contents),
    visitor_set_sha256: sha256(rows.map(row => row.visitor_id).join('\n')),
    sql_sha256: sha256(sql), verified_remote_count: null,
  };
  await mkdir(outputDirectory, { recursive: true, mode: 0o700 });
  const sqlPath = path.join(outputDirectory, 'import.sql');
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(sqlPath, sql, { mode: 0o600 });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', { mode: 0o600 });
  return { rows, manifest, sqlPath, manifestPath };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const result = await prepareImport(process.argv[2]);
    console.log(`Validated ${result.manifest.expected_count} heart records. No Cloudflare or Supabase data was changed.`);
    console.log('Private import SQL and its verification manifest are ready in cloudflare/hearts/.migration.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
// END OF FILE: HEARTS-CLOUDFLARE-R5 | prepare-import.mjs
