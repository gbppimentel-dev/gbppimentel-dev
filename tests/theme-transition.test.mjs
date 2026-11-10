import assert from 'node:assert/strict';
import test from 'node:test';
import { createThemeTransition, initializeTheme, normalizeTheme, THEME_FADE_DURATION } from '../src/utils/theme.js';

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function fixture({ native = true, reduced = false, hidden = false, throws = false } = {}) {
  const owner = { hidden, body: {}, documentElement: { dataset: { theme: 'dark' } } };
  const transitions = [], commits = [], timers = new Map(), oldStyles = [];
  let timerId = 0;
  const view = { matchMedia: () => ({ matches: reduced }),
    getComputedStyle: () => { oldStyles.push(owner.documentElement.dataset.theme); return { backgroundColor: '#14151b' }; } };
  if (native) owner.startViewTransition = update => {
    if (throws) throw new Error('Snapshot unavailable');
    const ready = deferred(), done = deferred(), finished = deferred();
    const transition = { ready: ready.promise, updateCallbackDone: done.promise, finished: finished.promise,
      skipped: 0, skipTransition() { this.skipped += 1; },
      update() { update(); done.resolve(); ready.resolve(); },
      finish() { finished.resolve(); }, rejectReady() { ready.reject(new Error('Skipped')); },
    };
    transitions.push(transition);
    return transition;
  };
  const change = createThemeTransition({ document: owner, window: view,
    commit: (theme, options) => { owner.documentElement.dataset.theme = theme; commits.push({ theme, ...options }); },
    schedule: (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; },
    cancel: id => timers.delete(id),
  });
  return { owner, transitions, commits, timers, oldStyles, change,
    runTimer() { const [id, timer] = [...timers][0]; timers.delete(id); timer.callback(); } };
}
const flush = async () => { await Promise.resolve(); await Promise.resolve(); };

test('native swipe updates after capture and cleans only its own temporary state', async () => {
  const f = fixture();
  assert.equal(f.change('light'), 'light');
  assert.equal(f.owner.documentElement.dataset.theme, 'dark', 'old state survives until native capture');
  assert.equal(f.owner.documentElement.dataset.themeTransition, 'swipe');
  assert.equal(f.owner.documentElement.dataset.themeDirection, 'light');
  f.transitions[0].update();
  assert.deepEqual(f.commits, [{ theme: 'light', persist: true }]);
  f.transitions[0].finish(); await flush();
  assert.deepEqual(f.owner.documentElement.dataset, { theme: 'light' });
  assert.equal(f.timers.size, 0);
});

test('a skipped pending snapshot cannot overwrite a newer theme choice', async () => {
  const f = fixture();
  f.change('light');
  f.change('dark');
  assert.equal(f.transitions[0].skipped, 1);
  f.transitions[0].update(); f.transitions[0].finish(); await flush();
  assert.deepEqual(f.commits, [{ theme: 'dark', persist: true }]);
  assert.deepEqual(f.owner.documentElement.dataset, { theme: 'dark' });
  assert.equal(f.timers.size, 0);
});

test('a superseded finished promise cannot remove the next swipe or reverse its choice', async () => {
  const f = fixture();
  f.change('light'); f.transitions[0].update();
  f.change('dark');
  f.transitions[0].finish(); await flush();
  assert.equal(f.owner.documentElement.dataset.themeDirection, 'dark');
  assert.equal(f.owner.documentElement.dataset.themeTransition, 'swipe');
  assert.equal(f.timers.size, 1);
  f.transitions[1].update(); f.transitions[1].finish(); await flush();
  assert.deepEqual(f.commits.map(c => c.theme), ['light', 'dark']);
  assert.deepEqual(f.owner.documentElement.dataset, { theme: 'dark' });
  assert.equal(f.timers.size, 0);
});

test('unsupported or failed native snapshots fade once and release the fallback promptly', () => {
  for (const options of [{ native: false }, { throws: true }]) {
    const f = fixture(options);
    f.change('light');
    assert.equal(f.owner.documentElement.dataset.themeTransition, 'fade');
    assert.deepEqual(f.oldStyles, ['dark'], 'the old colors are committed before the new CSS values');
    assert.equal([...f.timers.values()][0].delay, THEME_FADE_DURATION + 40);
    assert.equal(f.commits.length, 1);
    f.runTimer();
    assert.deepEqual(f.owner.documentElement.dataset, { theme: 'light' });
  }
});

test('hidden, reduced-motion, and cross-tab requests apply without a cosmetic wait', async () => {
  for (const options of [{ hidden: true }, { reduced: true }]) {
    const f = fixture(options); f.change('light');
    assert.equal(f.transitions.length, 0); assert.equal(f.timers.size, 0);
    assert.deepEqual(f.owner.documentElement.dataset, { theme: 'light' });
  }
  const f = fixture(); f.change('light');
  f.change('dark', { animate: false, persist: false });
  f.transitions[0].update(); f.transitions[0].finish(); await flush();
  assert.deepEqual(f.commits, [{ theme: 'dark', persist: false }]);
  assert.equal(f.timers.size, 0);
});

test('a skipped capture or stalled transition still reaches its requested final theme', async () => {
  const f = fixture(); f.change('light');
  f.transitions[0].rejectReady();
  f.runTimer(); await flush();
  assert.equal(f.transitions[0].skipped, 1);
  assert.deepEqual(f.owner.documentElement.dataset, { theme: 'light' });
  f.transitions[0].update(); f.transitions[0].finish(); await flush();
  assert.equal(f.commits.length, 1);
  assert.equal(f.timers.size, 0);
});

test('initial theme stays dark by default, restores light, and tolerates unavailable storage', t => {
  const names = ['document', 'localStorage'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  globalThis.document = { documentElement: { dataset: {} } };
  t.after(() => names.forEach(name => { const original = originals.get(name);
    if (original) Object.defineProperty(globalThis, name, original); else delete globalThis[name]; }));
  for (const value of [null, 'dark', 'unexpected']) {
    globalThis.localStorage = { getItem: () => value };
    assert.equal(initializeTheme(), 'dark');
  }
  globalThis.localStorage = { getItem: () => 'light' };
  assert.equal(initializeTheme(), 'light');
  globalThis.localStorage = { getItem: () => { throw new Error('Private storage'); } };
  assert.equal(initializeTheme(), 'dark');
  assert.equal(normalizeTheme('light'), 'light');
});
