import assert from 'node:assert/strict';
import test from 'node:test';
import { createPaintClock, renderPixelRatio } from '../src/utils/renderBudget.js';

function sample(displayHz, rate) {
  const clock = createPaintClock(rate), paints = [];
  for (let frame = 0; frame <= displayHz; frame++) {
    const time = frame * 1000 / displayHz;
    if (clock.due(time)) paints.push(time);
  }
  return paints;
}

test('decorative effects retain a stable30Hz cadence on60Hz displays', () => {
  const paints = sample(60, 30);
  assert.equal(paints.length, 31);
  for (let i = 1; i < paints.length; i++) assert.ok(Math.abs(paints[i] - paints[i - 1] - 1000 / 30) < .001);
});

test('high-refresh displays do not multiply expensive foreground paint work', () => {
  for (const hz of [90, 120, 144, 165]) {
    assert.ok(Math.abs(sample(hz, 60).length - 61) <= 1, `${hz}Hz stays near60 paints/sec`);
    assert.ok(Math.abs(sample(hz, 30).length - 31) <= 1, `${hz}Hz stays near30 paints/sec`);
  }
});

test('resume and reset permit one immediate paint without catch-up bursts', () => {
  const clock = createPaintClock(30);
  assert.equal(clock.due(0), true);
  assert.equal(clock.due(10), false);
  assert.equal(clock.due(10000), true);
  assert.equal(clock.due(10001), false);
  clock.reset();
  assert.equal(clock.due(10002), true);
  assert.equal(clock.due(10003), false);
});

test('the WebGL backing surface stays within its total pixel budget', () => {
  for (const [width, height, dpr] of [[1280, 700, 1], [1440, 812, 2], [3840, 2072, 2], [768, 1024, 3]]) {
    const ratio = renderPixelRatio(width, height, dpr);
    assert.ok(ratio <= dpr && ratio <= 1.5);
    assert.ok(width * height * ratio * ratio <= 1_600_000.0001);
  }
  assert.equal(renderPixelRatio(900, 500, 1), 1, 'ordinary1x surfaces retain native resolution');
});
