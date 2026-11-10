import test from 'node:test';
import assert from 'node:assert/strict';
import { startAdaptiveColorCycle, ADAPTIVE_COLOR_INTERVAL } from '../src/utils/adaptiveColors.js';

test('the section palette advances on its own timer, wraps, and stops cleanly', () => {
  let now = 0, next = 0;
  const timers = new Map(), colors = [];
  const stop = startAdaptiveColorCycle({ initialIndex: 1, onChange: index => colors.push(index),
    schedule: (callback, delay) => { const id = ++next; timers.set(id, { callback, due: now + delay }); return id; },
    cancel: id => timers.delete(id),
  });
  const advance = delay => {
    const end = now + delay;
    while (timers.size) {
      const pending = [...timers].sort((a,b) => a[1].due-b[1].due)[0];
      if (pending[1].due > end) break;
      now = pending[1].due; timers.delete(pending[0]); pending[1].callback();
    }
    now = end;
  };
  advance(ADAPTIVE_COLOR_INTERVAL - 1);
  assert.deepEqual(colors, []);
  advance(1);
  assert.deepEqual(colors, [2]);
  advance(ADAPTIVE_COLOR_INTERVAL * 2);
  assert.deepEqual(colors, [2,0,1]);
  stop();
  advance(ADAPTIVE_COLOR_INTERVAL * 3);
  assert.deepEqual(colors, [2,0,1]);
  assert.equal(timers.size, 0);
});
