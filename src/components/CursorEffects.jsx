// CHANGE VERSION: ADAPTIVE-COLORS-R1 | Smooth scrollbar and cursor palette changes
import { useEffect, useRef } from "react";
import '../styles/ScrollEffects.css';
import { createColorTransition } from '../utils/adaptiveColors';
import useAnimationActivity from '../hooks/useAnimationActivity';
const colors = ["#D8B97C", "#C98974", "#D79998", "#93AEC6", "#AAA0CB"];
export default function CursorEffects() {
  const cursor = useRef(null);
  const surface = useRef(null);
  const { active, reducedMotion, coarsePointer } = useAnimationActivity(surface);
  useEffect(() => {
    const root = document.documentElement;
    const writeStyle = (name, value) => {
      if (root.style.getPropertyValue(name) !== value) root.style.setProperty(name, value);
    };
    const scrollbarTransition = createColorTransition({
      initial: root.style.getPropertyValue('--scrollbar-color') || colors[0],
      duration: 800,
      onUpdate: color => writeStyle('--scrollbar-color', color),
    });
    let frame = 0;
    const paint = () => {
      frame = 0;
      const owner = document.scrollingElement || root;
      const max = Math.max(0, owner.scrollHeight - owner.clientHeight);
      const position = Math.min(max, Math.max(0, owner.scrollTop));
      const edge = max <= 1 ? 'both' : position <= 1 ? 'top' : max - position <= 1 ? 'bottom' : 'middle';
      if (root.dataset.scrollEdge !== edge) root.dataset.scrollEdge = edge;
      const index = Math.min(colors.length - 1, Math.floor((max > 0 ? position / max : 0) * colors.length));
      // Round over the first/last 40px; tolerate fractional scroll at the ends.
      const radius = distance => `${Math.min(10, Math.max(0, distance - 1) / 4)}px`;
      scrollbarTransition.to(colors[index]);
      writeStyle('--scrollbar-top-radius', radius(position));
      writeStyle('--scrollbar-bottom-radius', radius(max - position));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener('resize', scroll);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scroll);
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame); observer?.disconnect(); scrollbarTransition.destroy();
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
    };
  }, []);
  useEffect(() => {
    if (!active || reducedMotion || coarsePointer) return undefined;
    let x = innerWidth / 2,
      y = innerHeight / 2,
      targetX = x,
      targetY = y,
      frame = 0;
    if (cursor.current) cursor.current.style.transform = `translate(${x}px, ${y}px)`;
    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      const index = Math.min(colors.length - 1, Math.floor(e.clientX / Math.max(1, innerWidth) * colors.length));
      cursorTransition.to(colors[index]);
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const animate = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      if (Math.abs(targetX - x) < 0.25 && Math.abs(targetY - y) < 0.25) {
        x = targetX;
        y = targetY;
      }
      if (cursor.current)
        cursor.current.style.transform = `translate(${x}px, ${y}px)`;
      frame = x === targetX && y === targetY ? 0 : requestAnimationFrame(animate);
    };
    const cursorTransition = createColorTransition({
      initial: colors[0], duration: 800,
      onUpdate: color => { if (cursor.current) cursor.current.style.backgroundColor = color; },
    });
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cursorTransition.destroy();
      window.removeEventListener("pointermove", move);
    };
  }, [active, reducedMotion, coarsePointer]);
  return (
    <div ref={surface} id="canvas" aria-hidden="true">
      <div ref={cursor} id="box" />
    </div>
  );
}
// END OF FILE: ADAPTIVE-COLORS-R1 | CursorEffects.jsx
