// CHANGE VERSION: ABOUT-STUDIO-R4 | Seamless words separated by matching diamonds
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
// END OF FILE: ABOUT-STUDIO-R4 | TextLoop.jsx
