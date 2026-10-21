// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R2 | A screenshot-led tour through Salt & Light
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import TechLogo, { technologyCatalog } from './TechLogo';
import SaltPlatformBadges from './SaltPlatformBadges';
import { saltFeatureChapters, saltShowcaseScreens } from '../data/saltLightShowcase';
import { asset } from '../utils/assets';
import '../styles/SaltLightProjectNotes.css';

const pad = value => String(value).padStart(2, '0');
const screensById = Object.fromEntries(saltShowcaseScreens.map(screen => [screen.id, screen]));
const sections = [
  { key: 'features', label: 'App tour', icon: 'target', note: 'The everyday experience' },
  { key: 'screens', label: 'Screen gallery', icon: 'screen', note: 'Desktop & mobile' },
  { key: 'overview', label: 'The idea', icon: 'book', note: 'Purpose & approach' },
  { key: 'build', label: 'The build', icon: 'layers', note: 'Tools & decisions' },
];

function SaltIcon({ name = 'spark', className = '' }) {
  const paths = {
    spark: <><path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z" /><path d="m19 3 .5 1.5L21 5l-1.5.5L19 7l-.5-1.5L17 5l1.5-.5L19 3Z" /></>,
    bolt: <path d="m13.5 2-9 12h6L9 22l10.5-13h-6l1-7Z" />,
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    next: <path d="M4 12h16m-6-6 6 6-6 6" />,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" />,
    book: <><path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15" /><path d="M5 8h3m8 0h3M5 12h3m8 0h3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    flag: <path d="M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" />,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    users: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a5 5 0 0 1 10 0v2m5-17a4 4 0 0 1 0 8m0 4a5 5 0 0 1 5 5" /></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-3 14h2" /></>,
  };
  return <svg className={('sls-icon ' + className).trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.spark}</svg>;
}

function FadePanel({ children, reducedMotion, className = '' }) {
  const present = useIsPresent();
  return <motion.div className={('sls-panel ' + className).trim()} aria-hidden={present ? undefined : true} inert={!present}
    initial={reducedMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
    transition={{ duration: reducedMotion ? 0 : present ? .38 : .16, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function ScreenButton({ screen, onOpen, className = '', eager = false }) {
  if (!screen) return null;
  return <button className={('sls-capture ' + className).trim()} type="button" onClick={() => onOpen(screen)} aria-label={'View ' + screen.label + ' screenshot'}>
    <img src={asset(screen.src)} alt={screen.alt} width={screen.width} height={screen.height} loading={eager ? 'eager' : 'lazy'} />
    <span className="sls-capture-zoom" aria-hidden="true"><SaltIcon name="expand" /></span>
  </button>;
}

function ScreenshotViewer({ screen, onClose, onChange }) {
  const dialog = useRef(null);
  const open = Boolean(screen);
  const index = screen ? saltShowcaseScreens.findIndex(item => item.id === screen.id) : -1;
  const titleId = useId();
  const captionId = useId();
  useEffect(() => {
    const node = dialog.current;
    if (!open || !node) return undefined;
    const focused = document.activeElement;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      if (node.open) node.close();
      document.body.style.overflow = overflow;
      if (focused instanceof HTMLElement && focused.isConnected) focused.focus({ preventScroll: true });
    };
  }, [open]);
  if (!open || typeof document === 'undefined') return null;
  const move = direction => onChange(saltShowcaseScreens[(index + direction + saltShowcaseScreens.length) % saltShowcaseScreens.length]);
  return createPortal(<dialog ref={dialog} className="sls-lightbox" aria-labelledby={titleId} aria-describedby={captionId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1); }
    }}>
    <div className="sls-lightbox__content">
      <header><div><span>SALT &amp; LIGHT / SCREEN GALLERY</span><h2 id={titleId}>{screen.label}</h2></div><button type="button" autoFocus onClick={onClose} aria-label="Close screenshot viewer"><SaltIcon name="close" /></button></header>
      <div className="sls-lightbox__image"><img src={asset(screen.src)} width={screen.width} height={screen.height} alt={screen.alt} /></div>
      <footer><p id={captionId}>{screen.caption}</p><div><button type="button" onClick={() => move(-1)} aria-label="Previous screenshot"><SaltIcon name="next" className="sls-reverse" /></button><span aria-live="polite">{pad(index + 1)} <i>/</i> {pad(saltShowcaseScreens.length)}</span><button type="button" onClick={() => move(1)} aria-label="Next screenshot"><SaltIcon name="next" /></button></div></footer>
    </div>
  </dialog>, document.body);
}

function Overview({ study }) {
  return <div className="sls-overview">
    <div className="sls-panel-heading"><span className="sls-kicker">THE IDEA</span><h4>Purpose behind the progress.</h4><p>Turn everyday intentions into a connected routine of action, reflection, and growth.</p></div>
    <div className="sls-overview-grid">
      <article className="sls-note"><span className="sls-note-icon"><SaltIcon name="target" /></span><h5>The challenge</h5><p>{study.challenge}</p></article>
      <article className="sls-note sls-note--gold"><span className="sls-note-icon"><SaltIcon name="layers" /></span><h5>The approach</h5><p>{study.approach}</p></article>
    </div>
    <article className="sls-outcome"><span className="sls-note-icon"><SaltIcon name="flag" /></span><div><span className="sls-kicker">THE OUTCOME</span><h5>A connected daily experience.</h5><p>{study.outcome}</p></div></article>
    <div className="sls-install"><span className="sls-install__icon"><SaltIcon name="phone" /></span><div><h5>A place on your home screen.</h5><p>Use it in a browser, or install the web app on Android and iOS.</p></div><SaltPlatformBadges /></div>
  </div>;
}

function ConnectionsVisual() {
  return <div className="sls-connections" aria-label="Friend connection flow">
    <span className="sls-kicker">ROOM FOR COMMUNITY</span>
    <div className="sls-connection-flow">{[['users', 'Find', 'Look up a public ID'], ['spark', 'Request', 'Send an invitation'], ['check', 'Connect', 'Accept a friend request']].map(([icon, title, detail], index) => <div key={title}><span className="sls-connection-icon"><SaltIcon name={icon} /></span><b>{title}</b><small>{detail}</small>{index < 2 && <SaltIcon name="next" className="sls-connection-arrow" />}</div>)}</div>
    <div className="sls-connection-mail"><span><SaltIcon name="check" />Mail keeps incoming requests in one place.</span><span>Public IDs. Clear requests. A connected experience.</span></div>
  </div>;
}

function FeatureJournal({ reducedMotion, instanceId, onOpen }) {
  const [selected, setSelected] = useState(0);
  const [screenIndex, setScreenIndex] = useState(0);
  const refs = useRef([]);
  const chapter = saltFeatureChapters[selected];
  const chapterScreens = chapter.screenIds.map(id => screensById[id]).filter(Boolean);
  const screen = chapterScreens[screenIndex] || chapterScreens[0];
  const panelId = 'salt-feature-panel-' + instanceId;
  const select = index => { setSelected(index); setScreenIndex(0); };
  const move = (event, index) => {
    let next;
    if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % saltFeatureChapters.length;
    if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index - 1 + saltFeatureChapters.length) % saltFeatureChapters.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = saltFeatureChapters.length - 1;
    if (next === undefined) return;
    event.preventDefault(); select(next); refs.current[next]?.focus({ preventScroll: true });
  };
  return <div className="sls-feature-journal">
    <div className="sls-panel-heading sls-heading-with-mark"><div><span className="sls-kicker">EXPLORE THE APP</span><h4>A little adventure in the everyday.</h4><p>Follow the features, from a first goal to a character that grows with you.</p></div><span className="sls-tour-mark" aria-hidden="true"><SaltIcon name="bolt" /><span>XP</span><i>+</i><SaltIcon name="spark" /><span>Faith</span></span></div>
    <div className="sls-feature-index" role="tablist" aria-label="Salt and Light features">
      {saltFeatureChapters.map((item, index) => <button type="button" className="sls-feature-tab" key={item.id} role="tab" id={'salt-feature-' + instanceId + '-' + index} aria-selected={selected === index} aria-controls={panelId} tabIndex={selected === index ? 0 : -1} ref={node => { refs.current[index] = node; }} onClick={() => select(index)} onKeyDown={event => move(event, index)}><SaltIcon name={item.icon} /><span>{item.label}</span></button>)}
    </div>
    <div className="sls-feature-workspace" id={panelId} role="tabpanel" tabIndex={0} aria-labelledby={'salt-feature-' + instanceId + '-' + selected} data-tone={chapter.tone}>
      <AnimatePresence mode="wait" initial={false}><FadePanel key={chapter.id} reducedMotion={reducedMotion} className="sls-feature-scene">
        <div className="sls-feature-copy"><span className="sls-feature-number">APP TOUR <i>/</i> {pad(selected + 1)} — {pad(saltFeatureChapters.length)}</span><span className="sls-feature-symbol"><SaltIcon name={chapter.icon} /></span><h5>{chapter.title}</h5><p>{chapter.description}</p><ul>{chapter.highlights.map(text => <li key={text}><SaltIcon name="check" /><span>{text}</span></li>)}</ul>{chapter.id === 'everywhere' && <SaltPlatformBadges />}
          <button type="button" className="sls-feature-next" onClick={() => { const next = (selected + 1) % saltFeatureChapters.length; select(next); refs.current[next]?.focus({ preventScroll: true }); }}><span>Next feature</span><SaltIcon name="next" /></button>
        </div>
        <div className={'sls-feature-visual' + (screen?.layout === 'phone' ? ' sls-feature-visual--phone' : '') + (chapter.id === 'connections' ? ' sls-feature-visual--connections' : '')}>
          {chapterScreens.length > 1 && <div className="sls-scene-picker" role="group" aria-label={chapter.label + ' views'}>{chapterScreens.map((item, index) => <button key={item.id} type="button" aria-pressed={screenIndex === index} onClick={() => setScreenIndex(index)}>{item.label}</button>)}</div>}
          {chapter.id === 'connections' ? <ConnectionsVisual /> : <AnimatePresence mode="wait" initial={false}><FadePanel key={screen?.id} reducedMotion={reducedMotion} className="sls-feature-capture-panel">
            <figure className={'sls-feature-shot sls-feature-shot--' + (screen?.layout || 'panel')}><ScreenButton screen={screen} onOpen={onOpen} /><figcaption>{screen?.caption}</figcaption></figure>
          </FadePanel></AnimatePresence>}
          <div className="sls-progress-route" aria-label="Daily actions connect to character progression"><span><SaltIcon name="target" />Daily actions</span><SaltIcon name="next" /><span><SaltIcon name="bolt" />XP + Faith</span><SaltIcon name="next" /><span><SaltIcon name="shield" />Your character</span></div>
        </div>
      </FadePanel></AnimatePresence>
    </div>
  </div>;
}

function BuildNotes({ project }) {
  const notes = project.caseStudy.technologyNotes || [];
  return <div className="sls-build"><div className="sls-panel-heading"><span className="sls-kicker">UNDER THE HOOD</span><h4>Tools with a role to play.</h4><p>The technologies behind the interface, progression, and connected data.</p></div><dl className="sls-build-grid">{notes.map(note => <div className="sls-build-note" key={note.technology}><dt><span className="sls-tool-icon"><TechLogo technology={note.technology} /></span><span>{technologyCatalog[note.technology]?.label || note.technology}</span></dt><dd>{note.role}</dd></div>)}</dl></div>;
}

const galleryFilters = [
  { key: 'all', label: 'All screens' }, { key: 'mobile', label: 'On mobile' },
  { key: 'character', label: 'Character' }, { key: 'devotion', label: 'Devotion' }, { key: 'welcome', label: 'Getting started' },
];
function ScreenGallery({ reducedMotion, onOpen }) {
  const [filter, setFilter] = useState('all');
  const screens = saltShowcaseScreens.filter(screen => filter === 'all' || (filter === 'mobile' ? screen.layout === 'phone' : screen.group === filter));
  return <div className="sls-screens"><div className="sls-panel-heading sls-heading-with-mark"><div><span className="sls-kicker">THE REAL SCREENS</span><h4>An app, from every angle.</h4><p>Desktop workspaces, pocket-sized routines, and the details in between.</p></div><span className="sls-gallery-total" aria-live="polite">{pad(screens.length)} <small>views</small></span></div>
    <div className="sls-gallery-filters" role="group" aria-label="Filter Salt and Light screenshots">{galleryFilters.map(item => <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)}>{item.label}</button>)}</div>
    <div className="sls-gallery-grid">{screens.map((screen, index) => <motion.figure key={screen.id} className={'sls-gallery-card sls-gallery-card--' + screen.layout} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .32, delay: reducedMotion ? 0 : Math.min(index * .025, .15) }}>
      <div className="sls-gallery-card__top"><span><SaltIcon name={screen.layout === 'phone' ? 'phone' : 'screen'} />{screen.layout === 'phone' ? 'Mobile view' : screen.layout === 'desktop' ? 'Desktop view' : 'App detail'}</span><i>{pad(saltShowcaseScreens.indexOf(screen) + 1)}</i></div>
      <ScreenButton screen={screen} onOpen={onOpen} /><figcaption><h5>{screen.label}</h5><p>{screen.caption}</p></figcaption>
    </motion.figure>)}</div><p className="sls-gallery-note">Actual app captures. Visible progress belongs to an example account.</p>
  </div>;
}

export default function SaltLightProjectNotes({ project, headingId, reducedMotion }) {
  const study = project.caseStudy || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerScreen, setViewerScreen] = useState(null);
  const closeViewer = useCallback(() => setViewerScreen(null), []);
  const refs = useRef([]);
  const instanceId = useId().replace(/:/g, '');
  const panelId = 'salt-journal-panel-' + instanceId;
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
    <header className="sls-topbar"><div className="sls-brand"><span className="sls-brand-mark"><SaltIcon name="bolt" /></span><span>Salt &amp; Light</span></div><span className="sls-topbar-label"><i />PROJECT JOURNAL</span><div className="sls-topbar-links">{project.sourceUrl && <a className="sls-source-link" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><SaltIcon name="code" /><span>Source code</span></a>}{project.liveUrl && <a className="sls-visit" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><span>{project.liveLabel || 'Visit project'}</span><SaltIcon name="arrow" /></a>}</div></header>
    <section className="sls-welcome" aria-labelledby={headingId}><div className="sls-welcome__copy"><span className="sls-welcome-label"><SaltIcon name="spark" />A LITTLE ADVENTURE, EVERY DAY</span><h3 id={headingId} tabIndex={-1}>Salt <span>&amp;</span> Light</h3><p>{project.description}</p><p className="sls-summary">Intentional habits. A daily reflection. Your own growing character — on the web and in your pocket.</p><SaltPlatformBadges /><span className="sls-install-note"><SaltIcon name="check" />Installable web app · Android &amp; iOS</span></div>
      <div className="sls-device-scene"><div className="sls-scene-orbit" aria-hidden="true" /><figure className="sls-desktop-preview"><div className="sls-browser-bar"><span><i /><i /><i /></span><small>salt &amp; light / character</small><SaltIcon name="screen" /></div><ScreenButton screen={screensById.equipment} onOpen={setViewerScreen} eager /></figure><figure className="sls-phone-preview"><div className="sls-phone-speaker" aria-hidden="true"><i /></div><ScreenButton screen={screensById.goals} onOpen={setViewerScreen} eager /></figure><span className="sls-device-label"><SaltIcon name="check" />One journey. Any screen.</span></div>
    </section>
    <dl className="sls-facts">{[['My role', study.role, 'code'], ['Focus', study.focus, 'target'], ['Experience', 'Desktop · Android · iOS', 'phone']].filter(([, value]) => value).map(([label, value, icon]) => <div key={label}><span className="sls-fact-icon"><SaltIcon name={icon} /></span><div><dt>{label}</dt><dd>{value}</dd></div></div>)}</dl>
    <section className="sls-journal" aria-label="Salt and Light case study"><div className="sls-journal-nav" role="tablist" aria-label="Salt and Light case study sections">{sections.map((section, index) => <button className="sls-journal-tab" type="button" key={section.key} role="tab" id={'salt-journal-' + instanceId + '-' + index} aria-selected={activeIndex === index} aria-controls={panelId} tabIndex={activeIndex === index ? 0 : -1} ref={node => { refs.current[index] = node; }} onClick={() => setActiveIndex(index)} onKeyDown={event => move(event, index)}><SaltIcon name={section.icon} /><span><strong>{section.label}</strong><small>{section.note}</small></span></button>)}</div>
      <div className="sls-journal-body" role="tabpanel" id={panelId} tabIndex={0} aria-labelledby={'salt-journal-' + instanceId + '-' + activeIndex}><AnimatePresence mode="wait" initial={false}><FadePanel key={active.key} reducedMotion={reducedMotion}>{active.key === 'features' && <FeatureJournal reducedMotion={reducedMotion} instanceId={instanceId} onOpen={setViewerScreen} />}{active.key === 'screens' && <ScreenGallery reducedMotion={reducedMotion} onOpen={setViewerScreen} />}{active.key === 'overview' && <Overview study={study} />}{active.key === 'build' && <BuildNotes project={project} />}</FadePanel></AnimatePresence></div>
    </section>
    <footer className="sls-footer"><span><SaltIcon name="spark" />Faith, goals &amp; the everyday in between.</span><span>Salt &amp; Light <i aria-hidden="true">/</i> {project.category}</span></footer>
    <ScreenshotViewer screen={viewerScreen} onClose={closeViewer} onChange={setViewerScreen} />
  </div>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R2 | SaltLightProjectNotes.jsx
