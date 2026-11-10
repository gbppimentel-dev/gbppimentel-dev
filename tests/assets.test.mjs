import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { absoluteAsset, resolveAsset } from '../src/utils/assets.js';
import { projects } from '../src/data.js';
import manifest from '../src/data/asset-manifest.json' with { type: 'json' };

const publicFile = value => fileURLToPath(new URL(`../public/${value.split(/[?#]/)[0]}`, import.meta.url));

test('optimized paths preserve deployment prefixes, queries, and fragments', () => {
  assert.equal(resolveAsset('/images/slide01.png?v=3#hero', { base: '/portfolio/' }), '/portfolio/images/optimized/slide01.webp?v=3#hero');
  assert.equal(resolveAsset('images/slide01.png', { base: '/portfolio/', mobile: true }), '/portfolio/images/optimized/slide01-mobile.webp');
  assert.equal(resolveAsset('Pimentel-Resume-IT.pdf', { base: './' }), './Pimentel-Resume-IT.pdf');
  assert.equal(resolveAsset('https://example.com/image.png', { base: '/portfolio/' }), 'https://example.com/image.png');
  assert.equal(resolveAsset('data:image/svg+xml,test', { base: '/' }), 'data:image/svg+xml,test');
});

test('CSS artwork URLs resolve from the page at root and nested deployments', () => {
  assert.equal(absoluteAsset('images/menu-background.png', 'http://localhost:4173/'), 'http://localhost:4173/images/optimized/menu-background.webp');
  assert.equal(absoluteAsset('images/menu-background.png?v=1#art', 'https://example.com/portfolio/index.html#home'), 'https://example.com/portfolio/images/optimized/menu-background.webp?v=1#art');
  assert.equal(absoluteAsset('https://cdn.example.com/art.webp', 'https://example.com/portfolio/'), 'https://cdn.example.com/art.webp');
});

test('every generated derivative exists, is valid WebP, and has a positive aspect ratio', () => {
  assert.ok(Object.keys(manifest).length >= 50);
  for (const [source, entry] of Object.entries(manifest)) {
    assert.ok(existsSync(publicFile(source)), `Original source missing: ${source}`);
    assert.ok(entry.width > 0 && entry.height > 0);
    for (const value of [entry.src, entry.mobile].filter(Boolean)) {
      const bytes = readFileSync(publicFile(value));
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', value);
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', value);
    }
  }
});

test('all shared portfolio screenshots and artwork resolve on every screen size', () => {
  const references = projects.flatMap(project => [project.screenshot, project.artwork, ...(project.caseStudy?.screens || []).map(screen => screen.src)]).filter(Boolean);
  for (const reference of references) {
    for (const mobile of [false, true]) {
      const result = resolveAsset(reference, { base: '', mobile });
      assert.ok(existsSync(publicFile(result)), `Broken ${mobile ? 'mobile' : 'desktop'} asset: ${reference}`);
    }
  }
});

test('image transfer and phone hero variants stay within the optimization budget', () => {
  const report = JSON.parse(readFileSync(new URL('../docs/asset-optimization.json', import.meta.url)));
  const original = report.reduce((sum, item) => sum + item.originalBytes, 0);
  const optimized = report.reduce((sum, item) => sum + item.optimizedBytes, 0);
  assert.ok(optimized < original * .2, 'Generated image set must remain at least80% smaller');
  for (const name of ['slide01', 'slide02', 'slide03']) {
    assert.ok(readFileSync(publicFile(`images/optimized/${name}-mobile.webp`)).length < 50_000);
  }
});
