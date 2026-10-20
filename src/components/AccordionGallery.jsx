// CHANGE VERSION: INTERACTION-POLISH-R1 | 2026-10-20 | Complete AccordionGallery.jsx
// Adapted from the React Bits AccordionGallery supplied with this project.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/AccordionGallery.css';

const clamp = (value, low, high) => Math.min(Math.max(Number.isFinite(value) ? value : low, low), high);
const itemKey = (item, index) => String(item.id ?? `${item.label || ''}-${item.image || ''}-${index}`);

export default function AccordionGallery({
  items = [], defaultIndex = 0, accentColor = 'var(--brand-accent, #d8b97c)',
  overlayColor = '#14151b', textColor = '#f2e9d6', height = 460, gap = 12,
  radius = 22, expandRatio = 0.62, orientation = 'horizontal', duration = 0.85,
  ease = 'power3.inOut', parallax = 0.5, tilt = 3, stagger = 0.06,
  trigger = 'hover', showLabels = true, grayscale = true, className = '',
  onSelectionChange, label = 'Selected projects', detailsId,
}) {
  const rootRef = useRef(null);
  const panelRefs = useRef([]);
  const buttonRefs = useRef([]);
  const mediaRefs = useRef([]);
  const barRefs = useRef([]);
  const detailRefs = useRef([]);
  const timelineRef = useRef(null);
  const layoutRef = useRef(null);
  const firstRun = useRef(true);
  const mediaSizeRef = useRef(320);
  const callbackRef = useRef(onSelectionChange);
  const [environment, setEnvironment] = useState({ narrow: false, reduced: false });
  const [selection, setSelection] = useState(() => {
    const index = clamp(Math.trunc(defaultIndex), 0, Math.max(0, items.length - 1));
    return items[index] ? itemKey(items[index], index) : null;
  });
  const instanceId = useId().replace(/:/g, '');
  const count = items.length;
  const selectedIndex = items.findIndex((item, index) => itemKey(item, index) === selection);
  const active = count ? (selectedIndex >= 0 ? selectedIndex : clamp(Math.trunc(defaultIndex), 0, count - 1)) : -1;
  const selectedItem = items[active];
  const vertical = orientation === 'vertical' || environment.narrow;
  const ratio = count > 1 ? clamp(expandRatio, 0.2, 0.9) : 1;
  callbackRef.current = onSelectionChange;

  useLayoutEffect(() => {
    const queries = [window.matchMedia('(max-width: 640px)'), window.matchMedia('(prefers-reduced-motion: reduce)')];
    const sync = () => setEnvironment({ narrow: queries[0].matches, reduced: queries[1].matches });
    sync();
    queries.forEach(query => query.addEventListener?.('change', sync));
    return () => queries.forEach(query => query.removeEventListener?.('change', sync));
  }, []);

  useEffect(() => {
    callbackRef.current?.(selectedItem || null, active);
  }, [selectedItem, active]);

  const applyLayout = useCallback((animate = true) => {
    timelineRef.current?.kill();
    const seconds = animate && !environment.reduced ? clamp(duration, 0, 3) : 0;
    const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
    const timeline = gsap.timeline();
    panelRefs.current.slice(0, count).forEach((panel, index) => {
      if (!panel) return;
      const expanded = index === active;
      const rotation = expanded || environment.reduced ? 0 : (index < active ? tilt : -tilt);
      timeline.to(panel, {
        flexGrow: expanded ? grow : 1,
        rotateX: vertical ? -rotation : 0, rotateY: vertical ? 0 : rotation,
        '--ag-dim': expanded ? 0 : 0.36,
        duration: seconds, ease,
      }, 0);
      const media = mediaRefs.current[index];
      if (media) {
        const drift = environment.reduced ? 0 : clamp(active - index, -1.5, 1.5) * parallax * mediaSizeRef.current * 0.06;
        timeline.to(media, {
          xPercent: -50, yPercent: -50,
          x: vertical || expanded ? 0 : drift,
          y: vertical && !expanded ? drift : 0,
          '--ag-gray': grayscale && !expanded ? 1 : 0,
          duration: seconds, ease,
        }, 0);
      }
      const reveal = [barRefs.current[index], detailRefs.current[index]].filter(Boolean);
      if (reveal.length) timeline.to(reveal, {
        opacity: expanded && showLabels ? 1 : 0,
        x: expanded ? 0 : -10,
        duration: expanded ? seconds : seconds * 0.65,
        stagger: environment.reduced || !expanded ? 0 : Math.max(0, stagger), ease,
      }, 0);
    });
    timelineRef.current = timeline;
  }, [active, count, ratio, environment.reduced, duration, ease, vertical, tilt, parallax, grayscale, showLabels, stagger]);
  layoutRef.current = applyLayout;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let frame = 0;
    let previousSize = '';
    const measure = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const signature = `${Math.round(rect.width)}:${Math.round(rect.height)}`;
      if (signature === previousSize) return;
      previousSize = signature;
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - Math.max(0, gap) * Math.max(0, count - 1), 120);
      mediaSizeRef.current = Math.max(140, usable * ratio * 1.22);
      root.style.setProperty('--ag-media-size', `${mediaSizeRef.current}px`);
      // Root dimensions stay fixed while panels animate. Resize never starts a new tween.
      layoutRef.current?.(false);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    observer?.observe(root);
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [vertical, gap, count, ratio]);

  useLayoutEffect(() => {
    panelRefs.current.length = count;
    buttonRefs.current.length = count;
    mediaRefs.current.length = count;
    barRefs.current.length = count;
    detailRefs.current.length = count;
    applyLayout(!firstRun.current);
    firstRun.current = false;
  }, [applyLayout, count]);

  useEffect(() => () => timelineRef.current?.kill(), []);

  const select = index => {
    if (items[index]) setSelection(itemKey(items[index], index));
  };
  const handleKeyDown = (index, event) => {
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % count;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + count) % count;
    else return;
    event.preventDefault();
    select(next);
    buttonRefs.current[next]?.focus({ preventScroll: true });
  };

  if (!count) return null;

  return <div ref={rootRef} className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
    data-ag-instance={instanceId} data-orientation={vertical ? 'vertical' : 'horizontal'}
    style={{
      '--ag-accent': accentColor, '--ag-overlay': overlayColor, '--ag-text': textColor,
      '--ag-gap': `${Math.max(0, gap)}px`, '--ag-radius': `${Math.max(0, radius)}px`,
      '--ag-height': `${Math.max(280, height)}px`,
      '--ag-vertical-height': `${Math.max(420, Math.max(0, count - 1) * 78 + 290 + Math.max(0, count - 1) * Math.max(0, gap))}px`,
    }} role="group" aria-label={label}>
    {items.map((item, index) => {
      const expanded = index === active;
      return <article key={itemKey(item, index)} ref={node => { panelRefs.current[index] = node; }}
        className={`ag-panel${expanded ? ' ag-panel--active' : ''} ag-panel--${item.accent || 'blue'}`}
        style={{ '--ag-dim': expanded ? 0 : 0.36 }}>
        <div className="ag-panel__frame" aria-hidden="true">
          <div className="ag-panel__media" ref={node => { mediaRefs.current[index] = node; }}>
            <img src={item.image} alt="" draggable="false" loading={index === active ? 'eager' : 'lazy'} />
          </div>
          <span className="ag-panel__overlay" />
          {!item.hasScreenshot && <span className="ag-panel__artmark"><span>{String(index + 1).padStart(2, '0')}</span><svg viewBox="0 0 96 96" fill="none"><path d="M48 8v80M8 48h80M20 20l56 56M20 76l56-56" /></svg></span>}
        </div>
        <button type="button" className="ag-panel__select" ref={node => { buttonRefs.current[index] = node; }}
          aria-pressed={expanded} aria-controls={expanded ? detailsId : undefined}
          aria-label={`Show ${item.label || `project ${index + 1}`}`}
          onPointerEnter={event => { if (trigger === 'hover' && event.pointerType !== 'touch') select(index); }}
          onFocus={() => select(index)} onClick={() => select(index)} onKeyDown={event => handleKeyDown(index, event)}>
          <span className="ag-panel__number" aria-hidden="true">/{String(index + 1).padStart(2, '0')}</span>
          {showLabels && <span className="ag-panel__label">
            <span className="ag-panel__bar" ref={node => { barRefs.current[index] = node; }} aria-hidden="true" />
            <span className="ag-panel__label-copy"><span className="ag-panel__text">{item.label}</span>
              <span className="ag-panel__detail" ref={node => { detailRefs.current[index] = node; }} aria-hidden="true">{item.category || 'Selected project'}<span>↗</span></span>
            </span>
          </span>}
          <span className="ag-panel__expand" aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      </article>;
    })}
  </div>;
}
// END OF FILE: INTERACTION-POLISH-R1 | AccordionGallery.jsx
