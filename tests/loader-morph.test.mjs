import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { INTRO_LOADER_DURATION } from '../src/utils/pageLoader.js';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../public/portfolio-loader.css', import.meta.url), 'utf8');
const poses = [...css.matchAll(/d:\s*path\("([^"]+)"\)/g)].map(match => match[1]);
const topology = value => value.match(/[A-Za-z]/g).join('');
const coordinates = value => value.match(/-?\d*\.?\d+(?:[eE][-+]?\d+)?/g).map(Number);

// Sample the actual cubic contours so a different path string alone cannot
// pass this guard: both the outside silhouette and its hole must change area.
function contourAreas(data) {
  const tokens = data.match(/[MLCZ]|-?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
  let index = 0, point = [0, 0], points = [];
  const areas = [];
  const read = count => Array.from({ length: count }, () => Number(tokens[index++]));
  while (index < tokens.length) {
    const command = tokens[index++];
    if (command === 'M') { point = read(2); points = [point]; }
    else if (command === 'L') { point = read(2); points.push(point); }
    else if (command === 'C') {
      const [a, b, c, d, e, f] = read(6), [x, y] = point;
      for (let sample = 1; sample <= 32; sample++) {
        const t = sample / 32, u = 1 - t;
        points.push([u ** 3 * x + 3 * u ** 2 * t * a + 3 * u * t ** 2 * c + t ** 3 * e,
          u ** 3 * y + 3 * u ** 2 * t * b + 3 * u * t ** 2 * d + t ** 3 * f]);
      }
      point = [e, f];
    } else if (command === 'Z') {
      areas.push(Math.abs(points.reduce((sum, p, i) => {
        const next = points[(i + 1) % points.length];
        return sum + p[0] * next[1] - next[0] * p[1];
      }, 0) / 2));
    } else throw new Error('Unexpected loader path command: ' + command);
  }
  return areas;
}

test('the animated loader core is a painted path, not a non-painted definition or use proxy', () => {
  const core = html.match(/<svg class="loader-scene loader-core"[^>]*>([\s\S]*?)<\/svg>/)?.[1];
  assert.ok(core, 'the painted SVG parent owns core fill/color');
  assert.doesNotMatch(core, /<defs\b|<use\b/, 'CSS d animation must run on the painted core');
  assert.match(core, /<path class="loader-shape" id="portfolio-loader-shape"/);
  assert.match(css, /\.loader-shape\s*\{[^}]*animation:\s*portfolio-loader-morph/);
  assert.match(css, /\.loader-core\s*\{[^}]*animation:\s*portfolio-loader-fill/);
  assert.equal((html.match(/class="loader-echo-layer/g) || []).length, 3);
});

test('all morph poses interpolate compatible topology and visibly distinct outer and inner contours', () => {
  assert.equal(poses.length, 3);
  const signature = topology(poses[0]), count = coordinates(poses[0]).length;
  for (const pose of poses) {
    assert.equal(topology(pose), signature);
    assert.equal(coordinates(pose).length, count);
    assert.ok(coordinates(pose).every(Number.isFinite));
  }
  const areas = poses.map(contourAreas);
  areas.forEach(area => { assert.equal(area.length, 2); assert.ok(area[0] > area[1] * 3); });
  const outer = areas.map(area => area[0]), inner = areas.map(area => area[1]);
  assert.ok(Math.max(...outer) - Math.min(...outer) > 1000, 'square, octagon, and circle must have different painted silhouettes');
  assert.ok(Math.max(...inner) - Math.min(...inner) > 200, 'the hollow center must also change shape');
});


test('painted echo paths share the core geometry and color clock without phase delays', () => {
  const echoes = [...html.matchAll(/<path class="loader-shape loader-echo" d="([^"]+)"/g)];
  assert.equal(echoes.length, 3);
  assert.ok(echoes.every(match => match[1] === poses[0]), 'all paths have the same initial geometry');
  assert.doesNotMatch(html, /<use\b|data-echo-shape=/, 'echoes must morph directly rather than freeze a cloned or emitted phase');
  const coreRule = css.match(/\.loader-shape\s*\{([^}]+)\}/)[1];
  const echoRule = css.match(/\.loader-echo\s*\{([^}]+)\}/)[1];
  const coreAnimation = coreRule.match(/animation:\s*([^;]+)/)[1];
  const echoAnimations = echoRule.match(/animation:\s*([^;]+)/)[1].split(/,(?=portfolio-)/);
  assert.equal(echoAnimations[0], coreAnimation, 'echo geometry shares the exact core duration, easing, and zero delay');
  assert.match(echoAnimations[1], /^portfolio-loader-stroke 1\.05s linear infinite$/, 'stroke follows the current core color without a delayed phase');
  assert.match(echoAnimations[2], /portfolio-loader-weight[^;]*var\(--echo-delay,0s\)/, 'only the outline weight follows delayed expansion');
  const colorStops = name => [...css.match(new RegExp('@keyframes portfolio-loader-' + name + ' \\{([^\\n]+)'))[1]
    .matchAll(/([\d%,]+)\s*\{\s*(?:fill|stroke):\s*([^;]+);/g)].map(match => match.slice(1));
  assert.deepEqual(colorStops('stroke'), colorStops('fill'), 'every stroke color stop equals the core fill color stop');
});

test('echo waves stay hidden before emission and start at exact thirds of the intro cycle', () => {
  const layerRule = css.match(/\.loader-echo-layer\s*\{([^}]+)\}/)?.[1];
  assert.ok(layerRule);
  assert.match(layerRule, /opacity:\s*0/);
  assert.match(layerRule, /animation:[^;]*\bboth\b/, 'backwards fill prevents the delayed waves from flashing full size');
  const duration = Number(layerRule.match(/portfolio-loader-echo\s+([.\d]+)s/)?.[1]);
  const second = Number(css.match(/loader-echo-layer--second\s*\{\s*--echo-delay:\s*([.\d]+)s/)?.[1]);
  const third = Number(css.match(/loader-echo-layer--third\s*\{\s*--echo-delay:\s*([.\d]+)s/)?.[1]);
  assert.equal(duration * 1000, INTRO_LOADER_DURATION);
  assert.ok(Math.abs(second - duration / 3) < .000001);
  assert.ok(Math.abs(third - duration * 2 / 3) < .000001);
  assert.match(layerRule, /portfolio-loader-echo[^;]*var\(--echo-delay\)/);
  assert.match(css, /33\.333333%,100%\s*\{\s*transform:\s*scale\(1\.42\);\s*opacity:\s*0/);
});
