// CHANGE VERSION: ABOUT-PROFILE-R2 | 2026-10-20 | Complete BackToTop.jsx
import { useEffect, useState } from 'react';
import '../styles/BackToTop.css';

export default function BackToTop({ disabled = false }) {
  const [pastThreshold, setPastThreshold] = useState(false);

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
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const visible = !disabled && pastThreshold;
  const goToTop = event => {
    if (!visible) return;
    // Keyboard users return to the page content instead of a disappearing button.
    if (event.detail === 0) {
      const destination = document.querySelector('main.secondary-page > section') || document.getElementById('home');
      if (destination) {
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
      }
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  return <button type="button" className="portfolio-back-to-top" aria-label="Back to top"
    aria-hidden={!visible} disabled={!visible} data-visible={visible ? '' : undefined} onClick={goToTop}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
  </button>;
}
// END OF FILE: ABOUT-PROFILE-R2 | BackToTop.jsx
