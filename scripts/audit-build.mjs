import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const references = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(match => match[1]);
const buildPrefix = references.find(reference => reference.includes('assets/'))?.split('assets/')[0] || './';
const metadata = new Map();
const sources = new Map();
const localAsset = reference => {
  // Include critical public CSS linked before the Vite entry as well as its
  // generated chunks. The shared prefix also supports Pages subdirectories.
  const relative = reference.startsWith(buildPrefix) ? reference.slice(buildPrefix.length) : reference.replace(/^\.?\//, '');
  assert.ok(!relative.startsWith('/') && !relative.includes('..') && !relative.includes('://'), `Unexpected build asset path: ${reference}`);
  return relative;
};
const readAsset = async file => {
  if (!metadata.has(file)) {
    const bytes = await readFile(path.join(root, 'dist', file));
    metadata.set(file, { file, bytes: bytes.length, gzipBytes: gzipSync(bytes).length });
    if (file.endsWith('.js')) sources.set(file, bytes.toString('utf8'));
  }
  return metadata.get(file);
};
const resolveImport = (reference, importer) => {
  assert.ok(reference.startsWith('.') || reference.startsWith('/'), `Unexpected external build import: ${reference}`);
  const file = reference.startsWith('/') ? localAsset(reference) : path.posix.normalize(path.posix.join(path.posix.dirname(importer), reference));
  assert.ok(!file.startsWith('/') && !file.split('/').includes('..'), `Import escapes dist: ${reference}`);
  return file;
};
const collectStaticAssets = async (files, collected = new Set()) => {
  for (const file of files) {
    if (collected.has(file)) continue;
    collected.add(file);
    await readAsset(file);
    if (!file.endsWith('.js')) continue;
    // Vite emits static ESM statements at statement boundaries. Deliberately
    // exclude import(...) so case studies, WebGL, and other lazy features stay
    // outside the startup graph.
    const imports = [...sources.get(file).matchAll(/(?:^|[;\n])\s*(?:import|export)\s*(?:[\w$*{}\s,]+\s*from\s*)?["']([^"']+\.(?:js|css))["']/g)];
    await collectStaticAssets(imports.map(match => resolveImport(match[1], file)), collected);
  }
  return collected;
};
const initial = await collectStaticAssets(references.map(localAsset));
const appEntries = (await readdir(path.join(root, 'dist/assets'))).filter(file => /^App-.*\.(?:js|css)$/.test(file)).map(file => `assets/${file}`);
assert.ok(appEntries.some(file => file.endsWith('.js')), 'The staged App startup chunk is missing');
const startup = await collectStaticAssets(appEntries, new Set(initial));
// A staged App import can preload shared CSS whose filename is not App-*.
// Read only that import's Vite preload indices, never the complete map (which
// also lists genuinely on-demand route/identity assets).
for (const file of initial) {
  const source = sources.get(file);
  if (!source) continue;
  const table = source.match(/\b__vite__mapDeps[\s\S]{0,250}?\.f=(\[[^\]]*\])/);
  const dependencies = table ? JSON.parse(table[1]) : [];
  for (const match of source.matchAll(/\bimport\(\s*["']([^"']*\/?App-[^"']+\.js)["']\s*\)\s*,\s*__vite__mapDeps\(\[([\d,\s]*)\]\)/g)) {
    const indices = match[2].split(',').filter(value => value.trim()).map(Number);
    const preloads = indices.map(index => {
      assert.ok(typeof dependencies[index] === 'string', `Missing App preload index ${index} in ${file}`);
      const dependency = dependencies[index];
      // Relative-base builds use module-relative map entries. Absolute-base
      // builds can instead emit root/build-relative entries such as assets/*.
      return dependency.startsWith('.') ? resolveImport(dependency, file) : localAsset(dependency);
    });
    await collectStaticAssets(preloads, startup);
  }
}
const assetList = files => [...files].map(file => metadata.get(file));
const totals = assets => ({
  javascript: assets.filter(item => item.file.endsWith('.js')).reduce((sum, item) => sum + item.gzipBytes, 0),
  css: assets.filter(item => item.file.endsWith('.css')).reduce((sum, item) => sum + item.gzipBytes, 0),
});
const initialAssets = assetList(initial);
const appStartupAssets = assetList(new Set([...startup].filter(file => !initial.has(file))));
const startupAssets = assetList(startup);
const startupGzipBytes = totals(startupAssets);
assert.ok(startupGzipBytes.javascript < 250_000, `Startup JavaScript exceeds250KB gzip: ${startupGzipBytes.javascript}`);
assert.ok(startupGzipBytes.css < 60_000, `Startup CSS exceeds60KB gzip: ${startupGzipBytes.css}`);
assert.ok(![...startup].some(file => /Lanyard|three|Projects-|NetSuite-|MotionProbe/.test(file)), 'Heavy interactive/routes must not be automatic startup downloads');
const images = JSON.parse(await readFile(path.join(root, 'docs/asset-optimization.json'), 'utf8'));
const report = {
  version: JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8')).version,
  initialAssets,
  initialGzipBytes: totals(initialAssets),
  appStartupAssets,
  appStartupGzipBytes: totals(appStartupAssets),
  startupAssets,
  startupGzipBytes,
  startupBudgetBytes: { javascript: 250000, css: 60000 },
  previousStartupGzipBytes: { javascript: 298140, css: 93400 },
  generatedImages: { count: images.length, originalBytes: images.reduce((sum, item) => sum + item.originalBytes, 0), optimizedBytes: images.reduce((sum, item) => sum + item.optimizedBytes, 0) },
};
console.log(JSON.stringify(report, null, 2));
