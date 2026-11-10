// CHANGE VERSION: PORTFOLIO-REFINE-R5 | 2026-10-20 | Vector NetSuite mark in the existing menu
import { useCallback, useEffect, useRef, useState } from 'react';
import { absoluteAsset } from '../utils/assets';
import { createNavigationKeyHandler, focusNavigationItem, getNavigationStops } from '../utils/navigationFocus';
import Brand from './Brand';
import MenuSocialLinks from './MenuSocialLinks';
import MorphNumber from './MorphNumber';
import HeaderHearts from './HeaderHearts';
import NetSuiteMark from './NetSuiteMark';
import ThemeToggle from './ThemeToggle';
import '../styles/Navigation.css';
import '../styles/navigation-tech.css';
const links = [['home', 'HOME'], ['about', 'ABOUT ME'], ['contact', 'CONTACT'], ['projects', 'PROJECTS'], ['netsuite', 'NETSUITE']];
const linkDetails = {
  home: ['Home', 'The introduction'],
  about: ['About Me', 'Capabilities & how I build'],
  contact: ['Contact', 'Jobs, projects & commissions'],
  projects: ['Projects', 'Products, features & case studies'],
  netsuite: ['NetSuite', 'ERP support & business workflows'],
};

export default function Navigation({ onModalChange }) {
  const [open, setOpen] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState(0);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 999px), (pointer: coarse)').matches);
  const bar = useRef(null);
  const menu = useRef(null);
  const toggle = useRef(null);
  const location = useRef(null);
  const closeMenu = useCallback(() => { setOpen(false); setKeyboardMode(false); toggle.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { onModalChange?.(open && compact); }, [open, compact, onModalChange]);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 999px), (pointer: coarse)');
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!open || !compact) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open, compact]);
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
    const node = location.current;
    if (!node) return undefined;
    const measure = () => bar.current?.style.setProperty('--nav-location-width', `${Math.ceil(node.getBoundingClientRect().width)}px`);
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [section]);
  useEffect(() => {
    if (!open) return undefined;
    const getStops = () => getNavigationStops(menu.current, bar.current?.querySelector('.nav-actions'));
    const focus = node => focusNavigationItem(node, { panel: menu.current?.querySelector('.sm-panel'), header: bar.current });
    focus(getStops()[0]);
    const keydown = createNavigationKeyHandler({ getStops, getActiveElement: () => document.activeElement,
      focus, close: closeMenu, onKeyboard: () => setKeyboardMode(true) });
    // Capture Tab before page widgets can consume it. Desktop remains
    // scrollable, while the open directory keeps a predictable focus cycle.
    document.addEventListener('keydown', keydown, true);
    return () => document.removeEventListener('keydown', keydown, true);
  }, [open, closeMenu]);
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
    <div ref={menu} id="site-menu" className="staggered-menu" data-open={open} data-keyboard-nav={keyboardMode} aria-hidden={!open} inert={!open}
      onPointerDownCapture={() => setKeyboardMode(false)}
      role={compact ? 'dialog' : undefined} aria-modal={compact && open ? true : undefined} aria-label={compact ? 'Site navigation' : undefined}
      aria-owns={compact && open ? 'site-menu-actions' : undefined}>
      <div className="sm-backdrop" onClick={closeMenu} aria-hidden="true" />
      <div className="sm-prelayers" aria-hidden="true"><div className="sm-prelayer" /><div className="sm-prelayer" /></div>
      <div className="sm-panel" style={{ '--menu-art': `url(${absoluteAsset('images/menu-background.png')})` }}>
        <div className="sm-panel-inner">
          <div className="sm-links">
            <div className="sm-directory-heading">
              <p className="sm-panel-kicker"><span className="sm-kicker-title">site <span aria-hidden="true">/</span> navigation</span><span className="sm-index-count">{String(links.length).padStart(2, '0')} ROUTES</span></p>
              <h2>Explore the work<span>.</span></h2>
              <div className="sm-directory-toolbar"><span>Jump to a section</span><span><kbd>↵</kbd> open</span></div>
            </div>
            <nav aria-label="Main navigation"><ul className="sm-panel-list">{links.map(([id], index) => <li key={id} style={{ '--item-index': index }}><a href={`#${id}`} onClick={navigate} className="sm-panel-item" aria-current={section === index ? 'location' : undefined}><small aria-hidden="true">0{index + 1}</small><span className="sm-item-window"><span className="sm-panel-itemLabel">{linkDetails[id][0]}{id === 'netsuite' && <NetSuiteMark className="sm-netsuite-mark" />}</span><span className="sm-panel-itemDescription"><span className="sm-route-path" aria-hidden="true">#{id}</span><span>{linkDetails[id][1]}</span></span></span><svg className="sm-route-arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h12m-5-5 5 5-5 5" /></svg></a></li>)}</ul></nav>
            <MenuSocialLinks onNavigate={closeMenu} />
            <div className="sm-directory-shortcuts"><span><kbd>tab</kbd> move</span><span><kbd>esc</kbd> close</span></div>
          </div>
        </div>
      </div>
    </div>
    <nav ref={bar} className={`navbar site-navbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'menu-is-open' : ''}`} aria-label="Header" onPointerDownCapture={() => setKeyboardMode(false)}>
      <div className="logo"><Brand withLogo /></div>
      <div className="nav-actions" id="site-menu-actions">
        <HeaderHearts />
        <ThemeToggle />
        <span className="nav-location-shell" aria-hidden="true"><span ref={location} className="nav-location"><MorphNumber value={section + 1} padded /><i />{links[section][1]}</span></span>
        <button ref={toggle} id="site-menu-toggle" type="button" className="nav-hamburger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}>
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" /><path className="line" d="M7 16 27 16" /></svg>
        </button>
      </div>
      <span className="nav-reading-track" aria-hidden="true"><span /></span>
    </nav>
  </>;
}
// END OF FILE: PORTFOLIO-REFINE-R5 | Navigation.jsx
