// Connected label modules share the measured loop; section stacking stays outside.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useAnimationActivity from '../hooks/useAnimationActivity';
import '../styles/TextLoop.css';

let gsapPromise;
const loadGsap = () => gsapPromise ??= import('gsap').then(module => module.gsap || module.default);

export default function TextLoop({
  text = 'ABOUT ME', separateWords = false, speed = 76, direction = 'forward', separator = '✦',
  fontSize = 36, fontWeight = 800, letterSpacing = 1.8, uppercase = true,
  color = 'var(--ink)', ribbon = true, ribbonColor = 'var(--brand-accent, var(--amber))',
  ribbonWidth = 88, separatorColors = ['var(--coral)', 'var(--blue)'],
  pauseOnHover = true, connected = false, className = '', style = {},
}) {
  const rootRef = useRef(null);
  const unitRef = useRef(null);
  const groupRef = useRef(null);
  const trackRef = useRef(null);
  const playbackRef = useRef(null);
  const activity = useAnimationActivity(rootRef);
  const activeRef = useRef(activity.active);
  activeRef.current = activity.active;
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
  }, [label, separator, separateWords, fontSize, fontWeight, letterSpacing, connected]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!root || !track || !group) return undefined;
    let gsap;
    let tween;
    let loading = false;
    let disposed = false;
    let hovered = false;
    let measuredWidth = 0;
    const syncPlayback = () => {
      if (!gsap) { if (activeRef.current) start(); return; }
      if (activeRef.current && !hovered) tween?.resume();
      else tween?.pause();
    };
    playbackRef.current = syncPlayback;
    const rebuild = (force = false) => {
      if (activity.reducedMotion || speed <= 0) {
        tween?.kill();
        track.style.transform = '';
        return;
      }
      if (!gsap) { if (activeRef.current) start(); return; }
      const width = group.getBoundingClientRect().width;
      if (!width || (!force && Math.abs(width - measuredWidth) < 0.1)) return;
      measuredWidth = width;
      tween?.kill();
      const reverse = direction === 'reverse';
      // Animate the exact rendered group width, so the two groups never overlap.
      tween = gsap.fromTo(track, { x: reverse ? 0 : -width }, {
        x: reverse ? -width : 0,
        duration: width / speed,
        ease: 'none',
        repeat: -1,
      });
      syncPlayback();
    };
    const start = () => {
      if (loading || disposed || !activeRef.current || activity.reducedMotion || speed <= 0) return;
      loading = true;
      loadGsap().then(api => {
        if (disposed) return;
        loading = false;
        gsap = api;
        rebuild(true);
      }).catch(() => { loading = false; }); // Static ribbon remains readable.
    };
    const resize = () => rebuild();
    const pause = event => { if (event.pointerType !== 'touch') { hovered = true; syncPlayback(); } };
    const resume = () => { hovered = false; syncPlayback(); };
    const observer = new ResizeObserver(resize);
    observer.observe(group);
    rebuild(true);
    if (pauseOnHover) {
      root.addEventListener('pointerenter', pause);
      root.addEventListener('pointerleave', resume);
    }
    return () => {
      disposed = true;
      tween?.kill();
      playbackRef.current = null;
      observer.disconnect();
      root.removeEventListener('pointerenter', pause);
      root.removeEventListener('pointerleave', resume);
    };
  }, [repetitions, label, separator, separateWords, fontSize, fontWeight, letterSpacing, speed, direction, pauseOnHover, connected, activity.reducedMotion]);

  useEffect(() => { playbackRef.current?.(); }, [activity.active]);

  const words = separateWords ? label.trim().split(/\s+/) : [label];
  const renderWords = index => words.flatMap((word, wordIndex) => [
    <span className="text-loop-label" key={`word-${wordIndex}`}>{word}</span>,
    separator ? <span className={`text-loop-separator text-loop-separator--${(index * words.length + wordIndex) % 2}`} key={`separator-${wordIndex}`} aria-hidden="true">{separator}</span> : null,
  ]);
  const renderUnit = index => <span className="text-loop-unit" data-tone={index % 2} key={index}>
    {renderWords(index)}
    {connected && <span className="text-loop-connector" aria-hidden="true"><i /></span>}
  </span>;

  return <div ref={rootRef} className={`text-loop${connected ? ' text-loop--connected' : ''} ${className}`.trim()} data-ribbon={ribbon} role="img" aria-label={label} style={{
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
    {ribbon && <svg className="text-loop-circuit" viewBox="0 0 1440 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <path d="M0 13h72l12 12h54m-138 29h110l16-16h88l12-12h88M326 9h111l12 12h54m-154 43 18-18h108l13-13h73M614 16h96l12 12h91m-178 29h96l13-13h88l17-17h81M920 8h104l16 16h54m-126 40 16-16h97l14-14h80M1208 13h96l11 11h125m-232 31h109l17-17h106" />
      {[138,503,813,1094].map(x => <g key={x} transform={`translate(${x} 19)`}><rect width="31" height="27" rx="2" /><path d="M6 0v-7m9 7v-7m9 7v-7M6 27v7m9-7v7m9-7v7M0 7h-8m8 12h-8M31 7h8m-8 12h8" /></g>)}
      <g className="text-loop-circuit-nodes"><circle cx="314" cy="26" r="2" /><circle cx="561" cy="33" r="2" /><circle cx="930" cy="27" r="2" /><circle cx="1175" cy="34" r="2" /></g>
    </svg>}
    <span className="text-loop-measure" aria-hidden="true"><span ref={unitRef} className="text-loop-unit" data-tone="0">
      {renderWords(0)}
      {connected && <span className="text-loop-connector"><i /></span>}
    </span></span>
    <div ref={trackRef} className="text-loop-track" aria-hidden="true" style={{ willChange: activity.active ? 'transform' : 'auto' }}>
      {[0, 1].map(copy => <div key={copy} ref={copy === 0 ? groupRef : undefined} className="text-loop-group">
        {Array.from({ length: repetitions }, (_, index) => renderUnit(index))}
      </div>)}
    </div>
  </div>;
}
