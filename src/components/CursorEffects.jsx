import { useEffect, useRef } from "react";
const colors = ["#D8B97C", "#C98974", "#D79998", "#93AEC6", "#AAA0CB"];
export default function CursorEffects() {
  const cursor = useRef(null);
  useEffect(() => {
    const scroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const index = Math.min(
        colors.length - 1,
        Math.max(
          0,
          Math.floor((max > 0 ? window.scrollY / max : 0) * colors.length),
        ),
      );
      document.documentElement.style.setProperty(
        "--scrollbar-color",
        colors[index],
      );
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    if (
      !window.matchMedia(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return () => window.removeEventListener("scroll", scroll);
    let x = innerWidth / 2,
      y = innerHeight / 2,
      targetX = x,
      targetY = y,
      frame;
    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    const animate = () => {
      x += (targetX - x) * 0.1;
      y += (targetY - y) * 0.1;
      if (cursor.current)
        cursor.current.style.transform = `translate(${x}px, ${y}px)`;
      frame = requestAnimationFrame(animate);
    };
    const timer = setInterval(() => {
      if (cursor.current)
        cursor.current.style.backgroundColor =
          colors[Math.floor(Math.random() * colors.length)];
    }, 1000);
    window.addEventListener("pointermove", move, { passive: true });
    animate();
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <div id="canvas" aria-hidden="true">
      <div ref={cursor} id="box" />
    </div>
  );
}
