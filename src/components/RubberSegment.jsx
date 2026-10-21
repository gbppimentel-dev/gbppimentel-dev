// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R6 | Elastic, accessible tabs adapted from React Bits RubberSegment
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react';
import '../styles/RubberSegment.css';

const EASE_OUT = [.23, 1, .32, 1];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const rubber = (over, size) => (over * size * .55) / (size + .55 * Math.abs(over));
const projection = (velocity, glide) => {
  const decay = 1 - .1 * Math.pow(.05, clamp(glide, 0, 100) / 100);
  return glide <= 0 ? 0 : ((velocity / 1000) * decay) / (1 - decay);
};
const rectOf = element => {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
};

/** A single background stretches between real tab rectangles, including wrapped
 * rows. Labels stay in their original buttons, so no clipped duplicate copy is
 * exposed to users or assistive technology. */
export default function RubberSegment({
  items = [], value, defaultValue, onChange,
  trackColor = '#ededf1', thumbColor = '#ffffff', textColor = '#5f6d65', activeTextColor = '#1c6538',
  size = 'lg', radius = 13, inset = 6, equalSlots = true,
  stretch = 100, squash = 3, speed = 1, glide = 75, draggable = false, disabled = false,
  className = '', 'aria-label': ariaLabel = 'Case study sections',
}) {
  const list = items.map(item => typeof item === 'string' ? { value: item, label: item } : item);
  const [inner, setInner] = useState(defaultValue ?? list[0]?.value);
  const current = value === undefined ? inner : value;
  const index = Math.max(0, list.findIndex(item => item.value === current));
  const reduce = useReducedMotion();
  const root = useRef(null);
  const buttons = useRef([]);
  const slots = useRef([]);
  const committed = useRef(index);
  const currentIndex = useRef(index);
  const generation = useRef(0);
  const handoff = useRef(0);
  const frame = useRef(0);
  const dragging = useRef(null);
  const ignoreClickUntil = useRef(0);
  const [ready, setReady] = useState(false);
  currentIndex.current = index;

  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const width = useTransform(() => Math.max(0, right.get() - left.get()));
  const height = useTransform(() => Math.max(0, bottom.get() - top.get()));
  const duration = seconds => seconds / Math.max(.25, speed);
  const listKey = list.map(item => item.value).join('|');

  const stop = () => {
    clearTimeout(handoff.current);
    generation.current += 1;
    left.stop(); right.stop(); top.stop(); bottom.stop();
  };
  const markMoving = moving => {
    if (root.current) root.current.dataset.moving = String(moving);
  };
  const jump = to => {
    const slot = slots.current[to];
    if (!slot) return;
    stop();
    left.jump(slot.left); right.jump(slot.right); top.jump(slot.top); bottom.jump(slot.bottom);
    markMoving(false);
  };
  const measure = () => {
    const track = root.current;
    if (!track || track.getBoundingClientRect().width <= 0) return;
    const origin = rectOf(track);
    const next = list.map((_, itemIndex) => {
      const button = buttons.current[itemIndex];
      if (!button) return null;
      const rect = rectOf(button);
      return { left: rect.left - origin.left, right: rect.right - origin.left, top: rect.top - origin.top, bottom: rect.bottom - origin.top };
    });
    slots.current = next;
    committed.current = currentIndex.current;
    jump(committed.current);
    setReady(true);
  };

  useLayoutEffect(() => {
    let disposed = false;
    const schedule = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => { if (!disposed) measure(); });
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    if (root.current) observer?.observe(root.current);
    buttons.current.forEach(button => { if (button) observer?.observe(button); });
    document.fonts?.ready.then(schedule).catch(() => {});
    window.addEventListener('resize', schedule);
    return () => {
      disposed = true; observer?.disconnect(); cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', schedule);
    };
    // Measurements follow real slot geometry, not the identities of label nodes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey, size, inset, equalSlots, className]);

  const land = (to, velocity = null, flick = false, withSquash = true) => {
    const target = slots.current[to];
    if (!target) return;
    const token = ++generation.current;
    const direction = Math.sign((target.left + target.right) - (left.get() + right.get())) || 1;
    const horizontal = Math.abs(target.top - top.get()) < 2;
    const stretchBy = withSquash && horizontal && !reduce ? clamp(squash, 0, 6) : 0;
    const settle = (motionValue, targetValue, overshoot = 0, axis = 'x') => {
      const initialVelocity = velocity ? velocity[axis] : motionValue.getVelocity();
      return animate(motionValue, targetValue + overshoot, {
        type: 'spring', duration: duration(flick ? .4 : .32), bounce: flick ? .15 : 0,
        velocity: clamp(initialVelocity, -2000, 2000),
      }).then(() => {
        if (token !== generation.current || !overshoot) return;
        return animate(motionValue, targetValue, { type: 'spring', duration: duration(.16), bounce: 0 });
      });
    };
    const trailingLeft = direction > 0 ? direction * stretchBy : 0;
    const trailingRight = direction < 0 ? direction * stretchBy : 0;
    Promise.all([
      settle(left, target.left, trailingLeft), settle(right, target.right, trailingRight),
      settle(top, target.top, 0, 'y'), settle(bottom, target.bottom, 0, 'y'),
    ]).then(() => { if (token === generation.current) markMoving(false); });
  };
  const travel = to => {
    const target = slots.current[to];
    if (!target) return;
    stop();
    if (reduce) { jump(to); return; }
    markMoving(true);
    const amount = clamp(stretch / 100, 0, 1);
    const tween = { duration: duration(.19), ease: EASE_OUT };
    const start = { left: left.get(), right: right.get(), top: top.get(), bottom: bottom.get() };
    animate(left, target.left + (Math.min(start.left, target.left) - target.left) * amount, tween);
    animate(right, target.right + (Math.max(start.right, target.right) - target.right) * amount, tween);
    animate(top, target.top + (Math.min(start.top, target.top) - target.top) * amount * .55, tween);
    animate(bottom, target.bottom + (Math.max(start.bottom, target.bottom) - target.bottom) * amount * .55, tween);
    handoff.current = setTimeout(() => land(to), duration(.15) * 1000);
  };
  const select = (to, source = 'click', dragVelocity = null) => {
    const item = list[to];
    if (disabled || !item || item.disabled) return;
    const changed = to !== committed.current;
    committed.current = to;
    if (value === undefined) setInner(item.value);
    if (changed || source === 'drag') {
      if (source === 'drag' && !reduce) { stop(); markMoving(true); land(to, dragVelocity, true); }
      else travel(to);
    }
    onChange?.(item.value, to, { source });
  };

  useEffect(() => {
    if (!dragging.current && committed.current !== index) {
      committed.current = index;
      travel(index);
    }
    // Controlled selection changes use the same motion as pointer selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  useEffect(() => {
    if (reduce) jump(committed.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);
  useEffect(() => () => { stop(); cancelAnimationFrame(frame.current); }, []);

  const keyDown = event => {
    if (disabled || !list.length) return;
    let next = null;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % list.length;
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + list.length) % list.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = list.length - 1;
    if (next === null) return;
    event.preventDefault();
    if (next !== index) select(next, 'keyboard');
    buttons.current[next]?.focus({ preventScroll: true });
  };
  const pointerDown = (event, itemIndex) => {
    if (!draggable || disabled || reduce || itemIndex !== index || event.button !== 0) return;
    const slot = slots.current[itemIndex];
    if (!slot) return;
    stop();
    dragging.current = { id: event.pointerId, x: event.clientX, y: event.clientY, slot, live: false, history: [[event.timeStamp, event.clientX, event.clientY]] };
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
  };
  const pointerMove = event => {
    const drag = dragging.current;
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.live && Math.hypot(dx, dy) < 4) return;
    drag.live = true;
    if (root.current) root.current.dataset.held = '';
    drag.history.push([event.timeStamp, event.clientX, event.clientY]);
    if (drag.history.length > 8) drag.history.shift();
    const box = root.current.getBoundingClientRect();
    const w = drag.slot.right - drag.slot.left, h = drag.slot.bottom - drag.slot.top;
    const soften = (position, max, dim) => position < inset ? inset - rubber(inset - position, dim) : position > max ? max + rubber(position - max, dim) : position;
    const x = soften(drag.slot.left + dx, box.width - inset - w, w);
    const y = soften(drag.slot.top + dy, box.height - inset - h, h);
    left.set(x); right.set(x + w); top.set(y); bottom.set(y + h);
  };
  const finishDrag = (event, cancel = false) => {
    const drag = dragging.current;
    if (!drag || event.pointerId !== drag.id) return;
    dragging.current = null;
    if (root.current) delete root.current.dataset.held;
    if (!drag.live) return;
    ignoreClickUntil.current = performance.now() + 250;
    if (cancel) { travel(committed.current); return; }
    const recent = drag.history.filter(sample => event.timeStamp - sample[0] <= 100);
    const first = recent[0], last = recent[recent.length - 1];
    const dt = first && last ? last[0] - first[0] : 0;
    const velocity = dt >= 8 ? { x: clamp((last[1] - first[1]) / dt * 1000, -2000, 2000), y: clamp((last[2] - first[2]) / dt * 1000, -2000, 2000) } : { x: 0, y: 0 };
    const x = (left.get() + right.get()) / 2 + projection(velocity.x, glide);
    const y = (top.get() + bottom.get()) / 2 + projection(velocity.y, glide);
    let nearest = committed.current, distance = Infinity;
    slots.current.forEach((slot, itemIndex) => {
      if (!slot || list[itemIndex]?.disabled) return;
      const next = Math.hypot((slot.left + slot.right) / 2 - x, (slot.top + slot.bottom) / 2 - y);
      if (next < distance) { nearest = itemIndex; distance = next; }
    });
    select(nearest, 'drag', velocity);
  };

  return <div ref={root} role="tablist" aria-label={ariaLabel} aria-orientation="horizontal" aria-disabled={disabled || undefined}
    className={['rubber-segment', className].filter(Boolean).join(' ')} data-size={size} data-equal={equalSlots ? '' : undefined}
    data-ready={ready ? '' : undefined} data-selected-value={list[index]?.value} data-draggable={draggable && !disabled ? '' : undefined}
    style={{ '--rs-track': trackColor, '--rs-thumb': thumbColor, '--rs-ink': textColor, '--rs-ink-active': activeTextColor, '--rs-radius': `${radius}px`, '--rs-inset': `${inset}px`, '--rs-thumb-radius': `${Math.max(0, radius - inset)}px` }}
    onPointerMove={pointerMove} onPointerUp={event => finishDrag(event)} onPointerCancel={event => finishDrag(event, true)} onLostPointerCapture={event => finishDrag(event, true)}>
    <motion.div className="rubber-segment__thumb" aria-hidden="true" style={{ x: left, y: top, width, height, opacity: ready ? 1 : 0 }} />
    {list.map((item, itemIndex) => <button key={item.value} ref={node => { buttons.current[itemIndex] = node; }} type="button" role="tab"
      id={item.id} aria-controls={item.panelId} aria-label={item.ariaLabel} aria-selected={itemIndex === index}
      tabIndex={itemIndex === index ? 0 : -1} disabled={disabled || item.disabled} className="rubber-segment__item"
      data-value={item.value} onPointerDown={event => pointerDown(event, itemIndex)} onKeyDown={keyDown}
      onClick={event => { if (event.detail > 0 && performance.now() < ignoreClickUntil.current) return; select(itemIndex); }}>
      {item.icon}<span className="rubber-segment__label">{item.label}</span>
    </button>)}
  </div>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R6 | RubberSegment.jsx
