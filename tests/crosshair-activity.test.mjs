import assert from 'node:assert/strict';
import test from 'node:test';
import { createCrosshairMutationFilter } from '../src/utils/crosshairActivity.js';

function fixture() {
  const host = {}, canvas = {};
  const relevant = createCrosshairMutationFilter({ host, canvas, selector: () => 'a, button, [data-crosshair-target]' });
  const node = ({ style = '', interactive = false } = {}) => ({
    style, interactive,
    getAttribute() { return this.style; },
    matches() { return this.interactive; },
    querySelector() { return null; },
  });
  const changedStyle = (target, before) => ({ type: 'attributes', attributeName: 'style', target, oldValue: before });
  return { relevant, node, changedStyle, host, canvas };
}

test('moving decorative word ribbons do not wake a stationary crosshair', () => {
  const { relevant, node, changedStyle } = fixture();
  const track = node({ style: 'transform: translate3d(-174px, 0px, 0px); opacity: 1;' });
  assert.equal(relevant([changedStyle(track, 'transform: translate3d(-173px, 0px, 0px); opacity: 1;')]), false);
  track.style = 'transform: translate3d(-175px, 0px, 0px); opacity: .9;';
  assert.equal(relevant([changedStyle(track, 'transform: translate3d(-174px, 0px, 0px); opacity: 1;')]), false);
});

test('moving interactive targets and their ancestors still refresh the cursor lock', () => {
  const { relevant, node, changedStyle } = fixture();
  const button = node({ style: 'transform: translateX(10px)', interactive: true });
  assert.equal(relevant([changedStyle(button, 'transform: translateX(0px)')]), true);
  const panel = node({ style: 'opacity: .5' });
  panel.querySelector = () => button;
  assert.equal(relevant([changedStyle(panel, 'opacity: 1')]), true);
});

test('layout, class, semantic visibility and subtree changes remain observable', () => {
  const { relevant, node, changedStyle, host, canvas } = fixture();
  const panel = node({ style: 'height: 70px; transform: translateX(3px)' });
  assert.equal(relevant([changedStyle(panel, 'height: 50px; transform: translateX(2px)')]), true);
  for (const attributeName of ['class', 'hidden', 'inert', 'aria-hidden', 'disabled']) {
    assert.equal(relevant([{ type: 'attributes', attributeName, target: panel }]), true);
  }
  assert.equal(relevant([{ type: 'childList', target: panel }]), true);
  assert.equal(relevant([changedStyle(host, '')]), true);
  assert.equal(relevant([changedStyle(canvas, '')]), false, 'the cursor must not observe its own painting/status writes');
});

test('adding a button invalidates cached decorative-subtree classification', () => {
  const { relevant, node, changedStyle } = fixture();
  const panel = node({ style: 'transform: translateX(1px)' });
  assert.equal(relevant([changedStyle(panel, 'transform: translateX(0px)')]), false);
  panel.querySelector = () => ({});
  assert.equal(relevant([{ type: 'childList', target: panel }]), true);
  assert.equal(relevant([changedStyle(panel, 'transform: translateX(0px)')]), true);
});
