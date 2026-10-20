// CHANGE VERSION: NETSUITE-CROSSHAIR-R1 | 2026-10-20 | Scoped React Bits Crosshair
import { useEffect, useRef } from 'react';

const LINE_STYLES = ['solid', 'dashed', 'dotted'];
const EFFECTS = ['lock', 'glitch', 'none'];
const FONT = '500 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const HIDDEN = 'crosshair-cursor-hidden';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const number = (value, fallback, min, max) => clamp(Number.isFinite(value) ? value : fallback, min, max);
const approach = (value, goal, factor, epsilon = 0.02) => Math.abs(goal - value) < epsilon ? goal : value + (goal - value) * factor;

// Canvas normalizes ordinary CSS colors. Handle short/alpha hex and modern
// computed sRGB as well, rather than reading 0..1 channels as 0..255 values.
const toRgb = (ctx, value) => {
  ctx.fillStyle = '#ffffff';
  ctx.fillStyle = value;
  const color = String(ctx.fillStyle).trim();
  if (/^#[\da-f]{3,8}$/i.test(color)) {
    let hex = color.slice(1);
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map(char => char + char).join('');
    if (hex.length === 6 || hex.length === 8) return {
      r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
    };
  }
  const channels = color.match(/[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?%?/gi)?.map(channel => parseFloat(channel)) || [];
  if (/^color\(srgb\s/i.test(color) && channels.length >= 3) return { r: channels[0] * 255, g: channels[1] * 255, b: channels[2] * 255, a: channels[3] ?? 1 };
  if (/^rgba?\(/i.test(color) && channels.length >= 3) {
    const percent = color.slice(color.indexOf('(') + 1).split(/[\s,/]+/).slice(0, 3).some(channel => channel.includes('%'));
    return { r: channels[0] * (percent ? 2.55 : 1), g: channels[1] * (percent ? 2.55 : 1), b: channels[2] * (percent ? 2.55 : 1), a: channels[3] ?? 1 };
  }
  return { r: 255, g: 255, b: 255, a: 1 };
};

/** `viewport` keeps a long scoped page's bitmap viewport-sized and clips its
 * drawing to the visible host. It does not create a page-height canvas. */
export default function Crosshair({
  color = '#ffffff', containerRef = null, viewport = false, enabled = true,
  thickness = 1, opacity = 0.85, lineStyle = 'solid', gap = 0, fade = 0,
  smoothing = 0.35, showCoordinates = true, targetEffect = 'lock',
  targetSelector = 'a, button, [data-crosshair-target]', clickPulse = true,
  hideCursor = false, blendMode = 'normal', className = '', style,
}) {
  const canvasRef = useRef(null);
  const wakeRef = useRef(null);
  const settingsRef = useRef(null);
  settingsRef.current = {
    color, enabled, thickness: number(thickness, 1, 0.5, 8), opacity: number(opacity, 0.85, 0, 1),
    lineStyle: LINE_STYLES.includes(lineStyle) ? lineStyle : 'solid', gap: number(gap, 0, 0, 200),
    fade: number(fade, 0, 0, 1), smoothing: number(smoothing, 0.35, 0, 1), showCoordinates,
    targetEffect: EFFECTS.includes(targetEffect) ? targetEffect : 'lock', targetSelector, clickPulse, hideCursor,
  };

  useEffect(() => { wakeRef.current?.(); });

  useEffect(() => {
    const canvas = canvasRef.current;
    let ctx;
    try { ctx = canvas?.getContext('2d'); } catch { return undefined; }
    if (!canvas || !ctx) return undefined;
    const host = containerRef?.current ?? null;
    const scope = host ?? window;
    const cursorOwner = host ?? document.documentElement;
    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia?.('(hover: hover) and (pointer: fine)');
    let reduced = !!motionQuery?.matches;
    let fine = pointerQuery ? pointerQuery.matches : true;
    let intersecting = true;
    let raf = 0;
    let last = 0;
    let alive = true;
    let inkSource = '';
    let ink = { r: 255, g: 255, b: 255, a: 1 };
    const size = { w: 0, h: 0, dpr: 1 };
    let canvasBox = { left: 0, top: 0, width: 0, height: 0 };
    let hostBox = null;
    let bounds = { left: 0, top: 0, right: 0, bottom: 0 };
    const state = {
      x: 0, y: 0, tx: 0, ty: 0, clientX: 0, clientY: 0, inside: false, seen: false,
      presence: 0, glitch: 0, target: null, pointerElement: null,
      lock: { x: 0, y: 0, w: 0, h: 0, alpha: 0 }, pulses: [],
    };

    const hiddenCursor = hidden => {
      if (cursorOwner.classList.contains(HIDDEN) !== hidden) cursorOwner.classList.toggle(HIDDEN, hidden);
    };
    const clear = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    const stop = () => {
      cancelAnimationFrame(raf); raf = 0;
      state.inside = false; state.seen = false; state.presence = 0;
      state.target = null; state.lock.alpha = 0; state.glitch = 0; state.pulses = [];
      hiddenCursor(false); clear();
    };
    const allowed = () => alive && fine && intersecting && !document.hidden && settingsRef.current.enabled && settingsRef.current.opacity > 0 && size.w > 0 && size.h > 0;
    const getBounds = () => {
      canvasBox = canvas.getBoundingClientRect();
      hostBox = host?.getBoundingClientRect() ?? null;
      bounds = {
        left: Math.max(0, hostBox ? hostBox.left - canvasBox.left : 0),
        top: Math.max(0, hostBox ? hostBox.top - canvasBox.top : 0),
        right: Math.min(size.w, hostBox ? hostBox.right - canvasBox.left : size.w),
        bottom: Math.min(size.h, hostBox ? hostBox.bottom - canvasBox.top : size.h),
      };
      state.tx = state.clientX - canvasBox.left;
      state.ty = state.clientY - canvasBox.top;
      return bounds.right > bounds.left && bounds.bottom > bounds.top;
    };
    const pointInside = () => state.tx >= bounds.left && state.tx <= bounds.right && state.ty >= bounds.top && state.ty <= bounds.bottom;
    const liveTarget = target => {
      if (!target?.isConnected || (host && !host.contains(target))) return false;
      if (target.closest('[hidden], [inert], [aria-hidden="true"], [disabled], [aria-disabled="true"]')) return false;
      const box = target.getBoundingClientRect();
      return box.width > 0 && box.height > 0;
    };
    const pick = element => {
      if (settingsRef.current.targetEffect === 'none' || !(element instanceof Element)) return null;
      let found;
      try { found = element.closest(settingsRef.current.targetSelector); } catch { return null; }
      return liveTarget(found) ? found : null;
    };
    const atPointer = () => typeof document.elementFromPoint === 'function'
      ? document.elementFromPoint(state.clientX, state.clientY)
      : state.pointerElement;
    const retarget = element => {
      const next = pick(element);
      if (next === state.target) return;
      state.target = next;
      if (next && settingsRef.current.targetEffect === 'glitch' && !reduced) state.glitch = 1;
    };
    const syncPoint = () => {
      if (!getBounds() || !pointInside()) { state.inside = false; state.target = null; hiddenCursor(false); return; }
      const element = atPointer();
      // A menu, loader, header or floating control is not part of this scope.
      if (host && element && !host.contains(element)) { state.inside = false; state.target = null; hiddenCursor(false); return; }
      if (state.inside) retarget(element || state.pointerElement);
    };

    const rgba = alpha => `rgba(${ink.r}, ${ink.g}, ${ink.b}, ${clamp(alpha * ink.a, 0, 1)})`;
    const crisp = (value, width) => (Math.round(value * size.dpr) + (Math.round(width * size.dpr) % 2 ? 0.5 : 0)) / size.dpr;
    const updateInk = () => {
      const value = String(settingsRef.current.color || '#ffffff');
      const resolved = /var\(|currentColor|color-mix\(/i.test(value) ? getComputedStyle(canvas).color : value;
      if (resolved !== inkSource) { inkSource = resolved; ink = toRgb(ctx, resolved); }
    };
    const tag = (text, x, y, align) => {
      ctx.font = FONT;
      const width = ctx.measureText(text).width + 10;
      const height = 16;
      if (bounds.right - bounds.left < width + 8 || bounds.bottom - bounds.top < height + 8) return;
      const left = clamp(align === 'center' ? x - width / 2 : x, bounds.left + 4, bounds.right - width - 4);
      const top = clamp(align === 'middle' ? y - height / 2 : y, bounds.top + 4, bounds.bottom - height - 4);
      ctx.fillStyle = rgba(1);
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') ctx.roundRect(left, top, width, height, 3);
      else ctx.rect(left, top, width, height);
      ctx.fill();
      ctx.fillStyle = ink.r * 0.2126 + ink.g * 0.7152 + ink.b * 0.0722 > 150 ? '#0a0a0a' : '#ffffff';
      ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      ctx.fillText(text, left + width / 2, top + height / 2 + 0.5);
    };
    const segment = (x1, y1, x2, y2, horizontal, s) => {
      const length = horizontal ? x2 - x1 : y2 - y1;
      if (length <= 0) return;
      if (s.fade > 0) {
        const low = horizontal ? bounds.left : bounds.top;
        const high = horizontal ? bounds.right : bounds.bottom;
        const gradient = horizontal ? ctx.createLinearGradient(low, 0, high, 0) : ctx.createLinearGradient(0, low, 0, high);
        const at = clamp(((horizontal ? state.x : state.y) - low) / Math.max(1, high - low), 0.001, 0.999);
        gradient.addColorStop(0, rgba(1 - s.fade)); gradient.addColorStop(at, rgba(1)); gradient.addColorStop(1, rgba(1 - s.fade));
        ctx.strokeStyle = gradient;
      } else ctx.strokeStyle = rgba(1);
      ctx.beginPath();
      if (state.glitch > 0.01) {
        const pieces = Math.max(4, Math.round(length / 28));
        for (let i = 0; i < pieces; i++) {
          const jitter = (Math.random() - 0.5) * 14 * state.glitch;
          const from = i / pieces; const to = (i + 1) / pieces;
          if (horizontal) { ctx.moveTo(x1 + length * from, y1 + jitter); ctx.lineTo(x1 + length * to, y1 + jitter); }
          else { ctx.moveTo(x1 + jitter, y1 + length * from); ctx.lineTo(x1 + jitter, y1 + length * to); }
        }
      } else { ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); }
      ctx.stroke();
    };
    const brackets = (x, y, w, h) => {
      const arm = Math.min(14, w / 3, h / 3);
      ctx.strokeStyle = rgba(1); ctx.lineWidth = Math.max(1.5, settingsRef.current.thickness); ctx.setLineDash([]); ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(x, y + arm); ctx.lineTo(x, y); ctx.lineTo(x + arm, y);
      ctx.moveTo(x + w - arm, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + arm);
      ctx.moveTo(x + w, y + h - arm); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w - arm, y + h);
      ctx.moveTo(x + arm, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + h - arm);
      ctx.stroke();
    };
    const draw = () => {
      const s = settingsRef.current;
      ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0); ctx.clearRect(0, 0, size.w, size.h);
      ctx.save(); ctx.beginPath(); ctx.rect(bounds.left, bounds.top, Math.max(0, bounds.right - bounds.left), Math.max(0, bounds.bottom - bounds.top)); ctx.clip();
      if (state.presence > 0.001) {
        ctx.globalAlpha = state.presence * s.opacity * (1 - 0.6 * state.lock.alpha);
        ctx.lineWidth = s.thickness; ctx.lineCap = s.lineStyle === 'dotted' ? 'round' : 'butt';
        ctx.setLineDash(s.lineStyle === 'dashed' ? [s.thickness * 6, s.thickness * 5] : s.lineStyle === 'dotted' ? [0, s.thickness * 4] : []);
        const x = crisp(state.x, s.thickness); const y = crisp(state.y, s.thickness);
        segment(bounds.left, y, x - s.gap, y, true, s); segment(x + s.gap, y, bounds.right, y, true, s);
        segment(x, bounds.top, x, y - s.gap, false, s); segment(x, y + s.gap, x, bounds.bottom, false, s);
        if (s.hideCursor) { ctx.fillStyle = rgba(1); ctx.beginPath(); ctx.arc(state.x, state.y, Math.max(1.5, s.thickness * 1.5), 0, Math.PI * 2); ctx.fill(); }
        if (s.showCoordinates && state.lock.alpha < 0.999) {
          ctx.globalAlpha = state.presence * s.opacity * (1 - state.lock.alpha);
          const offsetX = hostBox ? hostBox.left - canvasBox.left : 0; const offsetY = hostBox ? hostBox.top - canvasBox.top : 0;
          tag(String(Math.round(state.x - offsetX)), state.x, bounds.top + 8, 'center');
          tag(String(Math.round(state.y - offsetY)), bounds.left + 8, state.y, 'middle');
        }
      }
      if (state.lock.alpha > 0.001) {
        const { x, y, w, h, alpha } = state.lock;
        ctx.globalAlpha = alpha * s.opacity; brackets(x, y, w, h);
        if (s.showCoordinates && liveTarget(state.target)) {
          const box = state.target.getBoundingClientRect();
          tag(`${Math.round(box.width)} × ${Math.round(box.height)}`, x + w / 2, y + h + 8, 'center');
        }
      }
      for (const pulse of state.pulses) {
        const t = pulse.age / 0.55; const eased = 1 - (1 - t) ** 3;
        ctx.globalAlpha = (1 - t) ** 2 * s.opacity; ctx.strokeStyle = rgba(1); ctx.lineWidth = Math.max(1, s.thickness); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(pulse.x, pulse.y, 3 + 30 * eased, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.restore(); ctx.globalAlpha = 1;
    };
    const tick = now => {
      raf = 0;
      if (!allowed() || !getBounds()) { stop(); return; }
      const s = settingsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000)); last = now;
      syncPoint(); updateInk();
      const follow = reduced || s.smoothing === 0 ? 1 : 1 - Math.exp(-dt / (0.008 + s.smoothing * 0.16));
      state.x = approach(state.x, state.tx, follow); state.y = approach(state.y, state.ty, follow);
      const wanted = state.inside ? 1 : 0;
      state.presence = approach(state.presence, wanted, reduced ? 1 : 1 - Math.exp(-dt / (wanted ? 0.12 : 0.25)), 0.002);
      const lock = state.lock; const locked = s.targetEffect === 'lock' && state.inside && liveTarget(state.target) ? state.target : null;
      const box = locked?.getBoundingClientRect();
      const goal = box ? { x: box.left - canvasBox.left - 6, y: box.top - canvasBox.top - 6, w: box.width + 12, h: box.height + 12 } : { x: state.x - 10, y: state.y - 10, w: 20, h: 20 };
      const snap = reduced ? 1 : 1 - Math.exp(-dt / 0.085);
      for (const property of ['x', 'y', 'w', 'h']) lock[property] = approach(lock[property], goal[property], snap);
      const shown = locked ? 1 : 0;
      lock.alpha = approach(lock.alpha, shown, reduced ? 1 : 1 - Math.exp(-dt / (shown ? 0.08 : 0.14)), 0.002);
      state.glitch = reduced ? 0 : Math.max(0, state.glitch - dt / 0.5);
      state.pulses = reduced ? [] : state.pulses.filter(pulse => (pulse.age += dt) < 0.55);
      hiddenCursor(state.inside && s.hideCursor); draw();
      const settling = Math.abs(state.tx - state.x) > 0.05 || Math.abs(state.ty - state.y) > 0.05 || state.presence !== wanted || lock.alpha !== shown
        || (locked && ['x', 'y', 'w', 'h'].some(property => Math.abs(goal[property] - lock[property]) > 0.1)) || state.glitch > 0 || state.pulses.length > 0;
      if (settling && alive) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!allowed() || !getBounds()) { stop(); return; }
      if (!state.inside && !state.presence && !state.lock.alpha && !state.pulses.length) { clear(); return; }
      if (raf) return;
      last = performance.now(); raf = requestAnimationFrame(tick);
    };
    const resize = () => {
      if (!alive) return;
      const rect = canvas.getBoundingClientRect();
      size.w = Math.max(0, rect.width); size.h = Math.max(0, rect.height); size.dpr = number(window.devicePixelRatio, 1, 1, 2);
      const width = Math.max(1, Math.round(size.w * size.dpr)); const height = Math.max(1, Math.round(size.h * size.dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
      wake();
    };
    const leave = () => { state.inside = false; state.target = null; hiddenCursor(false); wake(); };
    const onMove = event => {
      if (event.pointerType === 'touch') { stop(); return; }
      if (!allowed() || event.isPrimary === false) return;
      state.clientX = event.clientX; state.clientY = event.clientY; state.pointerElement = event.target;
      if (!getBounds() || !pointInside()) { leave(); return; }
      const element = atPointer() || event.target;
      if (host && !host.contains(element)) { leave(); return; }
      if (!state.seen) {
        state.seen = true; state.x = state.tx; state.y = state.ty;
        Object.assign(state.lock, { x: state.x - 10, y: state.y - 10, w: 20, h: 20 });
      }
      state.inside = true; retarget(element); wake();
    };
    const onDown = event => {
      if (event.button !== 0 || event.isPrimary === false || event.pointerType === 'touch') return;
      onMove(event);
      if (!state.inside || !settingsRef.current.clickPulse || reduced) return;
      state.pulses.push({ x: state.tx, y: state.ty, age: 0 });
      if (state.pulses.length > 12) state.pulses.shift();
      wake();
    };
    const onUp = event => { if (event.pointerType && event.pointerType !== 'mouse') leave(); };
    const onWindowOut = event => { if (!event.relatedTarget) leave(); };
    const onScroll = () => { if (state.seen) { syncPoint(); wake(); } };
    const onMotion = () => {
      reduced = !!motionQuery?.matches;
      if (reduced) { state.pulses = []; state.glitch = 0; }
      wake();
    };
    const onPointerPreference = () => { fine = pointerQuery ? pointerQuery.matches : true; if (!fine) stop(); else resize(); };
    const onVisibility = () => { if (document.hidden) stop(); };
    const onMutation = () => { if (state.seen) { syncPoint(); wake(); } };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(canvas); if (host) observer?.observe(host);
    const intersection = host && typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      intersecting = entries[entries.length - 1]?.isIntersecting ?? true;
      if (!intersecting) stop(); else resize();
    }) : null;
    intersection?.observe(host);
    const mutation = host && typeof MutationObserver !== 'undefined' ? new MutationObserver(onMutation) : null;
    mutation?.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'inert', 'aria-hidden', 'class', 'style', 'disabled'] });
    // Menus/loaders can cover a stationary pointer after the animation settles.
    // Observe their semantic visibility changes, excluding animated style writes
    // (for example the site's independent custom cursor transform).
    const overlays = host && typeof MutationObserver !== 'undefined' ? new MutationObserver(records => {
      if (records.some(record => record.target !== canvas && !host.contains(record.target))) onMutation();
    }) : null;
    overlays?.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'inert', 'aria-hidden', 'aria-expanded', 'data-open', 'class'] });
    scope.addEventListener('pointermove', onMove, { passive: true }); scope.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true }); window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('scroll', onScroll, { capture: true, passive: true }); window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('blur', stop); document.addEventListener('visibilitychange', onVisibility);
    motionQuery?.addEventListener?.('change', onMotion); pointerQuery?.addEventListener?.('change', onPointerPreference);
    if (host) host.addEventListener('pointerleave', leave); else document.addEventListener('pointerout', onWindowOut);
    wakeRef.current = () => {
      if (!settingsRef.current.enabled) stop();
      else { syncPoint(); wake(); }
    };
    resize();
    return () => {
      alive = false; stop(); observer?.disconnect(); intersection?.disconnect(); mutation?.disconnect(); overlays?.disconnect();
      scope.removeEventListener('pointermove', onMove); scope.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp); window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', resize); window.removeEventListener('blur', stop); document.removeEventListener('visibilitychange', onVisibility);
      motionQuery?.removeEventListener?.('change', onMotion); pointerQuery?.removeEventListener?.('change', onPointerPreference);
      if (host) host.removeEventListener('pointerleave', leave); else document.removeEventListener('pointerout', onWindowOut);
      wakeRef.current = null;
    };
  }, [containerRef, viewport]);

  return <>
    {hideCursor && <style>{`.${HIDDEN}, .${HIDDEN} * { cursor: none !important; }`}</style>}
    <canvas ref={canvasRef} aria-hidden="true" className={className} data-crosshair="" style={{
      position: viewport || !containerRef ? 'fixed' : 'absolute', inset: 0,
      width: viewport ? '100vw' : '100%', height: viewport ? '100vh' : '100%',
      pointerEvents: 'none', zIndex: 3, color, mixBlendMode: blendMode, ...style,
    }} />
  </>;
}
// END OF FILE: NETSUITE-CROSSHAIR-R1 | Crosshair.jsx
