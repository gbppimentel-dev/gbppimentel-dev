import { createRequire } from 'node:module';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const explicitModule = process.argv.includes('--sharp-path')
  ? process.argv[process.argv.indexOf('--sharp-path') + 1]
  : process.env.SHARP_MODULE_PATH;
let sharp;
try { sharp = require(explicitModule || 'sharp'); }
catch { throw new Error('Image generation needs sharp. Install it locally or pass --sharp-path /absolute/path/to/sharp. The website itself does not need sharp.'); }

const backgrounds = ['slide01.png', 'slide02.png', 'slide03.png', 'about-me.png', 'menu-background.png', 'backside-bg.png'];
const sources = backgrounds.map(name => `images/${name}`);
sources.push('images/profile-portrait-r5.png', 'images/profile-id-front-r6.svg');
async function collect(directory) {
  for (const item of await readdir(path.join(root, 'public', directory), { withFileTypes: true })) {
    const key = `${directory}/${item.name}`;
    if (item.isDirectory()) await collect(key);
    else if (/\.(png|jpe?g)$/i.test(item.name)) sources.push(key);
  }
}
await collect('images/projects');
const manifest = {};
const report = [];
const tasks = [...new Set(sources)].sort();
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < tasks.length) {
    const key = tasks[cursor++];
    const input = path.join(root, 'public', key);
    const original = await stat(input);
    const outputKey = `images/optimized/${key.slice('images/'.length).replace(/\.[^.]+$/, '.webp')}`;
    const output = path.join(root, 'public', outputKey);
    await mkdir(path.dirname(output), { recursive: true });
    const result = await sharp(input, { density: 120, limitInputPixels: 80_000_000 })
      .rotate().resize({ width: key.includes('profile-') ? 1024 : 1600, withoutEnlargement: true })
      .webp({ quality: key.includes('projects/') ? 88 : 84, effort: 5, smartSubsample: true }).toFile(output);
    const entry = { src: outputKey, width: result.width, height: result.height };
    let mobileBytes = 0;
    if (backgrounds.some(name => key === `images/${name}`)) {
      const mobileKey = outputKey.replace('.webp', '-mobile.webp');
      const mobile = await sharp(input).rotate().resize({ width: 768, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 }).toFile(path.join(root, 'public', mobileKey));
      entry.mobile = mobileKey;
      entry.mobileWidth = mobile.width;
      mobileBytes = mobile.size;
    }
    manifest[key] = entry;
    report.push({ source: key, originalBytes: original.size, optimizedBytes: result.size, mobileBytes });
  }
}));
const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(path.join(root, 'src/data/asset-manifest.json'), JSON.stringify(ordered, null, 2) + '\n');
await writeFile(path.join(root, 'docs/asset-optimization.json'), JSON.stringify(report.sort((a, b) => a.source.localeCompare(b.source)), null, 2) + '\n');
const before = report.reduce((sum, item) => sum + item.originalBytes, 0);
const after = report.reduce((sum, item) => sum + item.optimizedBytes, 0);
console.log(`Optimized ${report.length} assets: ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e6).toFixed(2)} MB (${Math.round((1 - after / before) * 100)}% smaller). Original artwork preserved.`);
