/* CHANGE VERSION: ID-COHERENT-HERO-R1 | Playful, paged About cards around the identity card */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import { socialLinks } from '../data';
import TextLoop from './TextLoop';
import AboutCardDeck from './AboutCardDeck';

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

function Doodle({ kind = 'spark' }) {
  const paths = {
    spark: 'M20 2l4 12 12-4-8 10 8 10-12-4-4 12-4-12-12 4 8-10L4 10l12 4z',
    plus: 'M20 5v30M5 20h30M8 8l24 24M8 32L32 8',
    arrow: 'M4 30c1-17 26-23 29-12 2 9-13 13-15 4M26 28l7-10-11-1',
  };
  return <svg className={`about-doodle about-doodle--${kind}`} viewBox="0 0 40 40" aria-hidden="true"><path d={paths[kind]} /></svg>;
}

function Introduction() {
  const pages = useMemo(() => [
    { id: 'human', label: 'The human', blocks: [
      { id: 'human-kicker', content: <p className="about-intro-overline">BEHIND THE BUILD <Doodle /></p> },
      { id: 'human-name', content: <div className="about-introduction"><h2><span>Glenn Bernard</span>Pimentel<span className="about-name-period">.</span></h2></div> },
      { id: 'human-intro', content: <p className="about-intro-copy">I work where <em>code</em>, <em>design</em>, and <em>business systems</em> meet.</p> },
      { id: 'human-roles', content: <div className="about-role-list" aria-label="Areas of practice"><span>Developer</span><span>Designer</span><span>ERP consultant</span></div> },
      { id: 'human-note', content: <div className="about-small-note"><span className="about-note-prefix" aria-hidden="true">//</span><p>Thoughtful on the surface.<br /><strong>Connected underneath.</strong></p></div> },
    ] },
    { id: 'approach', label: 'My approach', blocks: [
      { id: 'approach-kicker', content: <p className="about-note-kicker">A LITTLE METHOD <Doodle kind="arrow" /></p> },
      { id: 'approach-title', content: <h3 className="about-note-heading">Think it through.<br /><em>Make it click.</em></h3> },
      { id: 'approach-intro', content: <p className="about-note-copy">A useful solution starts with the people and the problem behind it.</p> },
      { id: 'approach-curious', content: <div className="about-principle"><span aria-hidden="true">01</span><p><strong>Stay curious.</strong><span>Understand the why before building the what.</span></p></div> },
      { id: 'approach-clear', content: <div className="about-principle"><span aria-hidden="true">02</span><p><strong>Keep it clear.</strong><span>Make complex ideas easier to use.</span></p></div> },
      { id: 'approach-connect', content: <div className="about-principle"><span aria-hidden="true">03</span><p><strong>Connect the dots.</strong><span>Bring the experience and the business together.</span></p></div> },
    ] },
    { id: 'off-clock', label: 'Off the clock', blocks: [
      { id: 'off-clock-kicker', content: <p className="about-note-kicker">THE OTHER SIDE <Doodle kind="plus" /></p> },
      { id: 'off-clock-title', content: <h3 className="about-note-heading">More than<br /><em>the work.</em></h3> },
      { id: 'off-clock-intro', content: <p className="about-note-copy">A little room for the things that make me, me.</p> },
      { id: 'off-clock-hobby', content: <p className="about-placeholder"><strong>Outside the screen</strong><span>Add a hobby or creative interest here.</span></p> },
      { id: 'off-clock-repeat', content: <p className="about-placeholder"><strong>On repeat lately</strong><span>Add something you are reading, playing, or exploring.</span></p> },
      { id: 'off-clock-note', content: <span className="about-note-placeholder-label">A few personal details, coming soon.</span> },
    ] },
  ], []);

  return <div className="about-wing about-wing--intro">
    <AboutCardDeck id="about-human" label="THE HUMAN" pages={pages} className="about-deck--intro" />
    <div className="about-links-panel">
      <span className="about-panel-label">ELSEWHERE ON THE WEB</span>
      <div className="about-professional-links">{socialLinks.map(link => <a href={link.href} key={link.name} target="_blank" rel="noopener noreferrer"><SocialIcon name={link.name} /><span>{link.name}</span><span className="about-link-arrow" aria-hidden="true">↗</span></a>)}</div>
    </div>
  </div>;
}

function Workbench() {
  const pages = useMemo(() => [
    ...focusAreas.map((area, index) => ({ id: area.id, label: area.title, blocks: [
      { id: `${area.id}-kicker`, content: <p className="about-note-kicker">THE WORKBENCH / 0{index + 1} <Doodle kind={index === 1 ? 'spark' : 'plus'} /></p> },
      { id: `${area.id}-title`, content: <h3 className="about-note-heading about-tool-heading"><span className="about-tool-symbol" aria-hidden="true">{area.code}</span>{area.title}</h3> },
      { id: `${area.id}-subtitle`, content: <p className="about-tool-subtitle">{area.subtitle}</p> },
      { id: `${area.id}-detail`, content: <p className="about-note-copy">{area.detail}</p> },
      { id: `${area.id}-tags`, content: <div className="about-focus-tags">{area.tags.map(tag => <span key={tag}>{tag}</span>)}</div> },
    ] })),
    { id: 'process', label: 'How I work', blocks: [
      { id: 'process-kicker', content: <p className="about-note-kicker">FROM IDEA TO IMPACT <Doodle kind="arrow" /></p> },
      { id: 'process-title', content: <h3 className="about-note-heading">Less guesswork.<br /><em>More purpose.</em></h3> },
      { id: 'process-find', content: <div className="about-process-step"><span className="about-process-step-number" aria-hidden="true">01</span><div><strong>Find the real need.</strong><p>Ask questions, map the context, and define what matters.</p></div></div> },
      { id: 'process-shape', content: <div className="about-process-step"><span className="about-process-step-number" aria-hidden="true">02</span><div><strong>Shape the solution.</strong><p>Sketch the flow, build the pieces, and keep it practical.</p></div></div> },
      { id: 'process-refine', content: <div className="about-process-step"><span className="about-process-step-number" aria-hidden="true">03</span><div><strong>Refine the details.</strong><p>Try it, learn from it, and make the experience clearer.</p></div></div> },
    ] },
    { id: 'next', label: 'Next up', blocks: [
      { id: 'next-kicker', content: <p className="about-note-kicker">ALWAYS IN PROGRESS <Doodle /></p> },
      { id: 'next-title', content: <h3 className="about-note-heading">A little curious.<br /><em>Still building.</em></h3> },
      { id: 'next-intro', content: <p className="about-note-copy">A space for what I am learning and what I would love to build next.</p> },
      { id: 'next-exploring', content: <p className="about-placeholder"><strong>Currently exploring</strong><span>Add a tool, skill, or idea you are learning.</span></p> },
      { id: 'next-wishlist', content: <p className="about-placeholder"><strong>On the wish list</strong><span>Add a project or challenge you would love to take on.</span></p> },
      { id: 'next-note', content: <span className="about-note-placeholder-label">Room for the next chapter.</span> },
    ] },
  ], []);
  return <div className="about-wing about-wing--workbench">
    <AboutCardDeck id="about-work" label="THE WORK" pages={pages} className="about-deck--workbench" />
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
  const fallback = <div className="about-id-loading"><img src={asset('images/profile-id-front.svg?v=LANYARD-PHOTO-ID-R3')} alt="Professional identity card preview" /></div>;
  return <div className="about-centerpiece" style={{ '--about-strap-color': strapColor }}>
    <div className="about-id-stage" ref={stageRef} role="group" aria-label="Interactive identity card" aria-describedby="about-id-play-hint">
      {nearViewport ? <Suspense fallback={fallback}><Lanyard
        frontImage={asset('images/profile-id-front.svg?v=LANYARD-PHOTO-ID-R3')} backImage={asset('images/profile-id-back.svg?v=LANYARD-PHOTO-ID-R3')}
        orientation="portrait" finish="matte" cardColor="#f2e9d6" cornerRadius={0.22}
        size={ID_CARD_SIZE} strapLength={0.54} strapColor={strapColor} adaptiveColor strapWidth={ID_STRAP_WIDTH}
        metal="silver" gravity={0.82} damping={0.46} elasticity={0.42} breeze={0.06} intro interactive
      /></Suspense> : fallback}
    </div>
    <div className="about-play-sticker" aria-hidden="true">
      <svg className="about-play-sticker__arrow" viewBox="0 0 76 88"><path d="M18 82C62 79 67 56 52 45C37 34 31 52 44 56C63 61 64 24 18 18M29 7L17 18 30 29" /></svg>
      <span className="about-play-sticker__spark">✦</span>
      <strong>give me<br />a swing!</strong>
      <span className="about-play-sticker__hint">drag me · tap to flip</span>
    </div>
    <p id="about-id-play-hint" className="about-id-interaction-hint">Drag the identity card to swing it. Click or tap it to flip.</p>
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
/* END OF FILE: ID-COHERENT-HERO-R1 | About.jsx */
