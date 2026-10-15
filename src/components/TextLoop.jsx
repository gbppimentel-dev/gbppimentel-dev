// CHANGE VERSION: TEXT-LOOP-WAVES-R2 | Slim color edge, drifting curves and quiet graphic details
import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/TextLoop.css';

export default function TextLoop({
  text = 'ABOUT ME', separateWords = false, speed = 76, direction = 'forward', separator = '✦',
  fontSize = 36, fontWeight = 800, letterSpacing = 1.8, uppercase = true,
  color = 'var(--ink)', ribbon = true, ribbonColor = 'var(--brand-accent, var(--amber))',
  ribbonWidth = 88, separatorColors = ['var(--coral)', 'var(--blue)'],
  pauseOnHover = true, className = '', style = {},
}) {
  const rootRef = useRef(null);
  const unitRef = useRef(null);
  const groupRef = useRef(null);
  const trackRef = useRef(null);
  const [repetitions, setRepetitions] = useState(8);
  const label = uppercase ? String(text).toUpperCase() : String(text);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const unit = unitRef.current;
    if (!root || !unit) return undefined;
    let frame = 0;
    let cancelled = false;
    const measure = () => {
      frame = 0;
      if (cancelled) return;
      const unitWidth = unit.getBoundingClientRect().width;
      if (!unitWidth) return;
      const count = Math.max(2, Math.ceil((Math.ceil(root.clientWidth / unitWidth) + 1) / 2) * 2);
      setRepetitions(previous => previous === count ? previous : count);
    };
    const schedule = () => { if (!frame && !cancelled) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(unit);
    measure();
    document.fonts?.ready.then(schedule).catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [label, separator, separateWords, fontSize, fontWeight, letterSpacing]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!root || !track || !group) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tween;
    let measuredWidth = 0;
    const rebuild = (force = false) => {
      const width = group.getBoundingClientRect().width;
      if (!width || (!force && Math.abs(width - measuredWidth) < 0.1)) return;
      measuredWidth = width;
      tween?.kill();
      if (reducedMotion.matches || speed <= 0) {
        gsap.set(track, { x: 0 });
        return;
      }
      const reverse = direction === 'reverse';
      // Animate the exact rendered group width, so the two groups never overlap.
      tween = gsap.fromTo(track, { x: reverse ? 0 : -width }, {
        x: reverse ? -width : 0,
        duration: width / speed,
        ease: 'none',
        repeat: -1,
      });
      if (pauseOnHover && root.matches(':hover')) tween.pause();
    };
    const resize = () => rebuild();
    const motionChange = () => rebuild(true);
    const pause = () => tween?.pause();
    const resume = () => tween?.resume();
    const observer = new ResizeObserver(resize);
    observer.observe(group);
    rebuild(true);
    reducedMotion.addEventListener('change', motionChange);
    if (pauseOnHover) {
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', resume);
    }
    return () => {
      tween?.kill();
      observer.disconnect();
      reducedMotion.removeEventListener('change', motionChange);
      root.removeEventListener('pointerenter', pause);
      root.removeEventListener('pointerleave', resume);
    };
  }, [repetitions, label, separator, separateWords, fontSize, fontWeight, letterSpacing, speed, direction, pauseOnHover]);

  const words = separateWords ? label.trim().split(/\s+/) : [label];
  const renderWords = index => words.flatMap((word, wordIndex) => [
    <span className="text-loop-label" key={`word-${wordIndex}`}>{word}</span>,
    separator ? <span className={`text-loop-separator text-loop-separator--${(index * words.length + wordIndex) % 2}`} key={`separator-${wordIndex}`} aria-hidden="true">{separator}</span> : null,
  ]);
  const renderUnit = index => <span className="text-loop-unit" key={index}>
    {renderWords(index)}
  </span>;

  return <div ref={rootRef} className={`text-loop ${className}`.trim()} role="img" aria-label={label} style={{
    '--text-loop-size': `${fontSize}px`,
    '--text-loop-weight': fontWeight,
    '--text-loop-tracking': `${letterSpacing}px`,
    '--text-loop-height': `${ribbonWidth}px`,
    '--text-loop-color': color,
    '--text-loop-background': ribbon ? ribbonColor : 'transparent',
    '--text-loop-separator-first': separatorColors[0],
    '--text-loop-separator-second': separatorColors[1] ?? separatorColors[0],
    ...style,
  }}>
    {ribbon && <svg className="text-loop-waves" viewBox="0 0 1440 88" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {/* Keep the base still so the slim lower edge always matches the strap. */}
      <rect className="text-loop-wave-base" width="1440" height="88" />
      <g className="text-loop-wave-layers">
        <path className="text-loop-wave-shade text-loop-wave-shade--middle" d="M-48 0H1488V68C1280 79 1190 54 1000 66S740 80 540 68S160 56 -48 72Z" />
        <path className="text-loop-wave-shade text-loop-wave-shade--upper" d="M-48 0H1488V28C1300 7 1200 56 1000 40S690 11 500 32S130 57 -48 24Z" />
      </g>
      {/* Edge details stay clear of the central lettering and the strap-color seam. */}
      <g className="text-loop-wave-details">
        <path className="text-loop-wave-contour" d="M-48 10C160 28 320 2 530 10S950 24 1150 8S1390 6 1488 12M-48 75C200 69 400 78 640 74S1080 71 1488 76" />
        <g className="text-loop-wave-orbits"><ellipse cx="1260" cy="-8" rx="96" ry="27" /><ellipse cx="1260" cy="-8" rx="73" ry="18" /></g>
        <g className="text-loop-wave-dots">{[72, 84, 96, 108, 120, 132].flatMap(x => [8, 17].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />))}</g>
      </g>
    </svg>}
    <span className="text-loop-measure" aria-hidden="true"><span ref={unitRef} className="text-loop-unit">
      {renderWords(0)}
    </span></span>
    <div ref={trackRef} className="text-loop-track" aria-hidden="true">
      {[0, 1].map(copy => <div key={copy} ref={copy === 0 ? groupRef : undefined} className="text-loop-group">
        {Array.from({ length: repetitions }, (_, index) => renderUnit(index))}
      </div>)}
    </div>
  </div>;
}
// END OF FILE: TEXT-LOOP-WAVES-R2 | TextLoop.jsx
