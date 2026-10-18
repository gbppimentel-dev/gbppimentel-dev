// CHANGE VERSION: HERO-PLAYGROUND-R3 | 2026-10-16 | Complete HeroWorkbench.jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';

// Match the spring used by SlideTwoText: the frame arrives with the words.
const frameSpring = { stiffness: 400, damping: 30, mass: 1 };

export default function HeroWorkbench({ children, reduced = false }) {
  const rootRef = useRef(null);
  const [measured, setMeasured] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const skipMotion = reduced || prefersReducedMotion;
  const width = useSpring(0, frameSpring);
  const height = useSpring(0, frameSpring);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let disposed = false;
    let frame = 0;
    let initialized = false;
    let pendingBox;
    let previousWidth = 0;
    let previousHeight = 0;

    const measure = () => {
      frame = 0;
      if (disposed) return;

      // Read the layout box, never the transforms used by the carousel/text.
      const nextWidth = pendingBox?.inlineSize ?? root.offsetWidth;
      const nextHeight = pendingBox?.blockSize ?? root.offsetHeight;
      pendingBox = undefined;
      if (nextWidth <= 0 || nextHeight <= 0) return;
      if (initialized && Math.abs(nextWidth - previousWidth) < 0.25 && Math.abs(nextHeight - previousHeight) < 0.25) return;

      previousWidth = nextWidth;
      previousHeight = nextHeight;
      if (!initialized || skipMotion) {
        width.jump(nextWidth);
        height.jump(nextHeight);
      } else {
        width.set(nextWidth);
        height.set(nextHeight);
      }
      if (!initialized) {
        initialized = true;
        setMeasured(true);
      }
    };

    const schedule = entry => {
      if (disposed) return;
      const box = entry?.borderBoxSize;
      pendingBox = box ? (box[0] ?? box) : undefined;
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(entries => schedule(entries[0]));
    if (observer) {
      try { observer.observe(root, { box: 'border-box' }); }
      catch { observer.observe(root); }
    }
    const remeasure = () => schedule();
    window.addEventListener('resize', remeasure, { passive: true });
    document.fonts?.ready.then(() => { if (!disposed) remeasure(); }).catch(() => {});

    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener('resize', remeasure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [skipMotion, width, height]);

  return (
    <div ref={rootRef} className="hero-print-workbench">
      <motion.div
        className="hero-workbench-backdrop"
        aria-hidden="true"
        initial={false}
        style={{ width: measured ? width : '100%', height: measured ? height : '100%' }}
      />
      <div className="hero-workbench-content">{children}</div>
    </div>
  );
}
// END OF FILE: HERO-PLAYGROUND-R3 | HeroWorkbench.jsx
