// CHANGE VERSION: PORTFOLIO-SELF-CASE-STUDY-R4 | A portfolio-native case-study workbench
import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { asset } from '../utils/assets';
import TechLogo, { technologyCatalog } from './TechLogo';
import '../styles/PortfolioProjectNotes.css';

const pad = value => String(value).padStart(2, '0');

function WorkbenchIcon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    next: <path d="M4 12h16m-6-6 6 6-6 6" />,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" />,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="m12 12 8-8" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></>,
    motion: <><path d="m4 18 6-12 4 12 6-12M3 22h18M3 2h18" /><circle cx="20" cy="6" r="2" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    pointer: <><path d="m4 3 6 17 3-7 7-3L4 3Zm9 10 6 6" /><path d="m19 3 1-2m2 6h2M15 2V0" /></>,
    id: <><rect x="3" y="6" width="18" height="15" rx="2" /><path d="M9 6V3h6v3m-1 7h4m-4 4h4" /><circle cx="8" cy="12" r="2" /><path d="M5 18v-1a3 3 0 0 1 6 0v1" /></>,
    route: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="M8 5h8a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h8" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
  };
  return <svg className={`pps-icon ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.arrow}</svg>;
}

const fallbackFeatures = [
  { title: 'A hero with three modes', description: 'Carousel timing, rotating words, character reveals, and decryption give each introduction its own rhythm.', icon: 'motion' },
  { title: 'An identity you can move', description: 'The draggable lanyard turns an ordinary profile image into a hands-on part of the About section.', icon: 'id' },
  { title: 'Sections that take the stage', description: 'Layered scrolling lets About and Contact move over the previous section, with looping banners marking each transition.', icon: 'layers' },
  { title: 'A gallery that opens up', description: 'The project accordion connects preview images, technology explanations, source links, and individual case-study experiences.', icon: 'screen' },
  { title: 'Navigation with momentum', description: 'An animated hamburger, staggered menu, and branded page loader carry the same visual language across the site.', icon: 'route' },
  { title: 'Small, connected interactions', description: 'Adaptive colors, a custom pointer, and a persistent heart counter add detail around the main content.', icon: 'heart' },
];

function StoryPanel({ section, featureDetails, technologyNotes, deployment, reducedMotion }) {
  return <motion.div className="pps-story-panel" key={section.key}
    initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
    transition={{ duration: reducedMotion ? 0 : .24, ease: [.22, 1, .36, 1] }}>
    <div className="pps-story-panel__title"><span aria-hidden="true">{section.symbol}</span><h4>{section.title}</h4></div>
    {section.key === 'features' ? <div className="pps-feature-grid">{featureDetails.map((feature, index) =>
      <article className={`pps-feature pps-feature--${index % 3}`} key={feature.title}>
        <WorkbenchIcon name={feature.icon || fallbackFeatures[index % fallbackFeatures.length].icon} />
        {feature.tag && <small>{feature.tag}</small>}<h5>{feature.title}</h5><p>{feature.description}</p>
      </article>
    )}</div> : <p className="pps-story-text">{section.content}</p>}
    {section.key === 'approach' && <div className="pps-build-route" aria-label="Build priorities">
      <span>components</span><i aria-hidden="true">→</i><span>motion</span><i aria-hidden="true">→</i><span>cohesion</span>
    </div>}
    {section.key === 'approach' && technologyNotes.length > 0 && <dl className="pps-technology-roles" aria-label="What the tools do in this project">
      {technologyNotes.map(item => <div key={item.technology}><dt><TechLogo technology={item.technology} /><span>{technologyCatalog[item.technology]?.label || item.technology}</span></dt><dd>{item.role}</dd></div>)}
    </dl>}
    {section.key === 'outcome' && <div className="pps-result-note"><WorkbenchIcon name="check" /><span>A working experience you can explore on this site.</span></div>}
    {section.key === 'outcome' && deployment && <div className="pps-deployment"><span>{deployment.automation}</span><WorkbenchIcon name="next" /><span>{deployment.platform}</span><p>{deployment.description}</p></div>}
  </motion.div>;
}

function BuildScreenshot({ screen, index, reducedMotion }) {
  const present = useIsPresent();
  return <motion.a className="pps-screen__image" href={asset(screen.src)} target="_blank" rel="noopener noreferrer"
    aria-label={`Open portfolio screenshot ${index + 1} at full size`} aria-hidden={present ? undefined : true} inert={!present} tabIndex={present ? undefined : -1}
    initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .38 }}>
    <img src={asset(screen.src)} alt={screen.alt} loading="lazy" /><span className="pps-screen__expand"><WorkbenchIcon name="expand" /></span>
  </motion.a>;
}

export default function PortfolioProjectNotes({ project, headingId, reducedMotion }) {
  const study = project.caseStudy || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const tabRefs = useRef([]);
  const screenRefs = useRef([]);
  const instanceId = useId().replace(/:/g, '');
  const panelId = `portfolio-story-${instanceId}`;
  const screenId = `portfolio-screen-${instanceId}`;
  const sections = [
    { key: 'challenge', label: 'The brief', title: 'More than a list of links.', symbol: '{ }', icon: 'target', content: study.challenge },
    { key: 'approach', label: 'The build', title: 'One visual language. Many moving parts.', symbol: '</>', icon: 'code', content: study.approach },
    { key: 'features', label: 'In motion', title: 'The details do the talking.', symbol: '✳', icon: 'motion' },
    { key: 'outcome', label: 'The result', title: 'Built to show the work.', symbol: '↗', icon: 'check', content: study.outcome },
  ];
  const active = sections[activeIndex];
  const nextIndex = (activeIndex + 1) % sections.length;
  const screens = study.screens || [];
  const screen = screens[Math.min(screenIndex, Math.max(0, screens.length - 1))];
  const featureDetails = study.featureDetails?.length ? study.featureDetails : fallbackFeatures;

  const selectWithKeys = (event, index, count, select, refs) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % count;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + count) % count;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = count - 1;
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    refs.current[next]?.focus({ preventScroll: true });
  };

  return <div className="portfolio-study" data-motion={reducedMotion ? 'reduced' : 'full'}>
    <header className="pps-chrome">
      <div className="pps-chrome__brand"><img src={asset('brand/triangle-logo.png')} width="26" height="26" alt="" /><span>gbppimentel<span>-dev</span></span></div>
      <span className="pps-chrome__label"><span aria-hidden="true">✦</span> A CASE STUDY OF THIS VERY SITE</span>
      <span className="pps-chrome__dots" aria-hidden="true"><i /><i /><i /></span>
    </header>

    <section className="pps-intro" aria-labelledby={headingId}>
      <svg className="pps-intro__orbit" viewBox="0 0 400 380" fill="none" aria-hidden="true" focusable="false"><ellipse cx="200" cy="190" rx="173" ry="124" transform="rotate(-27 200 190)" /><ellipse cx="200" cy="190" rx="173" ry="124" transform="rotate(35 200 190)" strokeDasharray="3 7" /><circle cx="329" cy="95" r="8" fill="currentColor" /></svg>
      <div className="pps-intro__copy">
        <span className="pps-eyebrow">DEVELOPMENT + DESIGN + ERP SOLUTIONS</span>
        <h3 id={headingId} tabIndex={-1}>gbppimentel<span>-dev.</span></h3>
        <p className="pps-lead">{project.description}</p>
        <p className="pps-summary">{project.details}</p>
        <div className="pps-actions">
          <a className="pps-action pps-action--primary" href={project.liveUrl || '#home'}><WorkbenchIcon name="screen" /><span>{project.liveLabel || 'Explore portfolio'}</span><WorkbenchIcon name="arrow" /></a>
          <a className="pps-action pps-action--source" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><WorkbenchIcon name="code" /><span>Source code</span><WorkbenchIcon name="arrow" /></a>
        </div>
      </div>
      <aside className="pps-project-card" aria-label="Project at a glance">
        <div className="pps-project-card__header"><span aria-hidden="true">{'{ portfolio }'}</span><WorkbenchIcon name="pointer" /></div>
        <dl>{[['My role', study.role], ['Focus', study.focus], ['Scope', study.scope]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <div className="pps-project-card__footer"><span className="pps-status-dot" aria-hidden="true" />{project.status}</div>
      </aside>
    </section>

    <section className="pps-workbench" aria-labelledby={`portfolio-notes-title-${instanceId}`}>
      <header className="pps-section-heading"><div><span className="pps-eyebrow">BEHIND THE INTERFACE</span><h4 id={`portfolio-notes-title-${instanceId}`}>The build notes<span>_</span></h4></div><span className="pps-section-heading__mark" aria-hidden="true">✳</span></header>
      <div className="pps-editor">
        <div className="pps-editor-tabs" role="tablist" aria-label="Portfolio case study sections">
          {sections.map((section, index) => <button type="button" className="pps-editor-tab" role="tab" key={section.key}
            ref={node => { tabRefs.current[index] = node; }} id={`portfolio-tab-${instanceId}-${index}`}
            aria-selected={activeIndex === index} aria-controls={panelId} tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)} onKeyDown={event => selectWithKeys(event, index, sections.length, setActiveIndex, tabRefs)}>
            <span className="pps-editor-tab__number" aria-hidden="true">{pad(index + 1)}</span><WorkbenchIcon name={section.icon} /><span>{section.label}</span>
          </button>)}
        </div>
        <div className="pps-editor-content" role="tabpanel" id={panelId} aria-labelledby={`portfolio-tab-${instanceId}-${activeIndex}`} tabIndex={0}>
          <div className="pps-editor-content__path" aria-hidden="true"><span>portfolio</span><i>/</i><span>{active.key}.notes</span><i>•</i><b>case study</b></div>
          <AnimatePresence mode="wait" initial={false}><StoryPanel key={active.key} section={active} featureDetails={featureDetails}
            technologyNotes={study.technologyNotes || []} deployment={study.deployment} reducedMotion={reducedMotion} /></AnimatePresence>
        </div>
        <footer className="pps-editor-footer"><span>{pad(activeIndex + 1)} / {pad(sections.length)}</span><button type="button" onClick={() => setActiveIndex(nextIndex)}><span>Next: {sections[nextIndex].label}</span><WorkbenchIcon name="next" /></button></footer>
      </div>
    </section>

    {screen && <section className="pps-screen-section" aria-labelledby={`portfolio-screens-title-${instanceId}`}>
      <header className="pps-section-heading"><div><span className="pps-eyebrow">FROM THE RUNNING BUILD</span><h4 id={`portfolio-screens-title-${instanceId}`}>A closer look<span>.</span></h4></div><span className="pps-screen-count" aria-hidden="true">{pad(screenIndex + 1)} / {pad(screens.length)}</span></header>
      <div className="pps-screen-workspace">
        <div className="pps-screen-tabs" role="tablist" aria-label="Portfolio screenshots">
          {screens.map((item, index) => <button className="pps-screen-tab" type="button" role="tab" key={item.src}
            ref={node => { screenRefs.current[index] = node; }} id={`portfolio-screen-tab-${instanceId}-${index}`}
            aria-selected={screenIndex === index} aria-controls={screenId} tabIndex={screenIndex === index ? 0 : -1}
            onClick={() => setScreenIndex(index)} onKeyDown={event => selectWithKeys(event, index, screens.length, setScreenIndex, screenRefs)}>
            <span>{pad(index + 1)}</span><span>{item.label || ['First impression', 'Creative modes', 'About & identity', 'Navigation'][index] || `Screen ${index + 1}`}</span><WorkbenchIcon name="screen" />
          </button>)}
        </div>
        <figure className="pps-screen" role="tabpanel" id={screenId} aria-labelledby={`portfolio-screen-tab-${instanceId}-${screenIndex}`} tabIndex={0}>
          <div className="pps-screen__chrome"><span aria-hidden="true"><i /><i /><i /></span><b>gbppimentel-dev / {screen.label || `screen ${screenIndex + 1}`}</b><WorkbenchIcon name="screen" /></div>
          <div className="pps-screen__stage"><AnimatePresence initial={false} mode="sync"><BuildScreenshot key={screen.src} screen={screen} index={screenIndex} reducedMotion={reducedMotion} /></AnimatePresence></div>
          <figcaption key={screen.src}><span aria-hidden="true">↳</span>{screen.caption}</figcaption>
        </figure>
      </div>
    </section>}
  </div>;
}
// END OF FILE: PORTFOLIO-SELF-CASE-STUDY-R4 | PortfolioProjectNotes.jsx
