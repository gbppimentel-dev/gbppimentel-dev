/* CHANGE VERSION: ADAPTIVE-COLORS-R1 | One interruptible color clock for CSS, canvas and WebGL */
export const ADAPTIVE_COLOR_DURATION = 1100;
export const ADAPTIVE_COLOR_INTERVAL = 5500;

// The visible page keeps its palette rhythm after the hero's player sleeps.
// The owner starts/stops this timer with the shared visibility preferences.
export function startAdaptiveColorCycle({ initialIndex = 0, onChange, count = 3,
  interval = ADAPTIVE_COLOR_INTERVAL, schedule = setTimeout, cancel = clearTimeout }) {
  let index = ((initialIndex % count) + count) % count;
  let timer = 0, stopped = false;
  const advance = () => {
    if (stopped) return;
    index = (index + 1) % count;
    onChange(index);
    timer = schedule(advance, interval);
  };
  timer = schedule(advance, interval);
  return () => { stopped = true; cancel(timer); };
}

const accentListeners = new Set();
let currentAccent = null;

const rgbChannels = color => {
  const value = String(color).trim();
  if (/^#[\da-f]{3}$/i.test(value)) return [...value.slice(1)].map(channel => parseInt(channel + channel, 16));
  if (/^#[\da-f]{6}$/i.test(value)) return value.slice(1).match(/../g).map(channel => parseInt(channel, 16));
  if (/^rgba?\(/i.test(value)) {
    const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
    if (channels?.length === 3 && channels.every(Number.isFinite)) return channels;
  }
  throw new TypeError(`Adaptive colors require a hex or RGB color: ${value}`);
};
const cssColor = channels => `rgb(${channels.map(value => Math.round(Math.min(255, Math.max(0, value)))).join(', ')})`;
const sameColor = (a, b) => a.every((value, index) => Math.abs(value - b[index]) < 0.001);

/** A new target continues from the currently displayed color, including rapid clicks. */
export function createColorTransition({ initial, onUpdate, duration = ADAPTIVE_COLOR_DURATION }) {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = rgbChannels(initial);
  let target = [...current];
  let from = [...current];
  let frame = 0;
  let started = 0;
  let disposed = false;
  const paint = () => onUpdate(cssColor(current));
  const finish = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    current = [...target];
    paint();
  };
  const tick = now => {
    frame = 0;
    if (disposed) return;
    const progress = Math.min(1, Math.max(0, (now - started) / duration));
    const eased = progress * progress * (3 - 2 * progress);
    current = from.map((value, index) => value + (target[index] - value) * eased);
    paint();
    if (progress < 1) frame = requestAnimationFrame(tick);
    else current = [...target];
  };
  const onPreference = () => { if (preference.matches && !disposed) finish(); };
  const onVisibility = () => { if (document.hidden && !disposed && frame) finish(); };
  preference.addEventListener('change', onPreference);
  document.addEventListener('visibilitychange', onVisibility);
  paint();

  return {
    to(color) {
      if (disposed) return;
      const next = rgbChannels(color);
      if (sameColor(next, target)) return;
      cancelAnimationFrame(frame);
      frame = 0;
      from = [...current];
      target = next;
      if (document.hidden || preference.matches || duration <= 0 || sameColor(current, target)) { finish(); return; }
      started = performance.now();
      frame = requestAnimationFrame(tick);
    },
    finish() { if (!disposed) finish(); },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      frame = 0;
      preference.removeEventListener('change', onPreference);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}

export function publishAdaptiveAccent(color) {
  const root = document.documentElement;
  if (root.style.getPropertyValue('--brand-accent') !== color) root.style.setProperty('--brand-accent', color);
  if (color === currentAccent) return;
  currentAccent = color;
  accentListeners.forEach(listener => listener(color));
}

export function getAdaptiveAccent() { return currentAccent; }

export function subscribeAdaptiveAccent(listener) {
  accentListeners.add(listener);
  if (currentAccent) listener(currentAccent);
  return () => accentListeners.delete(listener);
}
/* END OF FILE: ADAPTIVE-COLORS-R1 | adaptiveColors.js */
