/* CHANGE VERSION: PORTFOLIO-REFINE-R6 | A balanced ID composition beside the unchanged profile bento */
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import TextLoop from './TextLoop';
import MagicBento from './MagicBento';
import BranchedMenu from './BranchedMenu';
import TechLogo from './TechLogo';
import AboutGridBackdrop from './AboutGridBackdrop';
import '../styles/AboutBranches.css';

const loadLanyard = () => import('./Lanyard');
const Lanyard = lazy(loadLanyard);
const ID_CARD_SIZE = 0.67;
const ID_STRAP_WIDTH = 0.56;

const skillBranches = [
  { label: 'Development', children: [
    { value: 'web', label: 'Web interfaces', detail: 'React · JavaScript · HTML / CSS' },
    { value: 'code', label: 'Creative coding', detail: 'Python · Java · interactive experiences' },
  ] },
  { label: 'Design', children: [
    { value: 'uiux', label: 'UI / UX', detail: 'Figma · prototypes · interface design' },
    { value: 'visual', label: 'Visual design', detail: 'Photoshop · Illustrator · Procreate' },
  ] },
  { label: 'NetSuite', children: [
    { value: 'support', label: 'Technical support', detail: 'Troubleshooting · technical guidance' },
    { value: 'workflows', label: 'Business workflows', detail: 'ERP support · practical problem solving' },
  ] },
];

function CvLink() {
  return <a className="about-bento__cv" href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9l-6-6Z" /><path d="M13 3v6h6M8.5 13h7M8.5 17h5" /></svg>
    <span>view CV</span>
  </a>;
}

function SkillExplorer() {
  const [selected, setSelected] = useState(skillBranches[0].children[0]);
  return <div className="about-bento__skill-content">
    <div className="about-bento__card-heading"><h3>Skills<span aria-hidden="true">.</span></h3><span aria-hidden="true">{ }</span></div>
    <BranchedMenu items={skillBranches} defaultOpen={0} defaultActive="web" singleOpen reserveOpenSpace
      width={340} rowHeight={27} indent={29} fontSize={11} radius={7}
      color="#242632" accentColor="color-mix(in srgb, var(--brand-accent, var(--amber)) 38%, #171b24)" lineColor="#b6ad9f" drawDuration={500} foldDuration={440}
      label="Explore my skills" onSelect={(_, item) => setSelected(item)} />
    <div className="about-bento__skill-detail" aria-live="polite" aria-atomic="true">
      <strong>{selected.label}</strong><p>{selected.detail}</p>
    </div>
  </div>;
}

function ProfileBento({ strapColor }) {
  const items = [
    { id: 'identity', colSpan: 2, content: <div className="about-bento__identity">
      <CvLink />
      <h2 id="about-profile-name">Glenn Bernard<br /><span>Pimentel<span className="about-bento__period">.</span></span></h2>
      <p className="about-bento__roles"><span>Software engineer</span><span>UI/UX designer</span><span>NetSuite support</span></p>
    </div> },
    { id: 'skills', rowSpan: 2, content: <SkillExplorer /> },
    { id: 'toolkit', content: <div className="about-bento__tool-content">
      <div className="about-bento__card-heading"><h3>Toolkit</h3><span aria-hidden="true">✳</span></div>
      <ul className="about-bento__tools" aria-label="A few tools I use">
        <li><TechLogo technology="react" /><span>React</span></li>
        <li><TechLogo technology="javascript" /><span>JavaScript</span></li>
        <li><span className="about-bento__tool-letter" aria-hidden="true">F</span><span>Figma</span></li>
        <li><span className="about-bento__tool-letter" aria-hidden="true">Ps</span><span>Photoshop</span></li>
      </ul>
    </div> },
    { id: 'work', content: <div className="about-bento__work-content">
      <div className="about-bento__card-heading"><h3>Selected work</h3><span aria-hidden="true">↗</span></div>
      <p>Salt &amp; Light<br /><span>gbppimentel-dev</span></p>
      <div className="about-bento__work-links"><a href="#projects">projects <span aria-hidden="true">↗</span></a><a href="#netsuite">NetSuite <span aria-hidden="true">↗</span></a></div>
    </div> },
  ];
  return <div className="about-bento-shell" aria-labelledby="about-profile-name">
    <MagicBento items={items} columns={2} rowHeight={152} gap={13} radius={14} theme="light"
      glowColor={strapColor} enableBorderGlow enableSpotlight spotlightRadius={220} clickEffect
      enableTilt={false} enableMagnetism={false} textAutoHide={false} intro className="about-bento"
      style={{ '--mb-surface': '#f2e9d6', '--mb-edge': '#191d26', '--mb-highlight': 'transparent', '--mb-shadow': '4px 5px 0 #11151d', '--mb-spot-alpha': .07 }} />
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
  const fallback = <div className="about-id-loading"><img src={asset('images/profile-id-front-r6.svg?v=PORTFOLIO-REFINE-R6')} alt="Professional identity card preview" /></div>;
  return <div className="about-centerpiece" style={{ '--about-strap-color': strapColor }}>
    <div className="about-id-stage" ref={stageRef} role="group" aria-label="Interactive identity card">
      {nearViewport ? <Suspense fallback={fallback}><Lanyard
        frontImage={asset('images/profile-id-front-r6.svg?v=PORTFOLIO-REFINE-R6')} backImage={asset('images/profile-id-back-r5.svg?v=PORTFOLIO-REFINE-R5')}
        orientation="portrait" finish="matte" cardColor="#f2e9d6" cornerRadius={0.22}
        size={ID_CARD_SIZE} strapLength={0.54} strapColor={strapColor} adaptiveColor strapWidth={ID_STRAP_WIDTH}
        metal="silver" gravity={0.82} damping={0.46} elasticity={0.42} breeze={0.06} intro interactive extendTo=".about-studio-layout"
      /></Suspense> : fallback}
    </div>
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
    <section className="works about-profile about-profile--bento" id="about" aria-label="About Glenn Bernard Pimentel" tabIndex={-1}>
    <div className="section-art" aria-hidden="true" style={{ backgroundImage: `url(${asset('images/about-me.png')})` }} />
    <AboutGridBackdrop />
    <TextLoop text="ABOUT ME" separateWords speed={76} direction="forward" separator="✦"
      fontSize={36} fontWeight={800} letterSpacing={1.8} color="var(--ink)" ribbon
      ribbonColor="var(--brand-accent, var(--amber))" ribbonWidth={88}
      separatorColors={['var(--ink)', 'var(--ink)']} pauseOnHover className="about-profile__text-loop" />
    <div className="about-studio-layout">
      <LanyardId strapColor={strapColor} />
      <ProfileBento strapColor={strapColor} />
    </div>
    </section>
  </div>
  {/* Keep reading space outside the sticky scene so Contact covers it before release. */}
  <div className="about-scroll-hold" aria-hidden="true" />
  </>;
}
/* END OF FILE: PORTFOLIO-REFINE-R6 | About.jsx */
