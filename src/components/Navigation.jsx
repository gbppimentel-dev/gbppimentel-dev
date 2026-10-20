// CHANGE VERSION: NETSUITE-PROJECTS-R1 | 2026-10-20 | Complete Navigation.jsx
import { useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import Brand from './Brand';
import SocialLinks from './SocialLinks';
import MorphNumber from './MorphNumber';
import '../styles/Navigation.css';
const links = [['home', 'HOME'], ['about', 'ABOUT ME'], ['contact', 'CONTACT'], ['projects', 'PROJECTS'], ['netsuite', 'NETSUITE']];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState(0);
  const bar = useRef(null);
  const menu = useRef(null);
  const toggle = useRef(null);
  const closeMenu = () => { setOpen(false); toggle.current?.focus({ preventScroll: true }); };
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0; setScrolled(window.scrollY > 60);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.current?.style.setProperty('--page-progress', String(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0));
      let current = 0;
      links.forEach(([id], i) => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= window.innerHeight * .3) current = i; });
      setSection(current);
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint(); window.addEventListener('scroll', scroll, { passive: true }); window.addEventListener('resize', scroll);
    window.addEventListener('hashchange', scroll); window.addEventListener('popstate', scroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', scroll); window.removeEventListener('resize', scroll); window.removeEventListener('hashchange', scroll); window.removeEventListener('popstate', scroll); };
  }, []);
  useEffect(() => {
    // Nonmodal panel: the page stays scrollable and available to the keyboard.
    if (open) menu.current.querySelector('a')?.focus({ preventScroll: true });
    const keydown = event => {
      if (open && event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [open]);
  const navigate = event => {
    const id = event.currentTarget.hash.slice(1);
    setOpen(false);
    requestAnimationFrame(() => {
      const destination = document.getElementById(id);
      destination?.setAttribute('tabindex', '-1');
      destination?.focus({ preventScroll: true });
    });
  };
  return <>
    <div ref={menu} id="site-menu" className="staggered-menu" data-open={open} aria-hidden={!open} inert={!open}>
      <div className="sm-backdrop" onClick={closeMenu} aria-hidden="true" />
      <div className="sm-prelayers" aria-hidden="true"><div className="sm-prelayer" /><div className="sm-prelayer" /></div>
      <div className="sm-panel" style={{ '--menu-art': `url(${asset('images/menu-background.png')})` }}>
        <div className="sm-panel-inner">
          <div className="sm-links">
            <p className="sm-panel-kicker">EXPLORE</p>
            <nav aria-label="Main navigation"><ul className="sm-panel-list">{links.map(([id, label], index) => <li key={id} style={{ '--item-index': index }}><a href={`#${id}`} onClick={navigate} className="sm-panel-item" aria-current={section === index ? 'location' : undefined}><small>0{index + 1}</small><span className="sm-item-window"><span className="sm-panel-itemLabel">{label}</span></span></a></li>)}</ul></nav>
            <div className="sm-socials"><p>PROFESSIONAL PROFILES</p><SocialLinks onNavigate={closeMenu} /></div>
          </div>
        </div>
      </div>
    </div>
    <nav ref={bar} className={`navbar site-navbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'menu-is-open' : ''}`} aria-label="Header">
      <div className="logo"><Brand withLogo /></div>
      <div className="nav-actions">
        <span className="nav-location" aria-hidden="true"><MorphNumber value={section + 1} padded /><i />{links[section][1]}</span>
        <button ref={toggle} type="button" className="nav-hamburger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}>
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" /><path className="line" d="M7 16 27 16" /></svg>
        </button>
      </div>
      <span className="nav-reading-track" aria-hidden="true"><span /></span>
    </nav>
  </>;
}
// END OF FILE: NETSUITE-PROJECTS-R1 | Navigation.jsx
