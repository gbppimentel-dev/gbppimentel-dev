import assert from 'node:assert/strict';
import test from 'node:test';
import { createPoseSettler } from '../src/utils/poseSettler.js';

test('stationary rendered geometry sleeps despite residual solver velocity', () => {
  const settle = createPoseSettler();
  assert.equal(settle.sample([12, 20, 50, 80], 1 / 60), false);
  for (let i = 0; i < 47; i++) assert.equal(settle.sample([12, 20, 50, 80], 1 / 60), false);
  assert.equal(settle.sample([12, 20, 50, 80], 1 / 60), true);
});

test('slow visible drift never passes the subpixel window', () => {
  const settle = createPoseSettler();
  for (let i = 0; i < 360; i++) assert.equal(settle.sample([i * .025, 20, 50, 80], 1 / 60), false);
});

test('tiny bounded constraint jitter settles while visible oscillation stays awake', () => {
  const jitter = createPoseSettler(), sway = createPoseSettler();
  let settled = false;
  for (let i = 0; i < 180; i++) {
    settled ||= jitter.sample([12 + Math.sin(i * 1.3) * .22, 20], 1 / 60);
    assert.equal(sway.sample([12 + Math.sin(i * .05) * 4, 20], 1 / 60), false);
  }
  assert.equal(settled, true);
});

test('gesture, breeze, reset and invalid samples require a fresh still window', () => {
  const settle = createPoseSettler();
  for (let i = 0; i < 60; i++) settle.sample([12, 20], 1 / 60);
  assert.equal(settle.sample([12, 20], 1 / 60, false), false);
  assert.equal(settle.calm, 0);
  assert.equal(settle.sample([12, 20], 60), false);
  assert.equal(settle.sample([12, 20], 60), false, 'resuming cannot count a hidden minute as still time');
  assert.equal(settle.sample([NaN, 20], 1 / 60), false);
  settle.reset();
  assert.equal(settle.calm, 0);
});
