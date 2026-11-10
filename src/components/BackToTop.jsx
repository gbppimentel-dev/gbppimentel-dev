// CHANGE VERSION: ABOUT-PROFILE-R2 | 2026-10-20 | Complete BackToTop.jsx
import { useEffect, useRef, useState } from 'react';
import '../styles/BackToTop.css';

export default function BackToTop({ disabled = false }) {
  const [pastThreshold, setPastThreshold] = useState(false);
  const control = useRef(null);
  const focusFrame = useRef(0);

  useEffect(() => {
    control.current?.style.removeProperty('--footer-overlap');
    let frame = 0;
    let previousProgress = -1;
    let previousLift = -1;
    let previousThreshold = false;
    let measureInsets = true;
    let restingBottom = 24;
    let footerClearance = 12;
    let approach = 96;
    const update = () => {
      frame = 0;
      const button = control.current;
      if (!button) return;
      if (measureInsets) {
        const style = getComputedStyle(button);
        restingBottom = parseFloat(style.bottom) || 0;
        footerClearance = parseFloat(style.getPropertyValue('--return-clearance')) || 12;
        approach = parseFloat(style.getPropertyValue('--return-approach')) || 96;
        measureInsets = false;
      }
      const nextThreshold = window.scrollY > Math.max(420, window.innerHeight * 0.55);
      if (nextThreshold !== previousThreshold) { setPastThreshold(nextThreshold); previousThreshold = nextThreshold; }
      const maximum = document.documentElement.scrollHeight - innerHeight;
      const progress = Math.round(Math.max(0, Math.min(1, maximum > 0 ? scrollY / maximum : 0)) * 1000) / 1000;
      if (progress !== previousProgress) { button.style.setProperty('--scroll-progress', progress); previousProgress = progress; }
      const footer = document.getElementById('site-footer');
      let lift = 0;
      if (footer) {
        const required = innerHeight - footer.getBoundingClientRect().top + footerClearance - restingBottom;
        // Blend into footer tracking before contact. This smooth maximum stays
        // at or above required clearance, without lagging behind the footer.
        lift = required <= -approach ? 0 : required >= approach ? required
          : (required + approach) ** 2 / (4 * approach);
      }
      if (Math.abs(lift - previousLift) > .01) { button.style.setProperty('--footer-lift', `${lift}px`); previousLift = lift; }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => { measureInsets = true; schedule(); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('hashchange', schedule);
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    resize?.observe(document.body);
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(focusFrame.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('hashchange', schedule);
      resize?.disconnect();
    };
  }, []);

  const visible = !disabled && pastThreshold;
  const goToTop = event => {
    if (!visible) return;
    const destination = event.detail === 0 ? document.querySelector('main.secondary-page > section') || document.getElementById('home') : null;
    window.cancelAnimationFrame(focusFrame.current);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'instant' : 'smooth' });
    if (destination) {
      const started = performance.now();
      const restoreFocus = () => {
        if (scrollY <= 2 && getComputedStyle(destination).visibility !== 'hidden') {
          destination.setAttribute('tabindex', '-1');
          destination.focus({ preventScroll: true });
          focusFrame.current = 0;
        } else if (performance.now() - started < 2000) focusFrame.current = requestAnimationFrame(restoreFocus);
        else focusFrame.current = 0;
      };
      focusFrame.current = requestAnimationFrame(restoreFocus);
    }
  };

  return <button ref={control} type="button" className="portfolio-back-to-top" aria-label="Back to top"
    aria-hidden={!visible} disabled={!visible} data-visible={visible ? '' : undefined} onClick={goToTop}>
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
    <span className="return-label" aria-hidden="true">BACK TO TOP</span>
    <i className="return-progress" aria-hidden="true" />
  </button>;
}
// END OF FILE: ABOUT-PROFILE-R2 | BackToTop.jsx
