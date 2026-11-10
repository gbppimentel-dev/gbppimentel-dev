import assert from 'node:assert/strict';
import test from 'node:test';
import { createNavigationKeyHandler, focusNavigationItem, getNavigationStops } from '../src/utils/navigationFocus.js';

function key(key, extra = {}) {
  return { key, prevented: false, preventDefault() { this.prevented = true; }, ...extra };
}

test('menu Tab and Shift+Tab cycle routes, socials, and header controls in both directions', () => {
  const stops = ['home', 'about', 'contact', 'projects', 'netsuite', 'social', 'heart', 'theme', 'close'];
  let active = stops[0], keyboard = 0;
  const handler = createNavigationKeyHandler({ getStops: () => stops, getActiveElement: () => active,
    focus: node => { active = node; }, close: () => {}, onKeyboard: () => keyboard++ });
  for (let index = 1; index <= stops.length; index++) {
    const event = key('Tab'); handler(event);
    assert.equal(active, stops[index % stops.length]);
    assert.equal(event.prevented, true);
  }
  handler(key('Tab', { shiftKey: true }));
  assert.equal(active, 'close');
  handler(key('Tab', { shiftKey: true }));
  assert.equal(active, 'theme');
  assert.equal(keyboard, stops.length + 2);
});

test('Tab recovers outside focus at the first item and reverse Tab at the last item', () => {
  const stops = ['home', 'theme', 'close'];
  let active = 'page';
  const handler = createNavigationKeyHandler({ getStops: () => stops, getActiveElement: () => active,
    focus: node => { active = node; }, close: () => {} });
  handler(key('Tab', { shiftKey: true }));
  assert.equal(active, 'close');
  active = 'page'; handler(key('Tab'));
  assert.equal(active, 'home');
});

test('Escape closes once while native Enter/Space and browser shortcuts pass through', () => {
  let closes = 0, moves = 0;
  const handler = createNavigationKeyHandler({ getStops: () => ['home'], getActiveElement: () => 'home',
    focus: () => moves++, close: () => closes++ });
  for (const event of [key('Enter'), key(' '), key('Tab', { ctrlKey: true }), key('Escape', { isComposing: true })]) {
    handler(event); assert.equal(event.prevented, false);
  }
  const escape = key('Escape'); handler(escape);
  assert.equal(closes, 1); assert.equal(moves, 0); assert.equal(escape.prevented, true);
});

test('focus collection excludes unavailable controls and retains the transparent theme input', () => {
  const node = (name, options = {}) => ({ name, tabIndex: options.tabIndex ?? 0,
    matches: () => Boolean(options.disabled), closest: () => options.inert ? {} : null,
    getClientRects: () => options.noLayout ? [] : [{}],
    ownerDocument: { defaultView: { getComputedStyle: () => ({ visibility: options.visibility || 'visible', opacity: 0 }) } },
  });
  const home = node('home'), theme = node('theme');
  const menu = { querySelectorAll: () => [home, node('disabled', { disabled: true }), node('inert', { inert: true }),
    node('hidden', { visibility: 'hidden' }), node('no layout', { noLayout: true }), node('negative', { tabIndex: -1 })] };
  const actions = { querySelectorAll: () => [theme, home] };
  assert.deepEqual(getNavigationStops(menu, actions), [home, theme]);
});

test('focus reveals clipped rows inside the panel without scrolling the page or header controls', () => {
  const header = { getBoundingClientRect: () => ({ bottom: 80 }) };
  const panel = { scrollTop: 200, contains: item => item.inside,
    getBoundingClientRect: () => ({ top: 0, bottom: 600 }) };
  let focusOptions;
  const item = { inside: true, focus: options => { focusOptions = options; }, getBoundingClientRect: () => ({ top: 40, bottom: 110 }) };
  focusNavigationItem(item, { panel, header });
  assert.deepEqual(focusOptions, { preventScroll: true });
  assert.equal(panel.scrollTop, 148, 'row clears the fixed header');
  item.getBoundingClientRect = () => ({ top: 550, bottom: 630 });
  focusNavigationItem(item, { panel, header });
  assert.equal(panel.scrollTop, 190, 'row clears the panel bottom');
  item.inside = false; focusNavigationItem(item, { panel, header });
  assert.equal(panel.scrollTop, 190, 'header focus does not scroll the panel');
});
