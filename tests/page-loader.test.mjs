import assert from 'node:assert/strict';
import test from 'node:test';
import { afterFirstPaint, createPageLoader, INTRO_LOADER_DURATION, ROUTE_LOADER_DURATION, LOADER_MAX_WAIT } from '../src/utils/pageLoader.js';

test('boot work waits for a committed paint and cleanup cancels either pending frame', () => {
  let next = 0, calls = 0;
  const frames = new Map();
  const options = { requestFrame: callback => { frames.set(++next, callback); return next; }, cancelFrame: id => frames.delete(id) };
  const paint = () => { const pending = [...frames]; frames.clear(); pending.forEach(([, callback]) => callback()); };
  const cancelEarly = afterFirstPaint(() => calls++, options);
  cancelEarly();
  paint();
  assert.equal(calls, 0);
  const cancelAfterPaint = afterFirstPaint(() => calls++, options);
  paint();
  assert.equal(calls, 0, 'the first frame leaves the lightweight shell visible');
  cancelAfterPaint();
  paint();
  assert.equal(calls, 0);
  afterFirstPaint(() => calls++, options);
  paint();
  paint();
  assert.equal(calls, 1);
  assert.equal(frames.size, 0);
});

function fixture({ reduced = false } = {}) {
  let clock = 0, nextId = 0;
  const timers = new Map(), visibility = [], intros = [];
  const loader = createPageLoader({ initialPage: 'home', reduced,
    now: () => clock, onVisible: value => visibility.push(value),
    onIntroReady: () => intros.push(clock),
    schedule: (callback, delay) => { const id = ++nextId; timers.set(id, { callback, due: clock + delay }); return id; },
    cancel: id => timers.delete(id),
  });
  return { loader, timers, visibility, intros,
    advance(milliseconds) {
      const end = clock + milliseconds;
      while (true) {
        const pending = [...timers].filter(([, timer]) => timer.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
        if (!pending) break;
        const [id, timer] = pending;
        clock = timer.due;
        timers.delete(id);
        timer.callback();
      }
      clock = end;
    },
  };
}

test('startup waits for both real readiness and a brief recognizable intro', () => {
  const f = fixture();
  f.loader.start();
  f.loader.ready('home');
  f.advance(INTRO_LOADER_DURATION);
  assert.deepEqual(f.visibility, [], 'elapsed intro cannot bypass pending fonts/resources');
  f.loader.resourcesReady();
  f.advance(0);
  assert.deepEqual(f.visibility, [false]);
  assert.equal(f.timers.size, 0);

  const cached = fixture();
  cached.loader.start();
  cached.loader.ready('home');
  cached.loader.resourcesReady();
  cached.advance(INTRO_LOADER_DURATION - 1);
  assert.deepEqual(cached.visibility, []);
  cached.advance(1);
  assert.deepEqual(cached.visibility, [false]);
});

test('module evaluation cannot consume the first painted intro', () => {
  const f = fixture();
  f.advance(800);
  f.loader.start();
  f.loader.resourcesReady();
  f.loader.ready('home');
  f.advance(INTRO_LOADER_DURATION - 1);
  assert.deepEqual(f.visibility, []);
  assert.deepEqual(f.intros, []);
  f.advance(1);
  assert.deepEqual(f.intros, [800 + INTRO_LOADER_DURATION]);
  assert.deepEqual(f.visibility, [false]);
});

test('the intro prepares the scene once, then waits for its committed content', () => {
  const f = fixture();
  f.loader.start();
  f.loader.resourcesReady();
  f.advance(400);
  const token = f.loader.begin('projects');
  f.advance(INTRO_LOADER_DURATION - 400);
  assert.deepEqual(f.intros, [INTRO_LOADER_DURATION], 'route intent cannot cancel the startup scene mount');
  assert.deepEqual(f.visibility, [], 'scene preparation is not content readiness');
  f.loader.ready('projects', token);
  f.advance(0);
  assert.deepEqual(f.visibility, [false]);
  f.loader.stop();
  f.loader.start();
  f.advance(INTRO_LOADER_DURATION);
  assert.deepEqual(f.intros, [INTRO_LOADER_DURATION], 'strict cleanup or later routes do not replay startup');
});

test('switching to reduced motion prepares pending content without cosmetic delay', () => {
  const f = fixture();
  f.loader.start();
  f.advance(200);
  f.loader.setReduced(true);
  f.advance(0);
  assert.deepEqual(f.intros, [200]);
  assert.deepEqual(f.visibility, [], 'resource and route readiness are still required');
  f.loader.resourcesReady();
  f.loader.ready('home');
  f.advance(0);
  assert.deepEqual(f.visibility, [false]);
});

test('a route stays covered until its lazy content commits', () => {
  const f = fixture();
  f.loader.start();
  f.loader.ready('home');
  f.loader.resourcesReady();
  f.advance(INTRO_LOADER_DURATION);
  const token = f.loader.begin('projects');
  f.advance(ROUTE_LOADER_DURATION + 200);
  assert.deepEqual(f.visibility, [false, true]);
  f.loader.ready('projects', token);
  f.advance(0);
  assert.deepEqual(f.visibility, [false, true, false]);
});

test('rapid routes reject obsolete completion tokens and keep the latest minimum', () => {
  const f = fixture();
  f.loader.start();
  f.loader.resourcesReady();
  f.loader.ready('home');
  f.advance(INTRO_LOADER_DURATION);
  const stale = f.loader.begin('projects');
  f.advance(100);
  f.loader.begin('netsuite');
  const latest = f.loader.begin('projects');
  f.loader.ready('projects', stale);
  f.advance(ROUTE_LOADER_DURATION);
  assert.deepEqual(f.visibility, [false, true]);
  f.loader.ready('projects', latest);
  f.advance(0);
  assert.deepEqual(f.visibility, [false, true, false]);
});

test('reduced motion removes cosmetic waiting while retaining readiness', () => {
  const f = fixture({ reduced: true });
  f.loader.start();
  f.loader.ready('home');
  f.advance(0);
  assert.deepEqual(f.visibility, []);
  f.loader.resourcesReady();
  f.advance(0);
  assert.deepEqual(f.visibility, [false]);
  const token = f.loader.begin('projects');
  f.loader.ready('projects', token);
  f.advance(0);
  assert.deepEqual(f.visibility, [false, true, false]);
});

test('the overlay has a failsafe and strict remount cleanup cancels old timers', () => {
  const f = fixture();
  f.loader.start();
  f.advance(LOADER_MAX_WAIT);
  assert.deepEqual(f.visibility, [false], 'a stuck resource never traps navigation');
  assert.equal(f.timers.size, 0);
  assert.equal(f.loader.visible, false);
  assert.equal(f.loader.ready('home'), true, 'a late commit can restore focus without replaying the overlay');
  assert.deepEqual(f.visibility, [false]);

  const remount = fixture();
  remount.loader.start();
  remount.loader.ready('home');
  remount.loader.resourcesReady();
  remount.loader.stop();
  assert.equal(remount.timers.size, 0);
  remount.advance(200);
  remount.loader.start();
  remount.advance(INTRO_LOADER_DURATION - 200);
  assert.deepEqual(remount.visibility, [false]);
  assert.equal(remount.timers.size, 0);
});
