import { useEffect, useState } from 'react';
import { contact, socialLinks } from '../data';
import { asset } from '../utils/assets';
import Brand from './Brand';
export default function Footer() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const scroll = () => setShowTop(window.scrollY > 500);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  return <>
    <footer id="contact" className="footer">
      <div className="contact-art" style={{ backgroundImage: `url(${asset('images/slide03.png')})` }} aria-hidden="true" />
      <div className="container">
        <span className="section-kicker">04 / CONTACT</span><h2>{contact.title}</h2><p>{contact.description}</p>
        <div className="contact-actions"><a className="contact-button" href={contact.email ? `mailto:${contact.email}` : contact.linkedin}>{contact.email ? 'Send an email' : 'Let’s connect on LinkedIn'} <span aria-hidden="true">↗</span></a><a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer" className="resume-link">View resume ↗</a></div>
      </div>
    </footer>
    <div className="sub-footer"><div className="container"><div className="footer-brand"><Brand /><small>© {new Date().getFullYear()} · Glenn Bernard Pimentel</small></div><ul>{socialLinks.map(({ name, href }) => <li key={name}><a href={href}>{name}</a></li>)}</ul></div></div>
    <button type="button" className={`back-to-top ${showTop ? 'is-visible' : ''}`} aria-label="Back to top" tabIndex={showTop ? 0 : -1}
      onClick={() => {
        const home = document.getElementById('home');
        home?.setAttribute('tabindex', '-1'); home?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }}><svg height="1.2em" className="arrow" viewBox="0 0 512 512" aria-hidden="true"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg></button>
  </>;
}
