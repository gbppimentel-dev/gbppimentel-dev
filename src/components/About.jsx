/* CHANGE VERSION: ABOUT-PROFILE-R2 | A finished profile grounded in real work, creative practice and NetSuite support */
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import { projects, socialLinks } from '../data';
import TextLoop from './TextLoop';
import AboutCardDeck from './AboutCardDeck';
import BranchedMenu from './BranchedMenu';
import '../styles/AboutBranches.css';

const loadLanyard = () => import('./Lanyard');
const Lanyard = lazy(loadLanyard);
const ID_CARD_SIZE = 0.67;
const ID_STRAP_WIDTH = 0.56;

// These short entries are real areas of practice. Each detail is a separate
// measured block, so the deck can keep whole ideas together on smaller screens.
export const aboutToolkitBranches = [
  { label: 'Development', children: [
    { value: 'interfaces', label: 'Web interfaces', detail: 'React, JavaScript, HTML and CSS: turning a layout into a working, responsive interface.', icon: <svg viewBox="0 0 20 20"><path d="m6 5-4 5 4 5m8-10 4 5-4 5M12 3 8 17" /></svg> },
    { value: 'games', label: 'Games & interaction', detail: 'Python and Java game projects, combining code with original visuals, story and interaction.', icon: <svg viewBox="0 0 20 20"><rect x="2" y="5" width="16" height="11" rx="3" /><path d="M5 10h4M7 8v4m6-3v.1m2 3v.1" /></svg> },
  ] },
  { label: 'Design', children: [
    { value: 'experience', label: 'UI / UX & prototypes', detail: 'Interface design and Figma prototypes that give a product a clear structure before the build.', icon: <svg viewBox="0 0 20 20"><rect x="2" y="3" width="16" height="14" rx="2" /><path d="M2 7h16M7 7v10" /></svg> },
    { value: 'visuals', label: 'Visual design', detail: 'Freelance art and digital assets, using Photoshop, Illustrator and Procreate alongside my design work.', icon: <svg viewBox="0 0 20 20"><circle cx="7" cy="7" r="4" /><path d="M9 10h8v7H9z" /></svg> },
  ] },
  { label: 'NetSuite', children: [
    { value: 'support', label: 'Technical support', detail: 'Investigating system behavior, understanding the business impact and explaining the next step clearly.', icon: <svg viewBox="0 0 20 20"><path d="M3 11V8a7 7 0 0 1 14 0v3M3 8H2v6h3V8H3Zm14 0h1v6h-3V8h2Zm0 6c0 3-4 3-6 3" /></svg> },
    { value: 'workflows', label: 'Business workflows', detail: 'Connecting a business request with the process, records and workflow that sit behind it.', icon: <svg viewBox="0 0 20 20"><rect x="2" y="2" width="6" height="5" rx="1" /><rect x="12" y="13" width="6" height="5" rx="1" /><path d="M5 7v6h10m-3-3 3 3-3 3" /></svg> },
  ] },
];

const personalBuilds = [
  { id: 'salt-and-light', copy: 'Faith and everyday goals, brought together in a gamified life tracker.' },
  { id: 'lifecity-attendance', copy: 'A church attendance app for the LifeCity community.' },
  { id: 'gbppimentel-dev', copy: 'An interactive home for my development, design and ERP work.' },
].map(entry => ({ ...entry, project: projects.find(project => project.id === entry.id) })).filter(entry => entry.project);

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

function ProfileProof({ meta, title, children }) {
  return <div className="about-proof"><span className="about-proof__meta">{meta}</span><h4>{title}</h4><p>{children}</p></div>;
}

function ProfileLink({ href, children, pdf = false }) {
  return <a className="about-profile-link" href={href} target={pdf ? '_blank' : undefined} rel={pdf ? 'noopener noreferrer' : undefined}>{children}<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" /></svg></a>;
}

function Introduction() {
  const pages = useMemo(() => [
    { id: 'human', label: 'Meet Glenn', blocks: [
      { id: 'human-kicker', content: <p className="about-intro-overline">THE PERSON BEHIND THE WORK <Doodle /></p> },
      { id: 'human-name', content: <div className="about-introduction"><h2><span>Glenn Bernard</span>Pimentel<span className="about-name-period">.</span></h2></div> },
      { id: 'human-intro', content: <p className="about-intro-copy">I’m a software engineer and UI/UX designer with a creative background and experience in <em>NetSuite technical support</em>.</p> },
      { id: 'human-roles', content: <div className="about-role-list" aria-label="Areas of practice"><span>Development</span><span>Design</span><span>ERP solutions</span></div> },
      { id: 'human-note', content: <div className="about-profile-statement"><span aria-hidden="true">✦</span><p>From the interface people see<br />to the systems they work with.</p></div> },
    ] },
    { id: 'foundations', label: 'My foundations', blocks: [
      { id: 'foundations-kicker', content: <p className="about-note-kicker">LEARNING THROUGH MAKING <Doodle kind="plus" /></p> },
      { id: 'foundations-title', content: <h3 className="about-note-heading">A creative eye.<br /><em>A technical foundation.</em></h3> },
      { id: 'foundations-education', content: <ProfileProof meta="2023 / EDUCATION" title="Polytechnic University of the Philippines">Graduated Magna Cum Laude.</ProfileProof> },
      { id: 'foundations-background', content: <p className="about-note-copy">My background spans front-end web work, freelance design and game projects. I bring that mix into how I build and troubleshoot.</p> },
      { id: 'foundations-resume', content: <ProfileLink href={asset('Pimentel-Resume-IT.pdf')} pdf>Read my résumé</ProfileLink> },
    ] },
    { id: 'creative', label: 'Creative practice', blocks: [
      { id: 'creative-kicker', content: <p className="about-note-kicker">DESIGN / ART / INTERACTION <Doodle /></p> },
      { id: 'creative-title', content: <h3 className="about-note-heading">I think in<br /><em>screens and stories.</em></h3> },
      { id: 'creative-intro', content: <p className="about-note-copy">My freelance background includes UI/UX, website prototypes, game design and commissioned art.</p> },
      { id: 'creative-origin', content: <ProfileProof meta="2022 / PYTHON" title="Origin University">Independently designed and programmed an educational visual novel, including its story, graphics and animations.</ProfileProof> },
      { id: 'creative-deceit', content: <ProfileProof meta="2021 / JAVA" title="Deceit">Co-designed and programmed a horror visual novel with custom interface assets, characters and interactive gameplay.</ProfileProof> },
      { id: 'creative-tools', content: <div className="about-profile-tools"><span>DESIGN TOOLS</span><div className="about-focus-tags"><span>Figma</span><span>Photoshop</span><span>Illustrator</span><span>Procreate</span></div></div> },
    ] },
  ], []);

  return <div className="about-wing about-wing--intro">
    <AboutCardDeck id="about-human" label="THE HUMAN" pages={pages} className="about-deck--intro" />
    <div className="about-links-panel">
      <span className="about-panel-label">LET’S CONNECT</span>
      <div className="about-professional-links">{socialLinks.map(link => <a href={link.href} key={link.name} target="_blank" rel="noopener noreferrer"><SocialIcon name={link.name} /><span>{link.name}</span><span className="about-link-arrow" aria-hidden="true">↗</span></a>)}</div>
    </div>
  </div>;
}

function Workbench() {
  const [toolkitSelection, setToolkitSelection] = useState(aboutToolkitBranches[0].children[0]);
  const pages = useMemo(() => [
    { id: 'toolkit', label: 'Explore my toolkit', blocks: [
      { id: 'toolkit-kicker', content: <p className="about-branches-kicker"><span aria-hidden="true">↳</span> SKILLS, WITH CONTEXT <span aria-hidden="true">✦</span></p> },
      { id: 'toolkit-menu', content: <BranchedMenu items={aboutToolkitBranches} defaultOpen={aboutToolkitBranches.findIndex(branch => branch.children.some(child => child.value === toolkitSelection.value))} defaultActive={toolkitSelection.value} singleOpen reserveOpenSpace rowHeight={26} fontSize={12} width={340} label="Glenn’s toolkit topics" className="about-toolkit-menu" onSelect={(_value, item) => setToolkitSelection(item)} /> },
      { id: 'toolkit-preview', content: <div className="about-branch-preview" aria-live="polite" aria-atomic="true"><strong>{toolkitSelection.label}</strong><p>{toolkitSelection.detail}</p></div> },
    ] },
    { id: 'web-work', label: 'Web work', blocks: [
      { id: 'web-kicker', content: <p className="about-note-kicker">FRONT-END / UI & UX <Doodle kind="plus" /></p> },
      { id: 'web-title', content: <h3 className="about-note-heading">Useful interfaces.<br /><em>Real contexts.</em></h3> },
      { id: 'web-blokc', content: <ProfileProof meta="2023 / INTERNSHIP" title="The BLOKC · UNBLOKC">Developed the event website’s UI/UX and front-end, using HTML, CSS and JavaScript.</ProfileProof> },
      { id: 'web-scholars', content: <ProfileProof meta="2022–2023 / FRONT-END" title="PUP-STB Scholars Portal">Designed and built a front-end for scholars to submit requirements and documents to administrators.</ProfileProof> },
      { id: 'web-stack', content: <div className="about-focus-tags" aria-label="Web technologies"><span>React</span><span>JavaScript</span><span>HTML / CSS</span></div> },
    ] },
    { id: 'personal-builds', label: 'Personal builds', blocks: [
      { id: 'builds-kicker', content: <p className="about-note-kicker">PRODUCTS / COMMUNITIES <Doodle /></p> },
      { id: 'builds-title', content: <h3 className="about-note-heading">Ideas I keep<br /><em>building.</em></h3> },
      ...personalBuilds.map(({ id, copy, project }) => ({ id: `build-${id}`, content: <ProfileProof meta="PERSONAL PROJECT" title={project.title}>{copy}</ProfileProof> })),
    ] },
    { id: 'erp-support', label: 'NetSuite & support', blocks: [
      { id: 'erp-kicker', content: <p className="about-note-kicker">ERP / BUSINESS SYSTEMS <Doodle kind="plus" /></p> },
      { id: 'erp-title', content: <h3 className="about-note-heading">Technical work.<br /><em>Business context.</em></h3> },
      { id: 'erp-intro', content: <p className="about-note-copy">I bring a developer’s eye to NetSuite support: understanding an issue, connecting the process and explaining the next step.</p> },
      { id: 'erp-investigate', content: <div className="about-profile-practice"><span aria-hidden="true">01</span><p><strong>Investigate the behavior.</strong><span>Trace the steps and understand what the user needs.</span></p></div> },
      { id: 'erp-translate', content: <div className="about-profile-practice"><span aria-hidden="true">02</span><p><strong>Connect the context.</strong><span>Relate technical findings to the business process.</span></p></div> },
      { id: 'erp-explain', content: <div className="about-profile-practice"><span aria-hidden="true">03</span><p><strong>Make the handover clear.</strong><span>Document the outcome and the practical next step.</span></p></div> },
      { id: 'erp-link', content: <ProfileLink href="#netsuite">Explore my NetSuite focus</ProfileLink> },
    ] },
  ], [toolkitSelection]);
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
/* END OF FILE: ABOUT-PROFILE-R2 | About.jsx */
