// CHANGE VERSION: PORTFOLIO-POLISH-R3 | 2026-10-14 | Complete Brand.jsx
import { useEffect, useRef } from 'react';
import { asset } from '../utils/assets';
import '../styles/PortfolioDetails.css';

export default function Brand({ className = '', withLogo = false }) {
  const logo = useRef(null), spin = useRef(null);
  useEffect(() => () => spin.current?.cancel(), []);
  const rotate = () => {
    if (!logo.current?.animate || spin.current?.playState === 'running' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    spin.current = logo.current.animate([
      { transform: 'rotate(0deg)', offset: 0, easing: 'cubic-bezier(.35, 0, .7, 1)' },
      { transform: 'rotate(360deg)', offset: .26, easing: 'cubic-bezier(.1, .8, .2, 1)' },
      { transform: 'rotate(734deg)', offset: .78, easing: 'ease-in-out' },
      { transform: 'rotate(716deg)', offset: .9, easing: 'ease-out' },
      { transform: 'rotate(720deg)', offset: 1 }
    ], { duration: 1100, iterations: 1 });
  };
  return <a href="#home" className={`brand-link ${className}`} aria-label="gbppimentel-dev — home" onFocus={rotate}>
    {withLogo && <img ref={logo} onPointerEnter={event => { if (event.pointerType === 'mouse') rotate(); }} className="brand-triangle" src={asset('brand/triangle-logo.png?v=PORTFOLIO-POLISH-R3')} width="28" height="28" alt="" />}
    <span className="brand-wordmark">gbppimentel<span className="brand-dev">-dev</span></span>
  </a>;
}
// END OF FILE: PORTFOLIO-POLISH-R3 | Brand.jsx
