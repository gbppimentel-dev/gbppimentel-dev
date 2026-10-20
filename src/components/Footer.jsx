/* CHANGE VERSION: HEARTS-PAGES-R1 | 2026-10-20 | Complete Footer.jsx */
import { useEffect, useId, useRef, useState } from 'react';
import { contact, socialLinks } from '../data';
import { asset } from '../utils/assets';
import Brand from './Brand';
import TextLoop from './TextLoop';
import FooterHearts from './FooterHearts';
import '../styles/contact-studio.css';

const inquiryTypes = [
  { value: 'project', label: 'A project', icon: 'project', summary: 'A new project' },
  { value: 'freelance', label: 'Freelance', icon: 'freelance', summary: 'Freelance collaboration' },
  { value: 'hiring', label: 'Hiring', icon: 'hiring', summary: 'A role on your team' },
];
const initialBrief = { intent: 'project', name: '', email: '', service: '', timeline: '', message: '' };

function ContactIcon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    project: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01m-2 8 2 2 5-5" /></>,
    freelance: <><path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" /><path d="m18 3 3 3M3 18l3 3" /></>,
    hiring: <><rect x="3" y="7" width="18" height="14" rx="3" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12c5 3 13 3 18 0M10 13h4v3h-4z" /></>,
    linkedin: <><path d="M5 9v11M5 4v.5M10 20V9h4v1.5c1-2.5 6-2.5 6 2.5v7M14 13v7" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
    document: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
    send: <><path d="m21 3-7 18-3.5-7.5L3 10l18-7Z" /><path d="m10.5 13.5 5-5" /></>,
    edit: <><path d="m16 3 5 5-12 12-6 1 1-6L16 3ZM13 6l5 5" /></>,
    spark: <><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" /><circle cx="12" cy="12" r="4" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] ?? paths.arrow}</svg>;
}

function ContactBrief() {
  const formId = useId();
  const [draft, setDraft] = useState(initialBrief);
  const [preview, setPreview] = useState(false);
  const nameRef = useRef(null);
  const previewRef = useRef(null);
  const previousPreview = useRef(false);
  const inquiry = inquiryTypes.find(type => type.value === draft.intent) ?? inquiryTypes[0];
  const update = event => setDraft(current => ({ ...current, [event.target.name]: event.target.value }));

  useEffect(() => {
    if (previousPreview.current === preview) return;
    previousPreview.current = preview;
    (preview ? previewRef.current : nameRef.current)?.focus({ preventScroll: true });
  }, [preview]);

  const submit = event => {
    event.preventDefault();
    // Frontend preview only. Connect a submission endpoint here in the backend phase.
    setPreview(true);
  };

  return <form className="contact-brief" data-state={preview ? 'preview' : 'editing'} onSubmit={submit} aria-labelledby={`${formId}-title`}>
    <div className="contact-brief__header">
      <div><span className="contact-brief__eyebrow">YOUR NEXT CHAPTER</span><h3 id={`${formId}-title`}>Start with a hello<span>.</span></h3></div>
      <span className="contact-brief__stamp" aria-hidden="true"><ContactIcon name={preview ? 'mail' : 'arrow'} /></span>
    </div>
    {preview ? <div className="contact-brief__preview">
      <span className="contact-brief__eyebrow">PREVIEW / NOT SENT</span>
      <h4 ref={previewRef} tabIndex={-1}>Your next move, in a message.</h4>
      <dl>
        <div><dt>Request</dt><dd>{inquiry.summary}</dd></div>
        <div><dt>From</dt><dd>{draft.name}<span>{draft.email}</span></dd></div>
        <div><dt>Focus</dt><dd>{draft.service || 'Let’s figure it out together'}</dd></div>
        <div><dt>Timeline</dt><dd>{draft.timeline || 'Open to a conversation'}</dd></div>
      </dl>
      <p className="contact-brief__preview-message">{draft.message}</p>
      <div className="contact-brief__preview-actions">
        <button type="button" onClick={() => setPreview(false)}><ContactIcon name="edit" /><span>Edit details</span></button>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"><span>Say hello on LinkedIn</span><ContactIcon /></a>
      </div>
      <small className="contact-brief__note">Nothing has been sent. For now, reach me directly on LinkedIn.</small>
    </div> : <>
      <fieldset className="contact-brief__intents">
        <legend>I’m here to talk about…</legend>
        {inquiryTypes.map(type => <label className="contact-brief__intent" key={type.value}>
          <input type="radio" name="intent" value={type.value} checked={draft.intent === type.value} onChange={update} />
          <span><ContactIcon name={type.icon} />{type.label}</span>
        </label>)}
      </fieldset>
      <div className="contact-brief__fields">
        <label className="contact-brief__field"><span>Your name <b aria-hidden="true">*</b></span><input ref={nameRef} name="name" autoComplete="name" placeholder="What should I call you?" value={draft.name} onChange={update} required maxLength={100} /></label>
        <label className="contact-brief__field"><span>Email address <b aria-hidden="true">*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" value={draft.email} onChange={update} required maxLength={254} /></label>
        <label className="contact-brief__field"><span>{draft.intent === 'hiring' ? 'Area of the role' : 'What do you need?'}</span><select name="service" value={draft.service} onChange={update}>
          <option value="">A little direction…</option><option>Development</option><option>Design & UI/UX</option><option>ERP & NetSuite</option><option>A mix of things</option>
        </select></label>
        <label className="contact-brief__field"><span>When are you thinking?</span><select name="timeline" value={draft.timeline} onChange={update}>
          <option value="">Let’s work it out</option><option>As soon as possible</option><option>Within a month</option><option>In the next few months</option><option>Just exploring</option>
        </select></label>
      </div>
      <div className="contact-brief__message">
        <div className="contact-brief__label-row"><label htmlFor={`${formId}-message`}>{draft.intent === 'hiring' ? 'Tell me about the opportunity' : 'A little about your idea'} <b aria-hidden="true">*</b></label><output htmlFor={`${formId}-message`} aria-label="Characters used" aria-live="off">{draft.message.length}<span> / 1,500</span></output></div>
        <textarea id={`${formId}-message`} name="message" rows={3} placeholder={draft.intent === 'hiring' ? 'The role, your team, and what you’re looking to build together…' : 'What are you building, improving, or trying to figure out? Rough ideas welcome.'} value={draft.message} onChange={update} required maxLength={1500} />
      </div>
      <div className="contact-brief__footer">
        <button className="contact-brief__submit" type="submit"><ContactIcon name="send" /><span>Preview message</span><ContactIcon className="contact-brief__submit-arrow" /></button>
        <small className="contact-brief__note">Form preview.<br />Nothing is sent.</small>
      </div>
    </>}
    <span className="contact-brief__status" role="status">{preview ? 'Message preview ready. Nothing has been sent.' : ''}</span>
  </form>;
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
      <aside className="contact-studio__intro">
        <div className="contact-studio__eyebrow"><span>03 /</span><span>START A CONVERSATION</span></div>
        <h2 id="contact-title" className="contact-studio__title"><span>Let’s make</span><em>it happen.</em><ContactIcon name="spark" className="contact-studio__spark" /></h2>
        <p className="contact-studio__lead">A new website, a better workflow, or the right person for your team. Tell me what you have in mind.</p>
        <div className="contact-studio__disciplines" aria-label="Development, design and ERP solutions"><span>Development</span><i aria-hidden="true">/</i><span>Design</span><i aria-hidden="true">/</i><span>ERP solutions</span></div>
        <div className="contact-studio__direct">
          <span className="contact-studio__direct-label">PREFER A DIRECT HELLO?</span>
          <a className="contact-studio__direct-link" href={contact.linkedin} target="_blank" rel="noopener noreferrer"><span className="contact-studio__direct-icon"><ContactIcon name="linkedin" /></span><span><strong>LinkedIn</strong><small>Skip the form. Say hello.</small></span><ContactIcon /></a>
          {contact.email && <a className="contact-studio__direct-link" href={`mailto:${contact.email}`}><span className="contact-studio__direct-icon"><ContactIcon name="mail" /></span><span><strong>Email me</strong><small>{contact.email}</small></span><ContactIcon /></a>}
        </div>
        <a className="contact-studio__resume" href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer"><ContactIcon name="document" /><span>Get to know my work</span><ContactIcon /></a>
        <div className="contact-studio__steps" aria-label="Share the idea, find the fit, make it happen"><span><b>01</b> Share the idea</span><span><b>02</b> Find the fit</span><span><b>03</b> Make it happen</span></div>
      </aside>
      <ContactBrief />
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
    <footer id="site-footer" className="sub-footer"><div className="container"><div className="footer-brand"><Brand /><small>© {new Date().getFullYear()} · Glenn Bernard Pimentel</small></div><FooterHearts /><ul>{socialLinks.map(({ name, href }) => <li key={name}><a href={href}>{name}</a></li>)}</ul></div></footer>
    {showBackToTop && <button type="button" className={`back-to-top ${showTop ? 'is-visible' : ''}`} aria-label="Back to top" tabIndex={showTop ? 0 : -1}
      onClick={() => {
        const home = document.getElementById('home');
        home?.setAttribute('tabindex', '-1'); home?.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      }}><svg height="1.2em" className="arrow" viewBox="0 0 512 512" aria-hidden="true"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z" /></svg></button>}
  </>;
}
/* END OF FILE: HEARTS-PAGES-R1 | Footer.jsx */
