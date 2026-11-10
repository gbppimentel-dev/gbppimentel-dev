/* CHANGE VERSION: PORTFOLIO-CONTACT-REVERT-R8 | 2026-10-20 | Personal life verse in the footer */
import { useRef } from 'react';
import { contact } from '../data';
import { asset } from '../utils/assets';
import useAnimationActivity from '../hooks/useAnimationActivity';
import Brand from './Brand';
import TextLoop from './TextLoop';
import ContactForm from './ContactForm';
import BackToTop from './BackToTop';
import '../styles/contact-studio.css';
import '../styles/footer-verse.css';
import '../styles/contact-inquiry.css';

// Fixed coordinates keep the atmosphere stable across renders and theme changes.
const contactLights = [
  [7, 20, 190, 22, -7, 'coral'], [93, 18, 220, 27, -18, 'blue'],
  [4, 78, 160, 25, -11, 'amber'], [96, 70, 180, 21, -15, 'blue'],
  [28, 7, 135, 26, -4, 'amber'], [38, 54, 200, 29, -19, 'coral'],
  [64, 88, 150, 23, -9, 'blue'], [74, 44, 170, 28, -22, 'amber'],
];
const contactParticles = [
  [2.6, 22, 52, 34, 4, 14, -4, 'amber'], [97.2, 18, -48, 58, 4, 18, -11, 'blue'],
  [25, 48, 44, -42, 3, 16, -8, 'coral'], [76, 74, -58, -34, 4, 20, -15, 'amber'],
  [4.2, 79, 32, -62, 5, 19, -6, 'blue'], [95.8, 36, -34, 46, 4, 15, -12, 'coral'],
  [44, 3, 58, 20, 3, 17, -3, 'amber'], [93, 56, -42, -56, 4, 21, -17, 'blue'],
  [31, 18, -46, 32, 3, 22, -9, 'coral'], [4, 53, 36, -42, 3, 18, -5, 'amber'],
  [57, 14, 42, 54, 4, 20, -13, 'blue'], [83, 89, -44, -34, 3, 16, -7, 'coral'],
  [36, 70, -38, -54, 4, 19, -14, 'blue'], [69, 57, 48, 38, 3, 23, -2, 'amber'],
  [17, 36, 32, 44, 3, 17, -10, 'coral'], [52, 62, -46, 48, 4, 21, -16, 'amber'],
];

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
  const section = useRef(null);
  const { active } = useAnimationActivity(section, { threshold: .05 });
  return <>
    <div className="contact-scroll-stage">
      <section ref={section} id="contact" className="footer contact-section contact-studio contact-inquiry" aria-labelledby="contact-title" tabIndex={-1}>
        <div className="contact-art" style={{ backgroundImage: `url(${asset('images/slide03.png')})` }} aria-hidden="true" />
        <div className="contact-field" data-active={active} aria-hidden="true">
          {contactLights.map(([x, y, size, duration, delay, tone], index) => <i key={index} className="contact-field__light" style={{ '--field-x': `${x}%`, '--field-y': `${y}%`, '--field-size': `${size}px`, '--field-duration': `${duration}s`, '--field-delay': `${delay}s`, '--field-color': `var(--${tone})` }} />)}
          {contactParticles.map(([x, y, dx, dy, size, duration, delay, tone], index) => <span key={index} className="contact-field__particle" style={{ '--particle-x': `${x}%`, '--particle-y': `${y}%`, '--particle-dx': `${dx}px`, '--particle-dy': `${dy}px`, '--particle-size': `${size}px`, '--particle-duration': `${duration}s`, '--particle-delay': `${delay}s`, '--particle-color': `var(--${tone})` }} />)}
        </div>
        <TextLoop text="CONTACT ME" connected speed={76} direction="forward" separator=""
          fontSize={36} fontWeight={800} letterSpacing={1.8} color="var(--text)" ribbon
          ribbonColor="var(--brand-accent, var(--amber))" ribbonWidth={88}
          separatorColors={['var(--brand-accent, var(--amber))', 'var(--brand-accent, var(--amber))']} pauseOnHover className="contact-studio__text-loop" />
        <div className="contact-inquiry__body">
          <div className="contact-inquiry__layout">
            <div className="contact-inquiry__intro">
              <span className="contact-inquiry__eyebrow"><span aria-hidden="true" /> OPEN A CONVERSATION</span>
              <h2 id="contact-title">Let’s build<br /><em>what’s next.</em></h2>
              <p>A place on your team, an idea to develop, or a piece you need made. Tell me where I can help.</p>
              <div className="contact-inquiry__draft-note"><span>No polished pitch needed.</span><p>The brief outline gives you editable prompts. Nothing is sent until you choose to send it.</p></div>
              <div className="contact-inquiry__links"><a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><ContactIcon name="linkedin" />LinkedIn<span aria-hidden="true">↗</span></a><a href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer"><ContactIcon name="document" />Résumé<span aria-hidden="true">↗</span></a></div>
            </div>
            <ContactForm />
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
  return <>
    <footer id="site-footer" className="sub-footer"><div className="container"><div className="footer-brand"><Brand /><small>© {new Date().getFullYear()} · Glenn Bernard Pimentel</small></div><blockquote className="footer-lifeverse"><p>“So whether you eat or drink or whatever you do, do it all for the glory of God.”</p><cite>1 Corinthians 10:31</cite></blockquote></div></footer>
    {showBackToTop && <BackToTop />}
  </>;
}
/* END OF FILE: PORTFOLIO-CONTACT-REVERT-R8 | Footer.jsx */
