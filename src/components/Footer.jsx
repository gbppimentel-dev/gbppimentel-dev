/* CHANGE VERSION: PORTFOLIO-CONTACT-REVERT-R8 | 2026-10-20 | Personal life verse in the footer */
import { useEffect, useState } from 'react';
import { contact } from '../data';
import { asset } from '../utils/assets';
import Brand from './Brand';
import TextLoop from './TextLoop';
import '../styles/contact-studio.css';
import '../styles/footer-verse.css';

function ContactIcon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    linkedin: <><path d="M5 9v11M5 4v.5M10 20V9h4v1.5c1-2.5 6-2.5 6 2.5v7M14 13v7" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    document: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] ?? paths.arrow}</svg>;
}

export function Contact({ children }) {
  return <>
    <div className="contact-scroll-stage">
      <section id="contact" className="footer contact-section contact-studio" aria-labelledby="contact-title" tabIndex={-1}>
        <div className="contact-art" style={{ backgroundImage: `url(${asset('images/slide03.png')})` }} aria-hidden="true" />
        <TextLoop text="CONTACT ME" separateWords speed={76} direction="forward" separator="✦"
          fontSize={36} fontWeight={800} letterSpacing={1.8} color="var(--ink)" ribbon
          ribbonColor="var(--brand-accent, var(--amber))" ribbonWidth={88}
          separatorColors={['var(--ink)', 'var(--ink)']} pauseOnHover className="contact-studio__text-loop" />
        <div className="contact-studio__body">
          <div className="contact-studio__card">
            <div className="contact-studio__intro">
              <span className="contact-studio__eyebrow"><span aria-hidden="true">✦</span> CONTACT</span>
              <h2 id="contact-title" className="contact-studio__title">Let’s work<br /><em>together.</em></h2>
              <p className="contact-studio__lead">Have a project, freelance opportunity, or role in mind? Let’s talk.</p>
              <ul className="contact-studio__disciplines" aria-label="Areas I work in"><li>Development</li><li>Design</li><li>NetSuite</li></ul>
            </div>
            <div className="contact-studio__actions">
              <a className="contact-studio__hello" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                <span className="contact-studio__link-icon"><ContactIcon name="linkedin" /></span>
                <span><small>START A CONVERSATION</small><strong>Say hello on LinkedIn</strong></span>
                <ContactIcon className="contact-studio__link-arrow" />
              </a>
              {contact.email && <a className="contact-studio__email" href={`mailto:${contact.email}`}><ContactIcon name="mail" /><span>{contact.email}</span><ContactIcon className="contact-studio__link-arrow" /></a>}
              <a className="contact-studio__resume" href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer"><ContactIcon name="document" /><span>View my résumé</span><span className="contact-studio__file-type">PDF</span><ContactIcon className="contact-studio__link-arrow" /></a>
            </div>
          </div>
        </div>
        {children}
      </section>
    </div>
    {/* Normal-flow anchor marker: avoids measuring the sticky section's displaced top. */}
    <div className="contact-scroll-hold" aria-hidden="true" />
  </>;
}
export default function Footer({ showBackToTop = true }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    if (!showBackToTop) return undefined;
    const scroll = () => setShowTop(window.scrollY > 500);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, [showBackToTop]);
  return <>
    <footer id="site-footer" className="sub-footer"><div className="container"><div className="footer-brand"><Brand /><small>© {new Date().getFullYear()} · Glenn Bernard Pimentel</small></div><blockquote className="footer-lifeverse"><p>“So whether you eat or drink or whatever you do, do it all for the glory of God.”</p><cite>1 Corinthians 10:31</cite></blockquote></div></footer>
    {showBackToTop && <button type="button" className={`back-to-top ${showTop ? 'is-visible' : ''}`} aria-label="Back to top" tabIndex={showTop ? 0 : -1}
      onClick={() => {
        const home = document.getElementById('home');
        home?.setAttribute('tabindex', '-1'); home?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }}><svg height="1.2em" className="arrow" viewBox="0 0 512 512" aria-hidden="true"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg></button>}
  </>;
}
/* END OF FILE: PORTFOLIO-CONTACT-REVERT-R8 | Footer.jsx */
