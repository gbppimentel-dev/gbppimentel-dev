// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R1 | Salt & Light's own project journal
import { useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import TechLogo, { technologyCatalog } from './TechLogo';
import { asset } from '../utils/assets';
import '../styles/SaltLightProjectNotes.css';

const pad = value => String(value).padStart(2, '0');
const sections = [
  { key: 'overview', label: 'Overview', icon: 'home', note: 'Purpose & approach' },
  { key: 'features', label: 'Quest log', icon: 'target', note: 'What the app does' },
  { key: 'build', label: 'Under the hood', icon: 'layers', note: 'Tools & decisions' },
  { key: 'screens', label: 'A look inside', icon: 'screen', note: 'From the actual build' },
];

function SaltIcon({ name = 'spark', className = '' }) {
  const paths = {
    spark: <><path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z" /><path d="m19 3 .5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3Z" /></>,
    bolt: <path d="m13.5 2-9 12h6L9 22l10.5-13h-6l1-7Z" />,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    next: <path d="M4 12h16m-6-6 6 6-6 6" />,
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-8h6v8" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" />,
    book: <><path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15" /><path d="M5 8h3m8 0h3M5 12h3m8 0h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    flag: <><path d="M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    users: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a5 5 0 0 1 10 0v2m5-17a4 4 0 0 1 0 8m0 4a5 5 0 0 1 5 5" /></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  };
  return <svg className={`sls-icon ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.spark}</svg>;
}

function FadePanel({ children, reducedMotion, className = '' }) {
  const present = useIsPresent();
  return <motion.div className={`sls-panel ${className}`.trim()} aria-hidden={present ? undefined : true} inert={!present}
    initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
    transition={{ duration: reducedMotion ? 0 : present ? .32 : .14, ease: [.22, 1, .36, 1] }}>
    {children}
  </motion.div>;
}

function Overview({ study }) {
  return <div className="sls-overview">
    <div className="sls-panel-heading"><span className="sls-kicker">THE IDEA</span><h4>Purpose behind the progress.</h4></div>
    <div className="sls-overview-grid">
      <article className="sls-note"><span className="sls-note-icon"><SaltIcon name="target" /></span><h5>The challenge</h5><p>{study.challenge}</p></article>
      <article className="sls-note"><span className="sls-note-icon sls-note-icon--gold"><SaltIcon name="layers" /></span><h5>The approach</h5><p>{study.approach}</p></article>
    </div>
    <article className="sls-outcome"><span className="sls-outcome__icon"><SaltIcon name="flag" /></span><div><span className="sls-kicker">THE OUTCOME</span><h5>A connected daily experience.</h5><p>{study.outcome}</p></div></article>
  </div>;
}

function FeatureJournal({ study, reducedMotion, instanceId }) {
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  const details = study.featureDetails?.length ? study.featureDetails : (study.features || []).map(title => ({ title, description: '' }));
  const icons = ['target', 'bolt', 'book', 'users', 'shield', 'spark'];
  const current = details[selected] || details[0];
  const panelId = `salt-feature-panel-${instanceId}`;
  const move = (event, index) => {
    let next;
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % details.length;
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index - 1 + details.length) % details.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = details.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setSelected(next); refs.current[next]?.focus({ preventScroll: true });
  };
  return <div className="sls-feature-journal">
    <div className="sls-panel-heading"><span className="sls-kicker">THE QUEST LOG</span><h4>Small actions. Connected systems.</h4><p>Explore the features that bring the journey together.</p></div>
    <div className="sls-feature-workspace">
      <div className="sls-feature-index" role="tablist" aria-label="Salt and Light features" aria-orientation="vertical">
        {details.map((feature, index) => <button type="button" className="sls-feature-tab" key={feature.title} role="tab"
          id={`salt-feature-${instanceId}-${index}`} aria-selected={selected === index} aria-controls={panelId}
          tabIndex={selected === index ? 0 : -1} ref={node => { refs.current[index] = node; }}
          onClick={() => setSelected(index)} onKeyDown={event => move(event, index)}>
          <span className="sls-feature-tab__icon"><SaltIcon name={icons[index % icons.length]} /></span><span>{feature.title}</span><SaltIcon name="next" />
        </button>)}
      </div>
      {current && <div className="sls-feature-detail" id={panelId} role="tabpanel" tabIndex={0} aria-labelledby={`salt-feature-${instanceId}-${selected}`}>
        <div className="sls-feature-detail__decoration" aria-hidden="true"><SaltIcon name={icons[selected % icons.length]} /></div>
        <AnimatePresence mode="wait" initial={false}><FadePanel key={current.title} reducedMotion={reducedMotion}>
          <span className="sls-feature-detail__position">FEATURE {pad(selected + 1)} / {pad(details.length)}</span>
          <span className="sls-feature-detail__tag">{current.tag || 'APP FEATURE'}</span>
          <h5>{current.title}</h5><p>{current.description || study.features?.[selected]}</p>
        </FadePanel></AnimatePresence>
        <button className="sls-feature-next" type="button" onClick={() => setSelected((selected + 1) % details.length)}><span>Next feature</span><SaltIcon name="next" /></button>
      </div>}
    </div>
  </div>;
}

function BuildNotes({ project }) {
  const notes = project.caseStudy.technologyNotes || [];
  return <div className="sls-build">
    <div className="sls-panel-heading"><span className="sls-kicker">UNDER THE HOOD</span><h4>Tools with a role to play.</h4><p>The technologies supporting the interface, progression, and connected data.</p></div>
    <dl className="sls-build-grid">{notes.map(note => <div className="sls-build-note" key={note.technology}>
      <dt><span className="sls-tool-icon"><TechLogo technology={note.technology} /></span><span>{technologyCatalog[note.technology]?.label || note.technology}</span></dt><dd>{note.role}</dd>
    </div>)}</dl>
  </div>;
}

function ScreenJournal({ study, reducedMotion, instanceId }) {
  const screens = study.screens || [];
  const [selected, setSelected] = useState(0);
  const refs = useRef([]);
  const screen = screens[selected] || screens[0];
  const panelId = `salt-screen-panel-${instanceId}`;
  const move = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % screens.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + screens.length) % screens.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = screens.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setSelected(next); refs.current[next]?.focus({ preventScroll: true });
  };
  return <div className="sls-screens">
    <div className="sls-panel-heading"><span className="sls-kicker">A LOOK INSIDE</span><h4>The interface, in context.</h4><p>Build captures and read-only component previews. Open a screen to view it at full size.</p></div>
    {screen && <>
      <figure className="sls-screen-frame" id={panelId} role="tabpanel" tabIndex={0} aria-labelledby={`salt-screen-${instanceId}-${selected}`}>
        <div className="sls-screen-toolbar"><span><i /><i /><i /></span><span>{screen.label || `Salt & Light / Screen ${pad(selected + 1)}`}</span><SaltIcon name="screen" /></div>
        <AnimatePresence mode="wait" initial={false}><FadePanel key={screen.src} reducedMotion={reducedMotion}>
          <a className="sls-screen-image" href={asset(screen.src)} target="_blank" rel="noopener noreferrer" aria-label={`Open Salt and Light screen ${selected + 1} at full size`}>
            <img src={asset(screen.src)} alt={screen.alt} loading="lazy" /><span className="sls-screen-expand"><SaltIcon name="expand" /></span>
          </a>
          <figcaption>{screen.caption}</figcaption>
        </FadePanel></AnimatePresence>
      </figure>
      <div className="sls-screen-picker" role="tablist" aria-label="Salt and Light screenshots">
        {screens.map((item, index) => <button className="sls-screen-choice" type="button" key={item.src} role="tab"
          ref={node => { refs.current[index] = node; }} id={`salt-screen-${instanceId}-${index}`}
          aria-controls={panelId} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
          onClick={() => setSelected(index)} onKeyDown={event => move(event, index)}>
          <span>{pad(index + 1)}</span><span>{item.label || `Screen ${pad(index + 1)}`}</span><SaltIcon name="check" />
        </button>)}
      </div>
    </>}
  </div>;
}

export default function SaltLightProjectNotes({ project, headingId, reducedMotion }) {
  const study = project.caseStudy || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const refs = useRef([]);
  const instanceId = useId().replace(/:/g, '');
  const panelId = `salt-journal-panel-${instanceId}`;
  const active = sections[activeIndex];
  const move = (event, index) => {
    let next;
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % sections.length;
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index - 1 + sections.length) % sections.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = sections.length - 1;
    if (next === undefined) return;
    event.preventDefault(); setActiveIndex(next); refs.current[next]?.focus({ preventScroll: true });
  };

  return <div className="salt-study" data-motion={reducedMotion ? 'reduced' : 'full'}>
    <header className="sls-topbar">
      <div className="sls-brand"><span className="sls-brand-mark"><SaltIcon name="bolt" /></span><span>Salt &amp; Light</span></div>
      <span className="sls-topbar-label"><span aria-hidden="true" />Project journal</span>
      <div className="sls-topbar-links">
        {project.sourceUrl && <a className="sls-source-link" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><SaltIcon name="code" /><span>Source code</span></a>}
        {project.liveUrl && <a className="sls-visit" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><span>{project.liveLabel || 'Visit project'}</span><SaltIcon name="arrow" /></a>}
      </div>
    </header>

    <section className="sls-welcome" aria-labelledby={headingId}>
      <div className="sls-welcome__copy"><span className="sls-welcome-label"><SaltIcon name="spark" />Faith, goals &amp; a little adventure</span>
        <h3 id={headingId} tabIndex={-1}>Salt <span>&amp;</span> Light</h3><p>{project.description}</p>
        {project.details && <p className="sls-summary">{project.details}</p>}
      </div>
      <div className="sls-welcome-art" aria-hidden="true"><div className="sls-orbit"><i /><i /><i /></div><div className="sls-book"><SaltIcon name="book" /><span /><span /><span /></div><span className="sls-spark sls-spark--one"><SaltIcon name="spark" /></span><span className="sls-spark sls-spark--two"><SaltIcon name="bolt" /></span></div>
    </section>

    <dl className="sls-facts">{[
      ['My role', study.role, 'code'], ['Focus', study.focus, 'target'], ['Scope', study.scope, 'layers'],
    ].filter(([, value]) => value).map(([label, value, icon]) => <div key={label}><span className="sls-fact-icon"><SaltIcon name={icon} /></span><div><dt>{label}</dt><dd>{value}</dd></div></div>)}</dl>

    <section className="sls-journal" aria-label="Salt and Light case study">
      <aside className="sls-sidebar"><span className="sls-sidebar-label">EXPLORE THE PROJECT</span>
        <div className="sls-journal-nav" role="tablist" aria-label="Salt and Light case study sections" aria-orientation="vertical">
          {sections.map((section, index) => <button className="sls-journal-tab" type="button" key={section.key} role="tab"
            id={`salt-journal-${instanceId}-${index}`} aria-selected={activeIndex === index} aria-controls={panelId}
            tabIndex={activeIndex === index ? 0 : -1} ref={node => { refs.current[index] = node; }}
            onClick={() => setActiveIndex(index)} onKeyDown={event => move(event, index)}>
            <SaltIcon name={section.icon} /><span><strong>{section.label}</strong><small>{section.note}</small></span><SaltIcon name="next" />
          </button>)}
        </div>
        <div className="sls-journal-position"><span>Project notes <b>{pad(activeIndex + 1)} / {pad(sections.length)}</b></span><span className="sls-reading-track" aria-hidden="true"><motion.i initial={false} animate={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }} transition={{ duration: reducedMotion ? 0 : .5, ease: [.22, 1, .36, 1] }} /></span></div>
      </aside>
      <div className="sls-journal-body" role="tabpanel" id={panelId} tabIndex={0} aria-labelledby={`salt-journal-${instanceId}-${activeIndex}`}>
        <AnimatePresence mode="wait" initial={false}><FadePanel key={active.key} reducedMotion={reducedMotion}>
          {active.key === 'overview' && <Overview study={study} />}
          {active.key === 'features' && <FeatureJournal study={study} reducedMotion={reducedMotion} instanceId={instanceId} />}
          {active.key === 'build' && <BuildNotes project={project} />}
          {active.key === 'screens' && <ScreenJournal study={study} reducedMotion={reducedMotion} instanceId={instanceId} />}
        </FadePanel></AnimatePresence>
      </div>
    </section>
    <footer className="sls-footer"><span><SaltIcon name="spark" />Built around small, intentional steps.</span><span>Salt &amp; Light <i aria-hidden="true">/</i> {project.category}</span></footer>
  </div>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R1 | SaltLightProjectNotes.jsx
