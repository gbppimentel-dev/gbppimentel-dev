// CHANGE VERSION: NETSUITE-PROJECTS-R1 | Compact slingshot with comfortable pull room above the viewport edge
import { useEffect, useRef, useState } from 'react';
import SlingButton from './SlingButton';

/** One global dock. Scroll only; it does not change routes or engage the loader. */
export default function SlingBackToTop({ disabled = false }) {
  const [pastThreshold, setPastThreshold] = useState(false);
  const [held, setHeld] = useState(false);
  const [launching, setLaunching] = useState(false);
  const releaseTimer = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setPastThreshold(window.scrollY > Math.max(420, window.innerHeight * 0.55));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(releaseTimer.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const visible = !disabled && (pastThreshold || held || launching);
  const goToTop = () => {
    if (disabled) return;
    // Keep the recoil and burst visible even if the browser arrives instantly.
    window.clearTimeout(releaseTimer.current);
    setLaunching(true);
    releaseTimer.current = window.setTimeout(() => setLaunching(false), 900);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  return (
    <div
      className="sling-top-dock"
      data-visible={visible ? '' : undefined}
      data-held={held ? '' : undefined}
    >
      <span className="sling-top-tooltip" aria-hidden="true">
        <strong>{held ? 'Pull… then let go!' : 'Back to the top'}</strong>
        <span>Click to top · drag to slingshot</span>
      </span>
      <SlingButton
        onSend={goToTop}
        onHoldChange={setHeld}
        disabled={!visible}
        ariaLabel="Back to top. Click, or drag and release to slingshot."
        padColor="var(--brand-accent, #d8b97c)"
        iconColor="#20222a"
        accentColor="var(--brand-accent, #d8b97c)"
        wellColor="#20222a"
        bandColor="#f2e9d6"
        size={44}
        strokeWidth={3}
        armAt={32}
        maxPull={125}
        launchSpeed={2400}
        recoil={0.22}
        flight={95}
        particles={10}
        spread={65}
        axis="any"
        tapSends
      />
    </div>
  );
}

// END OF FILE: NETSUITE-PROJECTS-R1 | SlingBackToTop.jsx
