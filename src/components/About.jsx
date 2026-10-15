/* CHANGE VERSION: ABOUT-STUDIO-R6 | Continuous scene hold with the hero visible above */
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import { socialLinks } from '../data';
import TextLoop from './TextLoop';

const loadLanyard = () => import('./Lanyard');
const Lanyard = lazy(loadLanyard);
const ID_CARD_SIZE = 0.67;
const ID_STRAP_WIDTH = 0.56;
const focusAreas = [
  { id: 'development', code: '</>', title: 'Development', subtitle: 'Interfaces with purpose.', detail: 'Useful experiences, thoughtful interactions, and code that brings an idea to life.', tags: ['Web', 'Systems', 'Scripts'] },
  { id: 'design', code: '✦', title: 'Design', subtitle: 'Clarity in every detail.', detail: 'Turning complex ideas into clear layouts, considered visuals, and intuitive flows.', tags: ['UI / UX', 'Visual design', 'Prototyping'] },
  { id: 'erp', code: '{ }', title: 'ERP solutions', subtitle: 'The business behind the build.', detail: 'Connecting business requirements with practical workflows, automation, and ERP solutions.', tags: ['NetSuite', 'Workflows', 'Automation'] },
];

function SocialIcon({ name }) {
  return name === 'LinkedIn'
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v11M5 4v.5M10 20V9h4v1.5c1-2.5 6-2.5 6 2.5v7M14 13v7" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 20c-4 1-4-2-5-2m14 4v-4c0-1-.3-1.7-.8-2.2 2.7-.3 5.8-1.3 5.8-6A4.7 4.7 0 0 0 21.7 6a4.4 4.4 0 0 0-.1-3s-1-.3-3.2 1.2a11.3 11.3 0 0 0-5.8 0C10.4 2.7 9.4 3 9.4 3a4.4 4.4 0 0 0-.1 3A4.7 4.7 0 0 0 8 9.8c0 4.7 3.1 5.7 5.8 6-.5.5-.8 1.2-.8 2.2v4" transform="translate(-3 0)" /></svg>;
}

function Introduction() {
  return <div className="about-wing about-wing--intro">
    <article className="about-introduction">
      <div className="about-panel-label"><span>01 / THE HUMAN</span><i aria-hidden="true" /></div>
      <p className="about-intro-overline">BEHIND THE BUILD</p>
      <h2><span>Glenn Bernard</span>Pimentel<span className="about-name-period">.</span></h2>
      <p className="about-intro-copy">I work where <em>code</em>, <em>design</em>, and <em>business systems</em> meet.</p>
      <div className="about-role-list" aria-label="Areas of practice"><span>Developer</span><b aria-hidden="true">/</b><span>Designer</span><b aria-hidden="true">/</b><span>ERP consultant</span></div>
      <div className="about-small-note"><span className="about-note-prefix" aria-hidden="true">//</span><p>Thoughtful on the surface.<br /><strong>Connected underneath.</strong></p></div>
    </article>
    <div className="about-links-panel">
      <span className="about-panel-label">ELSEWHERE ON THE WEB</span>
      <div className="about-professional-links">{socialLinks.map(link => <a href={link.href} key={link.name} target="_blank" rel="noopener noreferrer"><SocialIcon name={link.name} /><span>{link.name}</span><span className="about-link-arrow" aria-hidden="true">↗</span></a>)}</div>
    </div>
  </div>;
}

function Workbench() {
  const [active, setActive] = useState('development');
  return <div className="about-wing about-wing--workbench">
    <section className="about-workbench" aria-label="Areas of work">
      <div className="about-panel-label"><span>02 / THE WORKBENCH</span><span className="about-live-dot" aria-hidden="true" /></div>
      <h3>Different tools.<br /><em>One connected view.</em></h3>
      <div className="about-focus-list">{focusAreas.map((area, index) => {
        const open = active === area.id;
        return <article className="about-focus" data-active={open} key={area.id}>
          <button type="button" aria-expanded={open} aria-controls={`about-focus-${area.id}`} onClick={() => setActive(area.id)}>
            <span className="about-focus-code" aria-hidden="true">{area.code}</span>
            <span className="about-focus-title">{area.title}</span>
            <span className="about-focus-index" aria-hidden="true">0{index + 1}</span>
            <span className="about-focus-toggle" aria-hidden="true">{open ? '−' : '+'}</span>
          </button>
          <div className="about-focus-reveal" inert={!open} id={`about-focus-${area.id}`} aria-hidden={!open}>
            <div><p className="about-focus-subtitle">{area.subtitle}</p><p>{area.detail}</p><div className="about-focus-tags">{area.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
          </div>
        </article>;
      })}</div>
    </section>
    <div className="about-process" aria-label="From idea through build to impact"><div className="about-process-nodes"><span>IDEA</span><i aria-hidden="true" /><span>BUILD</span><i aria-hidden="true" /><span>IMPACT</span></div><p>Make it useful. Make it clear.</p></div>
    <a href="#projects" className="about-work-link"><span>Explore the work</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg></a>
  </div>;
}

function LanyardId({ strapColor }) {
  const stageRef = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    if (!('IntersectionObserver' in window)) { setNearViewport(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: '220px 0px' });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  const fallback = <div className="about-id-loading"><img src={asset('images/profile-id-front.svg')} alt="Professional identity card preview" /></div>;
  return <div className="about-centerpiece" style={{ '--about-strap-color': strapColor }}>
    <div className="about-id-stage" ref={stageRef}>
      {nearViewport ? <Suspense fallback={fallback}><Lanyard
        frontImage={asset('images/profile-id-front.svg')} backImage={asset('images/profile-id-back.svg')}
        orientation="portrait" finish="matte" cardColor="#1b1d24" cornerRadius={0.22}
        size={ID_CARD_SIZE} strapLength={0.54} strapColor={strapColor} strapWidth={ID_STRAP_WIDTH}
        metal="gold" gravity={0.82} damping={0.46} elasticity={0.42} breeze={0.06} intro interactive
      /></Suspense> : fallback}
    </div>
    <div className="about-id-caption"><span className="about-id-caption-dot" aria-hidden="true" /><span>DRAG TO SWING</span><b aria-hidden="true">✦</b><span>CLICK TO FLIP</span></div>
  </div>;
}

export default function About({ strapColor = '#d8b97c' }) {
  useEffect(() => {
    let idle = 0;
    let timer = 0;
    const preload = () => { loadLanyard().catch(() => {}); };
    if ('requestIdleCallback' in window) idle = window.requestIdleCallback(preload, { timeout: 1800 });
    else timer = window.setTimeout(preload, 900);
    return () => { if (idle) window.cancelIdleCallback(idle); window.clearTimeout(timer); };
  }, []);

  return <>
  <div className="about-scroll-stage">
    <section className="works about-profile" id="about" aria-label="About Glenn Bernard Pimentel" tabIndex={-1}>
    <div className="section-art" aria-hidden="true" style={{ backgroundImage: `url(${asset('images/about-me.png')})` }} />
    <TextLoop text="ABOUT ME" separateWords speed={76} direction="forward" separator="✦"
      fontSize={36} fontWeight={800} letterSpacing={1.8} color="var(--ink)" ribbon
      ribbonColor="var(--brand-accent, var(--amber))" ribbonWidth={88}
      separatorColors={['var(--ink)', 'var(--ink)']} pauseOnHover className="about-profile__text-loop" />
    <div className="about-studio-layout">
      <Introduction />
      <LanyardId strapColor={strapColor} />
      <Workbench />
    </div>
    <span className="about-scene-signature" aria-hidden="true">GBPPIMENTEL-DEV / HUMAN BEHIND THE SYSTEM</span>
    </section>
  </div>
  {/* Keep reading space outside the sticky scene so Contact covers it before release. */}
  <div className="about-scroll-hold" aria-hidden="true" />
  </>;
}
/* END OF FILE: ABOUT-STUDIO-R6 | About.jsx */
