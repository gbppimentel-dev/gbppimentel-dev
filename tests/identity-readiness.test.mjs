import assert from 'node:assert/strict';
import test from 'node:test';
import { createIdentityReadiness, loadDecodedIdentityImage } from '../src/utils/identityReadiness.js';

test('identity reveal requires a frame after both faces, strap and hardware are ready', () => {
  let ready = 0;
  const scene = createIdentityReadiness({ onReady: () => ready++ });
  assert.equal(scene.frame(), false);
  scene.resource('front'); scene.resource('back');
  assert.equal(scene.frame(), false, 'a textured floating card cannot reveal without its strap');
  scene.resource('strap');
  assert.equal(scene.frame(), false, 'hardware must be configured too');
  scene.resource('hardware');
  assert.equal(ready, 0, 'resource completion alone is not a painted scene');
  assert.equal(scene.frame(), true);
  assert.equal(scene.frame(), false);
  assert.equal(ready, 1);
});

test('failed or disposed scene work cannot announce readiness, while retry starts fresh', () => {
  let ready = 0, failed = 0;
  const scene = createIdentityReadiness({ onReady: () => ready++, onError: () => failed++ });
  scene.fail(new Error('WebGL unavailable')); scene.fail(new Error('late image error'));
  for (const part of ['front', 'back', 'strap', 'hardware']) scene.resource(part);
  assert.equal(scene.frame(), false);
  assert.equal(failed, 1);
  scene.reset();
  for (const part of ['front', 'back', 'strap', 'hardware']) scene.resource(part);
  assert.equal(scene.frame(), true);
  scene.dispose(); scene.reset(); scene.fail(new Error('late completion'));
  assert.equal(scene.frame(), false);
  assert.equal(ready, 1); assert.equal(failed, 1);
});

function imageFixture() {
  let timeout, cancelled = 0, resolveDecode;
  const image = { src: '', decode: () => new Promise(resolve => { resolveDecode = resolve; }) };
  const options = { createImage: () => image, schedule: callback => { timeout = callback; return 1; }, cancel: () => cancelled++ };
  return { image, options, timeout: () => timeout(), decode: () => resolveDecode(), cancelled: () => cancelled };
}

test('an image load waits for decode and clears timeout/handlers after completion', async () => {
  const fixture = imageFixture();
  let done = false;
  const promise = loadDecodedIdentityImage('/front.svg', fixture.options).then(image => { done = true; return image; });
  fixture.image.onload(); await Promise.resolve();
  assert.equal(done, false);
  fixture.decode();
  assert.equal(await promise, fixture.image);
  assert.equal(fixture.cancelled(), 1);
  assert.equal(fixture.image.onload, null); assert.equal(fixture.image.onerror, null);
});

test('network error, timeout, decode error and cancellation all settle instead of spinning forever', async () => {
  const network = imageFixture(), timed = imageFixture(), decode = imageFixture(), aborted = imageFixture();
  const networkPromise = loadDecodedIdentityImage('/front.svg', network.options);
  network.image.onerror(); await assert.rejects(networkPromise, /could not be loaded/);
  const timedPromise = loadDecodedIdentityImage('/front.svg', timed.options);
  timed.timeout(); await assert.rejects(timedPromise, /timed out/);
  decode.image.decode = () => Promise.reject(new Error('decode'));
  const decodePromise = loadDecodedIdentityImage('/front.svg', decode.options);
  decode.image.onload(); await assert.rejects(decodePromise, /decoded/);
  const controller = new AbortController();
  const abortedPromise = loadDecodedIdentityImage('/front.svg', { ...aborted.options, signal: controller.signal });
  controller.abort(); await assert.rejects(abortedPromise, /cancelled/);
  assert.equal(aborted.image.src, '');
});
