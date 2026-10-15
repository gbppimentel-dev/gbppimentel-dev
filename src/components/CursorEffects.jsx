// CHANGE VERSION: PORTFOLIO-POLISH-R3 | 2026-10-14 | Complete CursorEffects.jsx
import { useEffect, useRef } from "react";
import '../styles/ScrollEffects.css';
const colors = ["#D8B97C", "#C98974", "#D79998", "#93AEC6", "#AAA0CB"];
export default function CursorEffects() {
  const cursor = useRef(null);
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const paint = () => {
      frame = 0;
      const owner = document.scrollingElement || root;
      const max = Math.max(0, owner.scrollHeight - owner.clientHeight);
      const position = Math.min(max, Math.max(0, owner.scrollTop));
      root.dataset.scrollEdge = max <= 1 ? 'both' : position <= 1 ? 'top' : max - position <= 1 ? 'bottom' : 'middle';
      const index = Math.min(colors.length - 1, Math.floor((max > 0 ? position / max : 0) * colors.length));
      // Round over the first/last 40px; tolerate fractional scroll at the ends.
      const radius = distance => `${Math.min(10, Math.max(0, distance - 1) / 4)}px`;
      root.style.setProperty('--scrollbar-color', colors[index]);
      root.style.setProperty('--scrollbar-top-radius', radius(position));
      root.style.setProperty('--scrollbar-bottom-radius', radius(max - position));
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener('resize', scroll);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scroll);
    observer?.observe(document.body);
    return () => {
      cancelAnimationFrame(frame); observer?.disconnect();
      window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll);
    };
  }, []);
  useEffect(() => {
    if (
      !window.matchMedia(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;
    let x = innerWidth / 2,
      y = innerHeight / 2,
      targetX = x,
      targetY = y,
      frame = 0;
    if (cursor.current) cursor.current.style.transform = `translate(${x}px, ${y}px)`;
    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
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
    const timer = setInterval(() => {
      if (cursor.current)
        cursor.current.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
    }, 1000);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  return (
    <div id="canvas" aria-hidden="true">
      <div ref={cursor} id="box" />
    </div>
  );
}
// END OF FILE: PORTFOLIO-POLISH-R3 | CursorEffects.jsx
