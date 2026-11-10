// CHANGE VERSION: HERO-TECH-R1 | 2026-10-14 | Complete TechText.jsx
// Adapted from the supplied React Bits TechText component.
import { useEffect, useRef, useState } from 'react';
import { useSwiperSlide } from 'swiper/react';
import useAnimationActivity from '../hooks/useAnimationActivity';
import '../styles/TechText.css';

export default function TechText({ text, suffix = '', reveal = 'letter', dashLength = 4, dashGap = 2, specks = 15, selection = true, labels = true, draggable = true, sweep = true, speed = 1 }) {
  const containerRef = useRef(null), canvasRef = useRef(null);
  const slide = useSwiperSlide();
  const active = slide ? slide.isActive : true;
  const activity = useAnimationActivity(containerRef, { enabled: active });
  const [reduced, setReduced] = useState(true);
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine)');
    const sync = () => { setReduced(motion.matches); setFinePointer(pointer.matches); };
    motion.addEventListener('change', sync); pointer.addEventListener('change', sync); sync();
    return () => { motion.removeEventListener('change', sync); pointer.removeEventListener('change', sync); };
  }, []);
  useEffect(() => {
    if (!activity.active || reduced || !finePointer) return undefined;
    let disposed = false;
    let unmount;
    import('../utils/techTextCanvas').then(({ mountTechText }) => {
      if (disposed) return;
      unmount = mountTechText(containerRef.current, canvasRef.current, {
        text, suffix, reveal, dashLength, dashGap, specks, selection, labels,
        draggable, sweep, speed
      });
    }).catch(() => {}); // The semantic heading remains visible if canvas cannot load.
    return () => { disposed = true; unmount?.(); };
  }, [activity.active, reduced, finePointer, text, suffix, reveal, dashLength, dashGap, specks, selection, labels, draggable, sweep, speed]);
  const hasSuffix = suffix && text.endsWith(suffix);
  return <span ref={containerRef} className={'tech-text' + (active && !reduced && finePointer && draggable ? ' swiper-no-swiping' : '')}>
    <span className="tech-text-fallback"><span className="brand-handle">{hasSuffix ? text.slice(0, -suffix.length) : text}</span>{hasSuffix && <><wbr /><span className="brand-dev">{suffix}</span></>}</span>
    <span className="tech-text-accent" aria-hidden="true" />
    {!reduced && finePointer && <canvas ref={canvasRef} className="tech-text-canvas" aria-hidden="true" />}
  </span>;
}
// END OF FILE: HERO-TECH-R1 | TechText.jsx
