import { useRef } from 'react';
import useAnimationActivity from '../hooks/useAnimationActivity';

export default function HeroScrollCue() {
  const root = useRef(null);
  const activity = useAnimationActivity(root);
  return <a ref={root} href="#about" className="hero-scroll-mouse" aria-label="Scroll down to About me" data-active={activity.active}>
    <span className="hero-scroll-cue" aria-hidden="true">
      <svg viewBox="0 0 28 46" focusable="false">
        <rect className="hero-scroll-shell" x="5" y="2" width="18" height="28" rx="5" />
        <path className="hero-scroll-divider" d="M5 16h18" />
        <path className="hero-scroll-tick hero-scroll-tick--blue" d="M1 7v7m0-7h3" />
        <path className="hero-scroll-tick hero-scroll-tick--coral" d="M27 18v7m0 0h-3" />
        <rect className="hero-scroll-wheel" x="12.5" y="7" width="3" height="6" rx="1" />
        <path className="hero-scroll-direction" d="M14 35v8m-4-4 4 4 4-4" />
      </svg>
      <span className="hero-scroll-label">scroll</span>
    </span>
  </a>;
}
