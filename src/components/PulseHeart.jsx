// CHANGE VERSION: HEARTS-PAGES-R1 | 2026-10-20 | Complete PulseHeart.jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../styles/PulseHeart.css';

// Adapted from React Bits PulseHeart; the built-in glyph needs no icon package.
const OUT = 0.4;
const PATHS = {
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z',
  star: 'm12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.19l-5.56 2.93 1.06-6.2L3 9.53l6.22-.9L12 3Z',
  thumb: 'M7 10v11H3V10h4Zm0 0 5-8a3 3 0 0 1 2 3v4h5a2 2 0 0 1 1.97 2.35l-1.4 8A2 2 0 0 1 17.6 21H7',
};
const cleanCount = value => Number.isFinite(value) ? Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value))) : 0;
const bounded = (value, fallback, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
const format = value => new Intl.NumberFormat().format(value);
const back = (k, c) => { const u = k - 1; return 1 + (c + 1) * u ** 3 + c * u ** 2; };
const swellOf = (t, c) => t <= 0 ? 0 : t < OUT ? 1 - (1 - t / OUT) ** 3 : 1 - back((t - OUT) / (1 - OUT), c);

export default function PulseHeart({
  liked: likedProp, defaultLiked = false, count = 0, onChange,
  showCount = true, icon = 'heart', idleOutline = true,
  size = 32, corner = 22, likedColor = '#d18c82', idleColor = '#aaa9b4',
  pillColor = '#23242e', textColor = '#f2e9d6', duration = 560,
  dotSize = 0.3, overshoot = 1.7, beat = 3, rollDuration = 350,
  disabled = false, label = 'Give this page a heart', className = '',
}) {
  const controlled = likedProp !== undefined;
  const [inner, setInner] = useState(Boolean(defaultLiked));
  const [total, setTotal] = useState(() => cleanCount(count));
  const liked = controlled ? Boolean(likedProp) : inner;
  const actualCount = controlled ? cleanCount(count) : total;
  const [shown, setShown] = useState(() => ({ liked, count: cleanCount(count) }));
  const [roll, setRoll] = useState(null);
  const rootRef = useRef(null), pillRef = useRef(null), heartRef = useRef(null), glyphRef = useRef(null), rollRef = useRef(null);
  const raf = useRef(0), rollTimer = useRef(0), shownRef = useRef(shown), reduced = useRef(false), finishRef = useRef(null);
  const logical = useRef({ liked, count: actualCount });
  logical.current = { liked, count: actualCount };
  const cfg = useRef(null);
  cfg.current = {
    duration: bounded(duration, 560, 120, 3000), dotSize: bounded(dotSize, 0.3, 0.05, 1),
    overshoot: bounded(overshoot, 1.7, 0, 4), beat: bounded(beat, 3, 0, 15),
    rollDuration: bounded(rollDuration, 350, 0, 2000),
  };

  const display = next => { shownRef.current = next; setShown(next); };
  const resetTransforms = () => {
    glyphRef.current?.removeAttribute('transform');
    if (heartRef.current) heartRef.current.style.transform = '';
    if (pillRef.current) pillRef.current.style.transform = '';
    if (rootRef.current) { delete rootRef.current.dataset.running; delete rootRef.current.dataset.pressed; }
  };
  finishRef.current = () => {
    cancelAnimationFrame(raf.current); raf.current = 0;
    clearTimeout(rollTimer.current); setRoll(null); resetTransforms(); display({ ...logical.current });
  };

  useEffect(() => { if (!controlled) setTotal(cleanCount(count)); }, [count, controlled]);
  useLayoutEffect(() => {
    if (raf.current) return;
    if (shownRef.current.liked !== liked || shownRef.current.count !== actualCount) {
      clearTimeout(rollTimer.current); setRoll(null); display({ liked, count: actualCount });
    }
  }, [liked, actualCount]);

  useLayoutEffect(() => {
    const el = rollRef.current;
    if (!el || !roll) return;
    el.style.transition = 'none'; el.style.transform = `translateY(${roll.up ? '0' : '-1em'})`;
    el.getBoundingClientRect(); el.style.transition = '';
    el.style.transform = `translateY(${roll.up ? '-1em' : '0'})`;
  }, [roll]);

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => { reduced.current = Boolean(query?.matches); if (reduced.current) finishRef.current?.(); };
    update(); query?.addEventListener?.('change', update);
    return () => { cancelAnimationFrame(raf.current); clearTimeout(rollTimer.current); query?.removeEventListener?.('change', update); };
  }, []);

  useEffect(() => { if (disabled && rootRef.current) delete rootRef.current.dataset.pressed; }, [disabled]);

  const startRoll = (from, to) => {
    if (from === to || reduced.current) return;
    const a = format(from), b = format(to);
    const changed = a.length === b.length ? [...b].flatMap((ch, i) => ch !== a[i] ? [i] : []) : [];
    setRoll({ a, b, at: changed.length === 1 ? changed[0] : -1, up: to > from });
    clearTimeout(rollTimer.current); rollTimer.current = setTimeout(() => setRoll(null), cfg.current.rollDuration);
  };

  const run = () => {
    const root = rootRef.current, heart = heartRef.current, pill = pillRef.current, glyph = glyphRef.current;
    if (!root || !heart || !pill) return;
    root.dataset.running = '';
    let swapped = false;
    const start = performance.now();
    const tick = now => {
      const { duration: time, dotSize: dot, overshoot: bounce, beat: dip } = cfg.current;
      const t = Math.min(1, (now - start) / time), swell = swellOf(t, bounce), scale = 1 - (1 - dot) * swell;
      if (glyph) glyph.setAttribute('transform', `translate(12 12) scale(${scale}) translate(-12 -12)`);
      else heart.style.transform = `scale(${scale})`;
      pill.style.transform = `scale(${1 - (dip / 100) * swell})`;
      if (!swapped && t >= OUT) {
        swapped = true;
        // The parent may already have reconciled a network response or rollback.
        // Always reveal the latest state, never a stale count captured at click.
        const next = { ...logical.current };
        startRoll(shownRef.current.count, next.count); display(next);
      }
      if (t < 1) { raf.current = requestAnimationFrame(tick); return; }
      raf.current = 0; resetTransforms();
      const next = logical.current;
      if (next.liked !== shownRef.current.liked || next.count !== shownRef.current.count) {
        clearTimeout(rollTimer.current); setRoll(null); display({ ...next });
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const handleClick = () => {
    if (disabled || raf.current) return;
    const current = logical.current;
    const next = { liked: !current.liked, count: cleanCount(current.count + (current.liked ? -1 : 1)) };
    logical.current = next;
    if (!controlled) { setInner(next.liked); setTotal(next.count); }
    onChange?.(next.liked, next.count);
    if (reduced.current) { resetTransforms(); display(next); }
    else run();
  };
  const release = () => { if (rootRef.current) delete rootRef.current.dataset.pressed; };
  const press = event => { if (event.button === 0 && !disabled && !reduced.current && rootRef.current) rootRef.current.dataset.pressed = ''; };
  const path = typeof icon === 'string' ? PATHS[icon] || PATHS.heart : null;
  const text = format(shown.count);
  const cells = roll ? roll.at === -1
    ? [{ top: roll.up ? roll.a : roll.b, bottom: roll.up ? roll.b : roll.a }]
    : [...roll.b].map((char, index) => index === roll.at ? { top: roll.up ? roll.a[index] : char, bottom: roll.up ? char : roll.a[index] } : { char })
    : [...text].map(char => ({ char }));
  const glyphSize = bounded(size, 32, 16, 80);

  return <button ref={rootRef} type="button" aria-pressed={liked} disabled={disabled}
    data-liked={String(shown.liked)} data-solid={idleOutline ? undefined : ''} data-no-count={showCount ? undefined : ''}
    className={`pulse-heart${className ? ` ${className}` : ''}`} style={{
      '--ph-size': `${glyphSize}px`, '--ph-corner': `${bounded(corner, 22, 0, 100)}px`, '--ph-pill': pillColor,
      '--ph-idle': idleColor, '--ph-liked': likedColor, '--ph-text': textColor,
      '--ph-roll': `${cfg.current.rollDuration}ms`, '--ph-stroke': `${(1.5 * glyphSize) / 24}px`,
    }} onPointerDown={press} onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
    onBlur={release} onClick={handleClick}>
    <span ref={pillRef} className="pulse-heart__pill">
      <span ref={heartRef} className="pulse-heart__heart" aria-hidden="true">
        {path ? <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g ref={glyphRef}><path d={path} vectorEffect="non-scaling-stroke" /></g></svg> : icon}
      </span>
      {showCount && <span className="pulse-heart__count" aria-hidden="true">{cells.map((cell, index) => 'char' in cell
        ? <span key={`c${index}`}>{cell.char}</span>
        : <span key={`r${index}`} className="pulse-heart__slot"><span ref={rollRef} className="pulse-heart__roll"><span>{cell.top}</span><span>{cell.bottom}</span></span></span>)}</span>}
      <span className="pulse-heart__sr">{showCount ? `${label}, ${format(actualCount)} ${actualCount === 1 ? 'heart' : 'hearts'}` : label}</span>
    </span>
  </button>;
}
// END OF FILE: HEARTS-PAGES-R1 | PulseHeart.jsx
