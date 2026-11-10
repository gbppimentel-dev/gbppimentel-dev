import assert from 'node:assert/strict';
import test from 'node:test';
import { createHeroPlayback, HERO_SLIDE_DELAY, isHeroCovered } from '../src/utils/heroPlayback.js';
import { createColorTransition } from '../src/utils/adaptiveColors.js';

function eventSource() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { listeners.get(name)?.delete(callback); },
    emit(name) { listeners.get(name)?.forEach(callback => callback()); },
  };
}

function browserFixture(t, { hidden = false, reduced = false } = {}) {
  const names = ['window', 'document', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'];
  const originals = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  let clock = 0;
  let nextId = 0;
  const frames = new Map();
  const media = Object.assign(eventSource(), { matches: reduced });
  const document = Object.assign(eventSource(), { hidden });
  globalThis.window = { matchMedia: () => media };
  globalThis.document = document;
  globalThis.performance = { now: () => clock };
  globalThis.requestAnimationFrame = callback => { frames.set(++nextId, callback); return nextId; };
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  t.after(() => {
    for (const [name, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  return {
    media, document, frames,
    tick(now) {
      clock = now;
      const pending = Array.from(frames.values());
      frames.clear();
      pending.forEach(callback => callback(now));
    },
  };
}

function swiperFixture() {
  const autoplay = {
    running: false, paused: false, timeLeft: 2200,
    start() { this.running = true; },
    stop() { this.running = false; },
    resume() { this.paused = false; },
  };
  return { destroyed: false, autoplay, params: { autoplay: { delay: HERO_SLIDE_DELAY } } };
}

test('hero suspension follows the actual overlay and navigation edges', () => {
  // Desktop #about at 1440×900 lands here while scrollY812 is below the old
  // viewport-ratio threshold855. The opaque About scene already covers Hero.
  assert.equal(isHeroCovered({ fixed: true, heroBottom: 900, overlayTop: 88, headerInset: 90 }), true);
  assert.equal(isHeroCovered({ fixed: true, heroBottom: 900, overlayTop: 160, headerInset: 90 }), false);
  assert.equal(isHeroCovered({ fixed: true, heroBottom: 900, overlayTop: 900, headerInset: 90 }), false);
  // On phones Hero scrolls normally. At the About anchor its last pixels sit
  // behind the navigation; scrolling back exposes it and resumes activity.
  assert.equal(isHeroCovered({ heroBottom: 84, overlayTop: 84, headerInset: 90 }), true);
  assert.equal(isHeroCovered({ heroBottom: 160, overlayTop: 160, headerInset: 90 }), false);
  assert.equal(isHeroCovered({ heroBottom: -10, headerInset: 90 }), true);
  assert.equal(isHeroCovered({ fixed: true }), false);
  assert.equal(isHeroCovered({}), false);
});

test('carousel combines offscreen, document, reduced-motion, and manual holds', t => {
  browserFixture(t);
  const swiper = swiperFixture();
  const manualStates = [];
  const player = createHeroPlayback(value => manualStates.push(value));
  player.bind(swiper);
  assert.equal(swiper.autoplay.running, true);
  player.setHold('offscreen', true);
  player.setHold('hidden', true);
  player.setHold('offscreen', false);
  assert.equal(swiper.autoplay.running, false, 'clearing one hold cannot bypass another');
  player.setHold('hidden', false);
  assert.equal(swiper.autoplay.running, true);
  assert.equal(swiper.params.autoplay.delay, 2200, 'resume keeps the unfinished countdown');
  player.setHold('reduced', true);
  player.setHold('hidden', true);
  player.setHold('hidden', false);
  assert.equal(swiper.autoplay.running, false, 'returning to the tab must honor reduced motion');
  assert.equal(manualStates.at(-1), false, 'temporary holds do not change the pause icon choice');
  player.toggle();
  player.setHold('reduced', false);
  assert.equal(swiper.autoplay.running, false, 'manual pause survives cleared automatic holds');
  player.reset(swiper);
  player.toggle();
  assert.equal(swiper.autoplay.running, true);
  assert.equal(swiper.params.autoplay.delay, HERO_SLIDE_DELAY);
});

test('carousel binds stopped in an initially hidden or reduced-motion tab', t => {
  const { document, media } = browserFixture(t, { hidden: true });
  const hiddenSwiper = swiperFixture();
  createHeroPlayback().bind(hiddenSwiper);
  assert.equal(hiddenSwiper.autoplay.running, false);
  document.hidden = false;
  media.matches = true;
  const reducedSwiper = swiperFixture();
  createHeroPlayback().bind(reducedSwiper);
  assert.equal(reducedSwiper.autoplay.running, false);
});

test('color transitions deduplicate targets and finish without background frames', t => {
  const browser = browserFixture(t);
  const paints = [];
  const color = createColorTransition({ initial: '#d8b97c', onUpdate: value => paints.push(value) });
  color.to('#d79998');
  const frame = Array.from(browser.frames.keys())[0];
  color.to('#d79998');
  assert.equal(browser.frames.size, 1);
  assert.equal(Array.from(browser.frames.keys())[0], frame, 'same target must not restart a running transition');
  browser.tick(550);
  assert.equal(paints.at(-1), 'rgb(216, 169, 138)');
  browser.document.hidden = true;
  browser.document.emit('visibilitychange');
  assert.equal(browser.frames.size, 0);
  assert.equal(paints.at(-1), 'rgb(215, 153, 152)');
  color.to('#93aec6');
  assert.equal(browser.frames.size, 0);
  assert.equal(paints.at(-1), 'rgb(147, 174, 198)');
  browser.document.hidden = false;
  color.to('#d8b97c');
  browser.media.matches = true;
  browser.media.emit('change');
  assert.equal(browser.frames.size, 0);
  assert.equal(paints.at(-1), 'rgb(216, 185, 124)');
  browser.media.matches = false;
  color.to('#93aec6');
  assert.equal(browser.frames.size, 1);
  color.finish();
  assert.equal(browser.frames.size, 0, 'an overlay can settle an in-flight transition immediately');
  assert.equal(paints.at(-1), 'rgb(147, 174, 198)');
  color.destroy();
  assert.equal(browser.document.listeners.get('visibilitychange').size, 0);
  assert.equal(browser.media.listeners.get('change').size, 0);
});

test('interrupting a color transition starts from the visible color', t => {
  const browser = browserFixture(t);
  const paints = [];
  const color = createColorTransition({ initial: '#000000', onUpdate: value => paints.push(value), duration: 1000 });
  color.to('#ffffff');
  browser.tick(500);
  assert.equal(paints.at(-1), 'rgb(128, 128, 128)');
  color.to('#000000');
  browser.tick(1000);
  assert.equal(paints.at(-1), 'rgb(64, 64, 64)', 'rapid changes interpolate from the displayed intermediate color');
  color.destroy();
  assert.equal(browser.frames.size, 0);
});

test('shared color updates stay near30Hz and still paint the final color on high-refresh displays', t => {
  const browser = browserFixture(t);
  for (const refresh of [60, 144]) {
    browser.tick(0);
    const paints = [];
    const color = createColorTransition({ initial: '#000000', onUpdate: value => paints.push(value), duration: 1000 });
    color.to('#ffffff');
    for (let frame = 0; frame <= refresh; frame++) browser.tick(frame * 1000 / refresh);
    assert.ok(paints.length <= 33, `${refresh}Hz must not multiply inherited style/canvas writes`);
    assert.equal(paints.at(-1), 'rgb(255, 255, 255)');
    assert.equal(browser.frames.size, 0);
    color.destroy();
  }
});
