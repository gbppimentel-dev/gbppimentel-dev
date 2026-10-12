import { useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import Brand from './Brand';

const links = [['home', 'HOME'], ['about', 'ABOUT ME'], ['projects', 'PROJECTS'], ['awards', 'AWARDS'], ['contact', 'CONTACT']];
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef(null);
  const toggle = useRef(null);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 60);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('overflow', open);
    const main = document.querySelector('main');
    const hero = document.querySelector('.header');
    const logo = document.querySelector('.navbar .logo');
    [main, hero, logo].forEach(element => { if (element) element.inert = open; });
    if (open) menu.current.querySelector('a')?.focus({ preventScroll: true });
    const keydown = event => {
      if (!open) return;
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [...menu.current.querySelectorAll('a'), toggle.current];
        const first = items[0], last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      document.body.classList.remove('overflow');
      [main, hero, logo].forEach(element => { if (element) element.inert = false; });
      document.removeEventListener('keydown', keydown);
    };
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
    <div ref={menu} id="site-menu" className={`navigation-menu ${open ? 'open' : ''}`} aria-hidden={!open} inert={!open}>
      <div className="nav-bg" /><div className="nav-bg2" />
      <nav className="inner" aria-label="Main navigation">
        <div className="menu-intro" aria-hidden="true"><img className="menu-brand-mark" src={asset('brand/solid-mark-512.png')} width="80" height="80" alt="" /><span className="menu-brand-name">gbppimentel<span>-dev</span></span><p>A little code.<br />A lot of creativity.</p></div>
        <ul>{links.map(([id, label], index) => <li key={id}><a href={`#${id}`} onClick={navigate}><small>0{index + 1}</small>{label}</a></li>)}</ul>
      </nav>
    </div>
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'menu-is-open' : ''}`} aria-label="Header">
      <div className="logo"><Brand /></div>
      <div className="sandwich-nav">
        <div className={`sandwich-text ${open ? 'move-up' : ''}`} aria-hidden="true"><b>MENU<br />CLOSE</b></div>
        <button ref={toggle} type="button" className={`sandwich-btn ${open ? 'open' : ''}`} aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}><span /><span /></button>
      </div>
    </nav>
  </>;
}
