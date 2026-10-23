// CHANGE VERSION: PORTFOLIO-LIFECITY-R2 | A complete LifeCity operations-desk project portal
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import RubberSegment from './RubberSegment';
import Masonry from './Masonry';
import TechLogo, { technologyCatalog } from './TechLogo';
import { lifeCityScreens, lifeCityChapters, lifeCityBuildStories } from '../data/lifeCityShowcase';
import { asset } from '../utils/assets';
import '../styles/LifeCityProjectNotes.css';

const pad = value => String(value).padStart(2, '0');
const screenById = Object.fromEntries(lifeCityScreens.map(screen => [screen.id, screen]));
const sections = [
  { key: 'tour', label: 'App Tour', icon: 'dashboard' },
  { key: 'gallery', label: 'Screen Gallery', icon: 'screen' },
  { key: 'idea', label: 'The Idea', icon: 'target' },
  { key: 'build', label: 'The Build', icon: 'layers' },
];

function LifeCityIcon({ name = 'spark', className = '' }) {
  const paths = {
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    next: <path d="M4 12h16m-6-6 6 6-6 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    chevron: <path d="m6 9 6 6 6-6" />,
    users: <><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a5 5 0 0 1 10 0v2m5-17a4 4 0 0 1 0 8m0 4a5 5 0 0 1 5 5" /></>,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" />,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /></>,
    route: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="M8 5h8a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h8" /></>,
    scan: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 12h18M8 7v2m8-2v2m-8 6v2m8-2v2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m4 0h2m-8 3h2" /></>,
    csv: <><path d="M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8m-8 4h8m-4-6v9" /></>,
    records: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 7h8m-8 5h2m4 0h2m-8 5h2m4 0h2" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    message: <path d="M21 12a8 8 0 0 1-8 8H6l-4 3 1-7a9 9 0 1 1 18-4ZM7 9h9m-9 4h6" />,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-3 14h2" /></>,
    id: <><rect x="2" y="4" width="20" height="16" rx="3" /><circle cx="8" cy="10" r="2" /><path d="M4 17a4 4 0 0 1 8 0m3-9h4m-4 4h4m-4 4h3" /></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-3.7 1.5 1.5 0 0 1 .8-2.8H17a4 4 0 0 0 4-4C21 6 17 3 12 3Z" /><circle cx="7" cy="10" r=".7" /><circle cx="10" cy="7" r=".7" /><circle cx="15" cy="7" r=".7" /><circle cx="17" cy="11" r=".7" /></>,
    upload: <><path d="M12 16V3m-4 4 4-4 4 4M4 17v4h16v-4" /></>,
    download: <><path d="M12 3v13m-4-4 4 4 4-4M4 17v4h16v-4" /></>,
    activity: <path d="M2 12h5l3-8 4 16 3-8h5" />,
    camera: <><path d="M8 5 9 3h6l1 2h4a2 2 0 0 1 2 2v12H2V7a2 2 0 0 1 2-2h4Z" /><circle cx="12" cy="12" r="4" /></>,
    spark: <path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z" />,
  };
  return <svg className={('lcs-icon ' + className).trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.spark}</svg>;
}

function FadePanel({ children, reducedMotion, className = '' }) {
  const present = useIsPresent();
  return <motion.div className={('lcs-panel ' + className).trim()} aria-hidden={present ? undefined : true} inert={!present}
    initial={reducedMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
    transition={{ duration: reducedMotion ? 0 : present ? .38 : .15, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function useReadingReset(target, reducedMotion) {
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return useCallback(() => {
    window.clearTimeout(timer.current);
    window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    timer.current = window.setTimeout(() => {
      const node = target.current;
      if (!node?.isConnected) return;
      const nav = document.querySelector('.navbar.site-navbar');
      const clearance = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 76;
      window.scrollTo({ top: Math.max(0, window.scrollY + node.getBoundingClientRect().top - clearance - 18), behavior: reducedMotion ? 'instant' : 'smooth' });
    }, reducedMotion ? 0 : 210);
  }, [target, reducedMotion]);
}

function ScreenButton({ screen, onOpen, eager = false }) {
  if (!screen) return null;
  return <button type="button" className="lcs-capture" onClick={() => onOpen(screen)} aria-label={'Open ' + screen.label + ' screenshot'}>
    <img src={asset(screen.src)} width={screen.width} height={screen.height} alt={screen.alt} loading={eager ? 'eager' : 'lazy'} />
    <span className="lcs-capture__zoom" aria-hidden="true"><LifeCityIcon name="expand" /><span>Open View</span></span>
  </button>;
}

function ScreenFigure({ screen, onOpen, eager = false, caption = true, className = '' }) {
  if (!screen) return null;
  return <figure className={('lcs-screen ' + className).trim()} data-layout={screen.layout}>
    <div className="lcs-screen__frame"><div className="lcs-screen__label"><span><LifeCityIcon name={screen.layout === 'phone' ? 'phone' : 'screen'} />{screen.label}</span><span aria-hidden="true">{pad(lifeCityScreens.indexOf(screen) + 1)} / {pad(lifeCityScreens.length)}</span></div><ScreenButton screen={screen} onOpen={onOpen} eager={eager} /></div>
    {caption && <figcaption>{screen.caption}</figcaption>}
  </figure>;
}

function ScreenshotViewer({ screen, onClose, onChange }) {
  const dialog = useRef(null);
  const imageArea = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const titleId = useId();
  const captionId = useId();
  const open = Boolean(screen);
  const index = screen ? lifeCityScreens.findIndex(item => item.id === screen.id) : -1;
  useLayoutEffect(() => { setZoomed(false); imageArea.current?.scrollTo(0, 0); }, [screen?.id]);
  useEffect(() => {
    if (!open || !dialog.current) return undefined;
    const node = dialog.current;
    const focused = document.activeElement;
    const overflow = document.body.style.overflow;
    node.showModal(); document.body.style.overflow = 'hidden';
    return () => { if (node.open) node.close(); document.body.style.overflow = overflow; if (focused instanceof HTMLElement && focused.isConnected) focused.focus({ preventScroll: true }); };
  }, [open]);
  if (!open || typeof document === 'undefined') return null;
  const move = direction => onChange(lifeCityScreens[(index + direction + lifeCityScreens.length) % lifeCityScreens.length]);
  return createPortal(<dialog ref={dialog} className="lcs-lightbox" aria-labelledby={titleId} aria-describedby={captionId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); event.stopPropagation(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
    <div className="lcs-lightbox__content">
      <header><div><span>LIFECITY / SCREEN GALLERY</span><h2 id={titleId}>{screen.label}</h2></div><div className="lcs-lightbox__tools"><button type="button" className="lcs-lightbox__fit" aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}><LifeCityIcon name={zoomed ? 'screen' : 'expand'} /><span>{zoomed ? 'Fit View' : 'Actual Size'}</span></button><button type="button" autoFocus onClick={onClose} aria-label="Close LifeCity screenshot"><LifeCityIcon name="close" /></button></div></header>
      <div ref={imageArea} className="lcs-lightbox__image" data-zoomed={zoomed}><img src={asset(screen.src)} width={screen.width} height={screen.height} alt={screen.alt} /></div>
      <footer><p id={captionId}>{screen.caption}</p><div><button type="button" onClick={() => move(-1)} aria-label="Previous LifeCity screenshot"><LifeCityIcon name="next" className="lcs-reverse" /></button><span aria-live="polite">{pad(index + 1)} <i>/</i> {pad(lifeCityScreens.length)}</span><button type="button" onClick={() => move(1)} aria-label="Next LifeCity screenshot"><LifeCityIcon name="next" /></button></div></footer>
    </div>
  </dialog>, document.body);
}

function ChapterImages({ screens, onOpen }) {
  if (!screens.length) return null;
  const directory = screens.find(screen => screen.id === 'member-directory');
  if (directory && screens.length === 3) {
    return <div className="lcs-tour-images lcs-members-bento"><ScreenFigure screen={directory} onOpen={onOpen} eager className="lcs-members-bento__directory" />{screens.filter(screen => screen !== directory).map(screen => <ScreenFigure key={screen.id} screen={screen} onOpen={onOpen} />)}</div>;
  }
  const main = screens.find(screen => screen.layout !== 'phone') || screens[0];
  const companion = screens.find(screen => screen.id !== main.id && screen.layout === 'phone') || screens.find(screen => screen.id !== main.id);
  const first = companion ? [main, companion] : [main];
  const rest = screens.filter(screen => !first.includes(screen));
  const ratios = first.map(screen => screen.width / screen.height);
  const pairStyle = first.length === 2 ? { gridTemplateColumns: ratios.map(ratio => ratio + 'fr').join(' '), maxWidth: Math.round(ratios.reduce((sum, ratio) => sum + ratio, 0) * 600 + 22) + 'px' } : undefined;
  return <div className="lcs-tour-images"><div className={'lcs-screen-pair' + (first.length === 1 ? ' lcs-screen-pair--single' : '')} style={pairStyle}>{first.map(screen => <ScreenFigure key={screen.id} screen={screen} onOpen={onOpen} eager className="lcs-tour-main-shot" />)}</div>
    {rest.length > 0 && <div className="lcs-tour-supporting">{rest.map(screen => <ScreenFigure key={screen.id} screen={screen} onOpen={onOpen} className={screen.layout === 'desktop' && screen.width < screen.height ? 'lcs-screen--portrait-support' : ''} />)}</div>}
  </div>;
}

function TourChapter({ chapter, index, reducedMotion, onOpen }) {
  const screens = (chapter.screenIds || []).map(id => screenById[id]).filter(Boolean);
  const single = screens.length === 1;
  return <FadePanel reducedMotion={reducedMotion} className="lcs-tour-chapter"><article className={'lcs-tour-scene' + (single ? ' lcs-tour-scene--single' : '')} data-tone={chapter.tone} data-chapter={chapter.id}>
    <div className="lcs-tour-copy"><div className="lcs-tour-meta"><span className="lcs-tour-symbol"><LifeCityIcon name={chapter.icon} /></span><span>APP TOUR <i>/</i> {pad(index + 1)} — {pad(lifeCityChapters.length)}</span></div><h5>{chapter.title}</h5><p>{chapter.description}</p>
      {single && <ChapterPoints chapter={chapter} />}
    </div>
    {!single && <ChapterPoints chapter={chapter} />}
    <div className="lcs-tour-visual"><ChapterImages screens={screens} onOpen={onOpen} /></div>
  </article></FadePanel>;
}

function ChapterPoints({ chapter }) {
  return <div className="lcs-tour-details"><ul>{(chapter.highlights || []).map((text, index) => <li key={text}><span><LifeCityIcon name={['check', chapter.icon, 'layers', 'shield'][index % 4]} /></span><span>{text}</span></li>)}</ul>{chapter.note && <p className="lcs-tour-note"><LifeCityIcon name="spark" /><span>{chapter.note}</span></p>}</div>;
}

function AppTour({ reducedMotion, onOpen, instanceId }) {
  const [selected, setSelected] = useState(0);
  const intro = useRef(null);
  const reset = useReadingReset(intro, reducedMotion);
  const panelId = 'lifecity-tour-' + instanceId;
  const chapter = lifeCityChapters[selected];
  if (!chapter) return null;
  return <div className="lcs-tour">
    <header ref={intro} className="lcs-section-heading lcs-tour-intro"><span className="lcs-kicker">EXPLORE LIFECITY</span><h4>The Right Workspace for Each Role.</h4><p>From a member’s QR ID to the team’s attendance records. Follow the tasks that connect a gathering.</p></header>
    <RubberSegment className="lcs-tabs lcs-tabs--features" aria-label="LifeCity app features" items={lifeCityChapters.map(item => ({ value: item.id, id: 'lifecity-feature-' + instanceId + '-' + item.id, panelId, label: item.label, icon: <LifeCityIcon name={item.icon} /> }))} value={chapter.id} onChange={(_, index) => { setSelected(index); reset(); }} equalSlots={false} trackColor="#edf4f0" thumbColor="#fff" textColor="#647c70" activeTextColor="#14796e" radius={12} inset={5} speed={.9} />
    <div className="lcs-feature-workspace" role="tabpanel" tabIndex={0} id={panelId} aria-labelledby={'lifecity-feature-' + instanceId + '-' + chapter.id}>
      <AnimatePresence mode="wait" initial={false}><TourChapter key={chapter.id} chapter={chapter} index={selected} onOpen={onOpen} reducedMotion={reducedMotion} /></AnimatePresence>
    </div>
  </div>;
}

const galleryFilters = [
  { key: 'all', label: 'All Screens', icon: 'screen' }, { key: 'desktop', label: 'Desktop', icon: 'screen' }, { key: 'phone', label: 'Mobile', icon: 'phone' },
  { key: 'members', label: 'Members & QR', icon: 'id' }, { key: 'operations', label: 'Services & Records', icon: 'calendar' }, { key: 'settings', label: 'Settings & Feedback', icon: 'palette' },
];
function ScreenGallery({ reducedMotion, onOpen }) {
  const [filter, setFilter] = useState('all');
  const matches = screen => filter === 'all' || (filter === 'desktop' || filter === 'phone' ? screen.layout === filter : filter === 'operations' ? ['services', 'checkin', 'records'].includes(screen.group) : screen.group === filter);
  const screens = lifeCityScreens.filter(matches);
  const items = screens.map(screen => ({ id: screen.id, img: asset(screen.src), width: screen.width, height: screen.height, title: screen.label, description: screen.caption, alt: screen.alt }));
  return <div className="lcs-gallery"><header className="lcs-section-heading lcs-gallery-heading"><div><span className="lcs-kicker">SCREEN GALLERY</span><h4>The App, Screen by Screen.</h4><p>Desktop workspaces and compact mobile views, in their original proportions.</p></div><span className="lcs-gallery-total" aria-live="polite">{pad(screens.length)} <small>views</small></span></header>
    <div className="lcs-gallery-filters" role="group" aria-label="Filter LifeCity screenshots">{galleryFilters.filter(item => item.key === 'all' || lifeCityScreens.some(screen => item.key === 'desktop' || item.key === 'phone' ? screen.layout === item.key : item.key === 'operations' ? ['services', 'checkin', 'records'].includes(screen.group) : screen.group === item.key)).map(item => <button key={item.key} type="button" aria-pressed={item.key === filter} onClick={() => setFilter(item.key)}><LifeCityIcon name={item.icon} />{item.label}</button>)}</div>
    <Masonry className="lcs-masonry" items={items} packing="justified" targetRowHeight={390} gap={20} radius={4} reducedMotion={reducedMotion} animateFrom={reducedMotion ? 'none' : 'bottom'} stagger={.035} duration={.6} bounce={.1} blurToFocus={!reducedMotion} hoverEffect={reducedMotion ? 'none' : 'lift'} captions="hover" draggable lightbox={false} onItemClick={(item, _, event) => { event.preventDefault(); onOpen(screenById[item.id]); }} />
  </div>;
}

function ProjectIdea({ study, reducedMotion }) {
  const story = [
    { label: 'The Need', icon: 'users', text: study.challenge, tone: 'mint' },
    { label: 'The Approach', icon: 'route', text: study.approach, tone: 'lilac' },
    { label: 'The Outcome', icon: 'check', text: study.outcome, tone: 'gold' },
  ];
  return <div className="lcs-idea"><header className="lcs-section-heading"><span className="lcs-kicker">THE IDEA</span><h4>Make Space for the Gathering.</h4><p>A clear workflow for the team, and a simpler way for members to take part.</p></header><div className="lcs-idea-pages">{story.map((part, index) => <motion.article key={part.label} data-tone={part.tone} initial={reducedMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reducedMotion ? 0 : .5, ease: [.22, 1, .36, 1] }}>
    <header><span className="lcs-idea-number" aria-hidden="true">{pad(index + 1)}</span><LifeCityIcon name={part.icon} /><h5>{part.label}</h5></header><p>{part.text}</p>
  </motion.article>)}</div></div>;
}

function BuildBody({ story, reducedMotion, id, labelledBy }) {
  const present = useIsPresent();
  return <motion.div className="lcs-build-body" id={id} role="region" aria-labelledby={labelledBy} aria-hidden={present ? undefined : true} inert={!present}
    initial={reducedMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .4, ease: [.22, 1, .36, 1] }}>
    <div className="lcs-build-body__inner"><div className="lcs-build-explanation"><p>{story.summary}</p><ol>{story.steps.map((step, index) => <li key={step}><span aria-hidden="true">{pad(index + 1)}</span>{step}</li>)}</ol></div><dl className="lcs-build-tools">{story.tools.map(tool => <div key={tool.technology}><dt><TechLogo technology={tool.technology} /><span>{technologyCatalog[tool.technology]?.label || tool.technology}</span></dt><dd>{tool.role}</dd></div>)}</dl>{story.detail && <p className="lcs-build-detail"><LifeCityIcon name="check" /><span>{story.detail}</span></p>}</div>
  </motion.div>;
}
function BuildNotes({ reducedMotion, instanceId }) {
  const [open, setOpen] = useState(() => new Set(lifeCityBuildStories[0] ? [lifeCityBuildStories[0].id] : []));
  return <div className="lcs-build"><header className="lcs-section-heading"><span className="lcs-kicker">THE BUILD</span><h4>Practical Tools. Connected Decisions.</h4><p>The details behind registration, scanning, saved records, and the interface around them.</p></header><div className="lcs-build-list">{lifeCityBuildStories.map((story, index) => {
    const isOpen = open.has(story.id); const buttonId = 'lifecity-build-button-' + instanceId + '-' + story.id; const panelId = 'lifecity-build-panel-' + instanceId + '-' + story.id;
    return <article className="lcs-build-item" key={story.id} data-tone={story.tone} data-open={isOpen}><h5><button type="button" id={buttonId} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(previous => { const next = new Set(previous); next.has(story.id) ? next.delete(story.id) : next.add(story.id); return next; })}><span className="lcs-build-icon"><LifeCityIcon name={story.icon} /></span><span className="lcs-build-title"><small>{pad(index + 1)} / IMPLEMENTATION</small><span>{story.title}</span></span><span className="lcs-build-chevron"><LifeCityIcon name="chevron" /></span></button></h5><AnimatePresence initial={false}>{isOpen && <BuildBody key={story.id} story={story} reducedMotion={reducedMotion} id={panelId} labelledBy={buttonId} />}</AnimatePresence></article>;
  })}</div></div>;
}

export default function LifeCityProjectNotes({ project, headingId, reducedMotion }) {
  const study = project.caseStudy || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerScreen, setViewerScreen] = useState(null);
  const closeViewer = useCallback(() => setViewerScreen(null), []);
  const readingRef = useRef(null);
  const reset = useReadingReset(readingRef, reducedMotion);
  const instanceId = useId().replace(/:/g, '');
  const panelId = 'lifecity-journal-panel-' + instanceId;
  const active = sections[activeIndex];
  const dashboard = screenById['dashboard-desktop'] || lifeCityScreens.find(screen => screen.layout === 'desktop');
  return <div className="lifecity-study" data-motion={reducedMotion ? 'reduced' : 'full'}>
    <header className="lcs-topbar"><div className="lcs-brand"><span className="lcs-brand-mark"><img src={asset('images/projects/lifecity-r2/app-icon.png')} width="35" height="35" alt="" /></span><span>LifeCity Attendance</span></div><span className="lcs-status"><i aria-hidden="true" />Live Web App</span></header>
    <section className="lcs-welcome" aria-labelledby={headingId}><div className="lcs-welcome__copy"><span className="lcs-kicker">COMMUNITY / ATTENDANCE</span><h3 id={headingId} tabIndex={-1}>LifeCity<br /><span>Attendance.</span></h3><p className="lcs-welcome__lead">{project.description}</p><p className="lcs-welcome__summary">{project.details}</p><div className="lcs-actions"><a className="lcs-button lcs-button--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><LifeCityIcon name="screen" /><span>Visit LifeCity</span><LifeCityIcon name="arrow" /></a><a className="lcs-button" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><LifeCityIcon name="code" /><span>Source Code</span><LifeCityIcon name="arrow" /></a></div></div><div className="lcs-welcome__preview"><ScreenFigure screen={dashboard} onOpen={setViewerScreen} eager caption={false} /><div className="lcs-welcome__sequence" aria-label="The attendance workflow"><span><LifeCityIcon name="users" />Register</span><LifeCityIcon name="next" /><span><LifeCityIcon name="scan" />Check In</span><LifeCityIcon name="next" /><span><LifeCityIcon name="records" />Review</span></div></div></section>
    <dl className="lcs-facts">{[['My Role', study.role, 'code'], ['Focus', study.focus, 'users'], ['Scope', study.scope, 'layers']].map(([label, value, icon]) => <div key={label}><span className="lcs-fact-icon"><LifeCityIcon name={icon} /></span><div><dt>{label}</dt><dd>{value}</dd></div></div>)}</dl>
    <section className="lcs-journal"><RubberSegment className="lcs-tabs lcs-tabs--main" aria-label="LifeCity case study sections" items={sections.map(item => ({ value: item.key, id: 'lifecity-section-' + instanceId + '-' + item.key, panelId, label: item.label, icon: <LifeCityIcon name={item.icon} /> }))} value={active.key} onChange={(_, index) => { setActiveIndex(index); reset(); }} equalSlots trackColor="#e9f1ed" thumbColor="#fff" textColor="#637c70" activeTextColor="#137a6d" radius={14} inset={6} speed={.9} />
      <div ref={readingRef} className="lcs-journal-content" role="tabpanel" id={panelId} tabIndex={0} aria-labelledby={'lifecity-section-' + instanceId + '-' + active.key}><AnimatePresence mode="wait" initial={false}><FadePanel key={active.key} reducedMotion={reducedMotion}>{active.key === 'tour' && <AppTour reducedMotion={reducedMotion} instanceId={instanceId} onOpen={setViewerScreen} />}{active.key === 'gallery' && <ScreenGallery reducedMotion={reducedMotion} onOpen={setViewerScreen} />}{active.key === 'idea' && <ProjectIdea study={study} reducedMotion={reducedMotion} />}{active.key === 'build' && <BuildNotes reducedMotion={reducedMotion} instanceId={instanceId} />}</FadePanel></AnimatePresence></div>
    </section><footer className="lcs-footer"><span><LifeCityIcon name="users" />LifeCity Attendance</span><span>App captures and source-rendered examples with demo records.</span></footer>
    <ScreenshotViewer screen={viewerScreen} onClose={closeViewer} onChange={setViewerScreen} />
  </div>;
}
// END OF FILE: PORTFOLIO-LIFECITY-R2 | LifeCityProjectNotes.jsx
