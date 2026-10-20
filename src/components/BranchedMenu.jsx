/* CHANGE VERSION: INTERACTION-POLISH-R1 | Animated branch navigation adapted from the supplied React Bits component */
import { isValidElement, useId, useLayoutEffect, useRef, useState } from 'react';
import '../styles/BranchedMenu.css';

const DEFAULT_ITEMS = [
  { label: 'Development', children: [{ value: 'interfaces', label: 'Interfaces' }, { value: 'automation', label: 'Automation' }] },
  { label: 'Design', children: [{ value: 'experiences', label: 'Experiences' }, { value: 'visuals', label: 'Visuals' }] },
  { label: 'ERP solutions', children: [{ value: 'workflows', label: 'Workflows' }, { value: 'systems', label: 'Business systems' }] },
];
const PAD = 6;
const MARK = 16;
const finite = (value, fallback, minimum) => Number.isFinite(value) ? Math.max(minimum, value) : fallback;
const childrenOf = item => Array.isArray(item?.children) ? item.children.filter(Boolean) : [];
const valueOf = item => item.value ?? item.label;
const toSet = value => new Set(Array.isArray(value) ? value : value >= 0 ? [value] : []);

export default function BranchedMenu({
  items = DEFAULT_ITEMS, defaultOpen = 0, defaultActive = '', onSelect, onToggle,
  color = '#f2efe8', accentColor = 'var(--brand-accent, var(--amber))', lineColor = '#465160',
  width = 280, rowHeight = 32, indent = 35, trunk = 9, radius = 9, lineWidth = 1.5,
  fontSize = 13, drawDuration = 400, foldDuration = 360, singleOpen = false,
  reserveOpenSpace = false, label = 'Explore topics', className = '',
}) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  const validOpen = values => [...toSet(values)].filter(index => childrenOf(list[index]).length);
  const [open, setOpen] = useState(() => new Set(singleOpen ? validOpen(defaultOpen).slice(0, 1) : validOpen(defaultOpen)));
  const [active, setActive] = useState(() => defaultActive || childrenOf(list.find((item, index) => toSet(defaultOpen).has(index)))[0]?.value || '');
  const navRef = useRef(null);
  const heads = useRef([]);
  const markerRef = useRef(null);
  const latest = useRef({ onSelect, onToggle });
  latest.current = { onSelect, onToggle };
  const rawId = useId();
  const menuId = `branches-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const row = finite(rowHeight, 32, 24);
  const font = finite(fontSize, 13, 10);
  const childIndent = finite(indent, 35, 24);
  const trunkX = Math.min(finite(trunk, 9, 1), childIndent - 16);
  const r = Math.min(finite(radius, 9, 0), row / 2 - 2, (childIndent - 8) - trunkX);
  const endX = childIndent - 8;
  const rowY = index => PAD + index * row + row / 2;
  const branch = index => `M ${trunkX} ${rowY(index) - r} A ${r} ${r} 0 0 0 ${trunkX + r} ${rowY(index)} H ${endX}`;
  const reach = index => `M ${trunkX} 0 V ${rowY(index) - r} A ${r} ${r} 0 0 0 ${trunkX + r} ${rowY(index)} H ${endX}`;
  const length = index => rowY(index) - r + (Math.PI * r) / 2 + (endX - trunkX - r);
  const activeSection = list.findIndex(item => childrenOf(item).some(child => valueOf(child) === active));
  const markerShown = activeSection >= 0 && open.has(activeSection);

  useLayoutEffect(() => {
    const place = () => {
      const marker = markerRef.current;
      const head = heads.current[activeSection];
      if (!marker) return;
      if (markerShown && head) marker.style.top = `${head.offsetTop + (head.offsetHeight - MARK) / 2}px`;
      marker.toggleAttribute('data-on', Boolean(markerShown && head));
    };
    place();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(place);
    if (navRef.current) observer?.observe(navRef.current);
    window.addEventListener('resize', place);
    return () => { observer?.disconnect(); window.removeEventListener('resize', place); };
  }, [activeSection, markerShown, items, font, row]);

  const select = (value, item) => { setActive(value); latest.current.onSelect?.(value, item); };
  const toggle = index => {
    const isOpen = !open.has(index);
    const next = singleOpen ? new Set() : new Set(open);
    if (isOpen) next.add(index); else next.delete(index);
    setOpen(next);
    latest.current.onToggle?.(index, isOpen);
  };
  const largestFold = Math.max(0, ...list.map(item => childrenOf(item).length));
  const reservedHeight = reserveOpenSpace && singleOpen ? list.length * row + (largestFold ? PAD * 2 + largestFold * row : 0) : undefined;

  return <nav ref={navRef} className={`branched-menu ${className}`.trim()} aria-label={label} style={{
    '--bm-w': `${finite(width, 280, 100)}px`, '--bm-ink': color, '--bm-accent': accentColor,
    '--bm-line': lineColor, '--bm-font': `${font}px`, '--bm-row': `${row}px`, '--bm-indent': `${childIndent}px`,
    '--bm-line-w': finite(lineWidth, 1.5, 0.5), '--bm-draw': `${finite(drawDuration, 400, 0)}ms`,
    '--bm-fold': `${finite(foldDuration, 360, 0)}ms`, minHeight: reservedHeight,
  }}>
    <span ref={markerRef} className="branched-menu__marker" aria-hidden="true" />
    {list.map((item, index) => {
      const kids = childrenOf(item);
      const isSection = kids.length > 0;
      const isOpen = isSection && open.has(index);
      const leafValue = valueOf(item);
      const leafActive = !isSection && leafValue === active;
      const bodyHeight = PAD * 2 + kids.length * row;
      const headId = `${menuId}-head-${index}`;
      const bodyId = `${menuId}-body-${index}`;
      return <div key={item.value ?? `${item.label}-${index}`} className="branched-menu__section" data-open={isOpen ? '' : undefined}>
        <button ref={element => { heads.current[index] = element; }} type="button" id={headId} className="branched-menu__head"
          aria-expanded={isSection ? isOpen : undefined} aria-controls={isSection ? bodyId : undefined}
          aria-current={leafActive ? 'true' : undefined} data-active={leafActive ? '' : undefined}
          onClick={() => isSection ? toggle(index) : select(leafValue, item)}>
          <span>{item.label}</span>{isSection && <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 5 5 5-5 5" /></svg>}
        </button>
        {isSection && <div id={bodyId} className="branched-menu__body" aria-labelledby={headId} aria-hidden={!isOpen} inert={!isOpen}>
          <div className="branched-menu__fold"><div className="branched-menu__tree" style={{ height: bodyHeight }}>
            <svg className="branched-menu__lines" width={childIndent} height={bodyHeight} aria-hidden="true">
              <path className="branched-menu__base" d={`M ${trunkX} 0 V ${rowY(kids.length - 1) - r}`} />
              {kids.map((kid, childIndex) => <path key={valueOf(kid)} className="branched-menu__base" d={branch(childIndex)} />)}
              {kids.map((kid, childIndex) => <path key={valueOf(kid)} className="branched-menu__reach" d={reach(childIndex)} style={{ strokeDasharray: length(childIndex), strokeDashoffset: valueOf(kid) === active ? 0 : length(childIndex) }} />)}
            </svg>
            {kids.map(kid => <button key={valueOf(kid)} type="button" className="branched-menu__item" aria-current={valueOf(kid) === active ? 'true' : undefined}
              data-active={valueOf(kid) === active ? '' : undefined} tabIndex={isOpen ? 0 : -1} onClick={() => select(valueOf(kid), kid)}>
              {isValidElement(kid.icon) && <span className="branched-menu__icon" aria-hidden="true">{kid.icon}</span>}
              <span className="branched-menu__label">{kid.label}</span><span className="branched-menu__dot" aria-hidden="true" />
            </button>)}
          </div></div>
        </div>}
      </div>;
    })}
  </nav>;
}
/* END OF FILE: INTERACTION-POLISH-R1 | BranchedMenu.jsx */
