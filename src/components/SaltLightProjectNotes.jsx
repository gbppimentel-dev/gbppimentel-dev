// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R9 | Personal motivation and an interactive engineering workbench
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import TechLogo, { technologyCatalog } from './TechLogo';
import SaltPlatformBadges from './SaltPlatformBadges';
import RubberSegment from './RubberSegment';
import Masonry from './Masonry';
import { saltBuildStories, saltFeatureChapters, saltShowcaseScreens } from '../data/saltLightShowcase';
import { asset } from '../utils/assets';
import '../styles/SaltLightProjectNotes.css';

const pad = value => String(value).padStart(2, '0');
const screensById = Object.fromEntries(saltShowcaseScreens.map(screen => [screen.id, screen]));
const sections = [
  { key: 'features', label: 'App Tour', icon: 'target', note: 'the everyday experience' },
  { key: 'screens', label: 'Screen Gallery', icon: 'screen', note: 'desktop & mobile' },
  { key: 'overview', label: 'The Idea', icon: 'book', note: 'purpose & approach' },
  { key: 'build', label: 'The Build', icon: 'layers', note: 'tools & decisions' },
];


// A deliberate tab selection resets the reading position after the outgoing
// panel exits. Initial renders, font loads, and viewport changes never scroll.
function useTabScrollReset(targetRef, reducedMotion) {
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return useCallback(() => {
    window.clearTimeout(timer.current);
    window.scrollTo({ top: window.scrollY, behavior: 'instant' });
    timer.current = window.setTimeout(() => {
      const target = targetRef.current;
      if (!target?.isConnected) return;
      const nav = document.querySelector('.navbar.site-navbar');
      const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 76;
      const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - navBottom - 18);
      window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
    }, reducedMotion ? 0 : 180);
  }, [targetRef, reducedMotion]);
}

function FeatureTitle({ title, emphasis }) {
  const at = emphasis ? title.indexOf(emphasis) : -1;
  return <h5>{at < 0 ? title : <>{title.slice(0, at)}<span className="sls-title-mark">{emphasis}</span>{title.slice(at + emphasis.length)}</>}</h5>;
}

function featureText(text) {
  let highlighted = 0;
  return text.split(/\b(Skill Points|Boss Fight|Google sign-in|XP|Faith|PNG|Daily|Weekly|Elite|six)\b/g).map((part, index) => index % 2 && highlighted++ < 2 ? <strong className="sls-inline-emphasis" key={index}>{part}</strong> : part);
}

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
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2m-8 3h2" /></>,
    trophy: <><path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v5m-5 3h10m-8-3h6" /></>,
    message: <path d="M21 12a8 8 0 0 1-8 8H6l-4 3 1-7a9 9 0 1 1 18-4ZM7 9h9m-9 4h6" />,
    mail: <><rect x="2" y="5" width="20" height="15" rx="2" /><path d="m2 6 10 8L22 6" /></>,
    sword: <><path d="m4 20 5-5m-5-4 9 9M9 15 19 3h3v3L10 18m-7 3 2-2" /></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z" /></>,
    bag: <><rect x="5" y="5" width="14" height="16" rx="3" /><path d="M9 5V3h6v2M5 13h14m-10 0v3h6v-3" /></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-3 14h2" /></>,
  };
  return <svg className={('sls-icon ' + className).trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.spark}</svg>;
}

function FadePanel({ children, reducedMotion, className = '', panelRef }) {
  const present = useIsPresent();
  return <motion.div ref={panelRef} className={('sls-panel ' + className).trim()} aria-hidden={present ? undefined : true} inert={!present}
    initial={reducedMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
    transition={{ duration: reducedMotion ? 0 : present ? .38 : .16, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function ScreenButton({ screen, onOpen, className = '', eager = false }) {
  if (!screen) return null;
  return <button className={('sls-capture ' + className).trim()} type="button" onClick={() => onOpen(screen)} aria-label={'View ' + screen.label + ' screenshot'}>
    <img src={asset(screen.src)} alt={screen.alt} width={screen.width} height={screen.height} loading={eager ? 'eager' : 'lazy'} />
    <span className="sls-capture-zoom" aria-hidden="true"><SaltIcon name="expand" /><span>Open View</span></span>
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

function Overview({ study, reducedMotion }) {
  const splitLead = text => {
    const stop = text.indexOf('. ');
    return stop < 0 ? [text, ''] : [text.slice(0, stop + 1), text.slice(stop + 2)];
  };
  const emphasize = (text, phrase) => {
    const at = text.indexOf(phrase);
    return at < 0 ? text : <>{text.slice(0, at)}<mark>{phrase}</mark>{text.slice(at + phrase.length)}</>;
  };
  const [challengeLead, challengeBody] = splitLead(study.challenge);
  const stories = [
    { label: 'The Approach', icon: 'users', tone: 'gold', text: study.approach, emphasis: 'Rewards, character growth, and visible feedback' },
    { label: 'The Experience', icon: 'spark', tone: 'lilac', text: study.outcome, emphasis: 'help and motivate' },
  ];
  const reveal = delay => ({
    initial: reducedMotion ? false : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: .12 },
    transition: { duration: reducedMotion ? 0 : .55, delay: reducedMotion ? 0 : delay, ease: [.22, 1, .36, 1] },
  });
  return <div className="sls-idea-r9">
    <header className="sls-idea-r9__heading"><span className="sls-kicker">THE IDEA</span><h4>Why I Built <span>Salt &amp; Light.</span></h4></header>
    <motion.article className="sls-idea-r9__origin" {...reveal(0)}>
      <header className="sls-idea-r9__label"><SaltIcon name="target" /><span>The Challenge</span></header>
      <div className="sls-idea-r9__starting-point"><h5>{challengeLead}</h5><p>{emphasize(challengeBody, 'quests and challenges')}</p></div>
    </motion.article>
    <div className="sls-idea-r9__continuation">
      {stories.map((story, index) => {
        const [lead, body] = splitLead(story.text);
        return <motion.article key={story.label} className="sls-idea-r9__chapter" data-tone={story.tone} {...reveal((index + 1) * .06)}>
          <header className="sls-idea-r9__chapter-heading"><span className="sls-idea-r9__icon"><SaltIcon name={story.icon} /></span><h5>{story.label}</h5></header>
          <p className="sls-idea-r9__lead">{lead}</p><p className="sls-idea-r9__body">{emphasize(body, story.emphasis)}</p>
        </motion.article>;
      })}
    </div>
  </div>;
}

function ConnectionsVisual() {
  return <div className="sls-connections" aria-label="Friend connection flow">
    <span className="sls-kicker">ROOM FOR COMMUNITY</span>
    <div className="sls-connection-flow">{[['users', 'Find', 'Look up a public ID'], ['spark', 'Request', 'Send an invitation'], ['check', 'Connect', 'Accept a friend request']].map(([icon, title, detail], index) => <div key={title}><span className="sls-connection-icon"><SaltIcon name={icon} /></span><b>{title}</b><small>{detail}</small>{index < 2 && <SaltIcon name="next" className="sls-connection-arrow" />}</div>)}</div>
    <div className="sls-connection-mail"><span><SaltIcon name="check" />Mail keeps incoming requests in one place.</span><span>Public IDs. Clear requests. A connected experience.</span></div>
  </div>;
}

const featureIcons = {
  overview: ['layers', 'target', 'calendar'],
  quests: ['target', 'calendar', 'next', 'bolt'],
  devotion: ['book', 'spark', 'calendar', 'download'],
  character: ['layers', 'bag', 'trophy'],
  milestones: ['trophy', 'shield', 'target'],
  connections: ['users', 'layers', 'mail'],
  feedback: ['message', 'layers', 'phone'],
  everywhere: ['screen', 'phone', 'download', 'shield'],
};

function FeatureBullets({ highlights, chapterId }) {
  return <ul className="sls-feature-bullets">{highlights.map((text, index) => <li key={text}><span className="sls-bullet-icon"><SaltIcon name={featureIcons[chapterId]?.[index] || 'check'} /></span><span>{chapterId === 'devotion' && index === 0 ? <><strong className="sls-bullet-title">Automatic Passage Preview</strong><span className="sls-bullet-note">In your preferred Bible translation.</span></> : featureText(text)}</span></li>)}</ul>;
}

function FeatureShot({ screen, onOpen, label, icon, className = '', caption = false }) {
  if (!screen) return null;
  return <figure className={('sls-feature-shot sls-feature-shot--' + screen.layout + ' ' + className).trim()}>
    <div className="sls-shot-frame"><div className="sls-shot-chrome"><span><SaltIcon name={icon || (screen.layout === 'phone' ? 'phone' : 'screen')} />{label || 'SALT & LIGHT'}</span><i aria-hidden="true">{pad(saltShowcaseScreens.indexOf(screen) + 1)} / {pad(saltShowcaseScreens.length)}</i></div><ScreenButton screen={screen} onOpen={onOpen} /></div>
    {caption && <figcaption>{screen.caption}</figcaption>}
  </figure>;
}

function DevotionSpread({ screens, onOpen }) {
  return <div className="sls-devotion-spread" aria-label="Reading and reflection screens">
    <div className="sls-devotion-screens">{screens.map((screen, index) => <FeatureShot key={screen.id} screen={screen} onOpen={onOpen} label={index ? 'Return & Reflect' : 'Read & Respond'} icon={index ? 'calendar' : 'book'} />)}</div>
    <div className="sls-scripture-flow" aria-label="Automatic Bible passage preview">{[['book', 'Choose a Passage'], ['spark', 'Automatic Preview'], ['message', 'Your Reflection']].map(([icon, text], index) => <span key={text}><SaltIcon name={icon} /><span>{text}</span>{index < 2 && <SaltIcon name="next" className="sls-flow-next" />}</span>)}</div>
  </div>;
}

function CharacterSpread({ chapter, screens, onOpen }) {
  const labels = ['Equipment', 'Job Paths', 'Skills'];
  const icons = ['bag', 'sword', 'spark'];
  return <div className="sls-character-spread">{screens.map((screen, index) => {
    const detail = chapter.views?.[screen.id] || chapter;
    return <article key={screen.id} className="sls-character-card"><header><span><SaltIcon name={icons[index]} />{labels[index]}</span><small>{pad(index + 1)}</small></header>
      <FeatureShot screen={screen} onOpen={onOpen} label={labels[index]} icon={icons[index]} />
      <div className="sls-character-card__copy"><FeatureTitle title={detail.title} emphasis={detail.emphasis} /><p>{featureText(detail.description)}</p><FeatureBullets highlights={detail.highlights} chapterId="character" /></div>
    </article>;
  })}</div>;
}

function ResponsiveSpread({ screens, onOpen }) {
  return <div className="sls-platform-showcase" aria-label="Desktop and mobile welcome screens">
    <div className="sls-platform-desktop"><FeatureShot screen={screens[0]} onOpen={onOpen} label="In Your Browser" icon="screen" /></div>
    <div className="sls-platform-mobile"><FeatureShot screen={screens[1]} onOpen={onOpen} label="On Your Phone" icon="phone" /></div>
  </div>;
}

// The text sets the height; the image keeps its real aspect and takes only the
// width it needs. ResizeObserver also covers font loading and laptop resizing.
function useEdgeImageFit(sceneRef, screen) {
  useLayoutEffect(() => {
    const node = sceneRef.current;
    const copy = node?.querySelector(':scope > .sls-feature-copy');
    if (!screen || !node || !copy) return undefined;
    let frame = 0;
    let cancelled = false;
    const ratio = screen.width / screen.height;
    const measure = () => {
      frame = 0;
      if (cancelled || !node.isConnected) return;
      const available = node.clientWidth;
      if (!available) return;
      const natural = copy.offsetHeight;
      const maximum = available * .48;
      const desired = Math.max(480, natural) * ratio;
      const width = Math.min(maximum, Math.max(available * .24, desired));
      const previous = parseFloat(node.style.getPropertyValue('--sls-edge-width'));
      if (!Number.isFinite(previous) || Math.abs(previous - width) > .5) {
        node.style.setProperty('--sls-edge-width', width.toFixed(2) + 'px');
        node.style.setProperty('--sls-edge-height', (width / ratio).toFixed(2) + 'px');
      }
      node.dataset.imageFit = desired > maximum + 1 ? 'bounded' : 'height';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(node); observer.observe(copy);
    measure();
    document.fonts?.ready.then(() => { if (!cancelled) schedule(); });
    return () => { cancelled = true; observer.disconnect(); cancelAnimationFrame(frame); };
  }, [sceneRef, screen]);
}

function EdgeCapture({ screen, onOpen }) {
  return <figure className="sls-edge-shot"><ScreenButton screen={screen} onOpen={onOpen} eager /></figure>;
}

function FeatureScene({ chapter, chapterScreens, selected, onOpen, reducedMotion }) {
  const sceneRef = useRef(null);
  const single = ['overview', 'quests', 'feedback'].includes(chapter.id);
  const milestone = chapter.id === 'milestones';
  const edge = single || milestone;
  const mainScreen = milestone ? chapterScreens[1] : single ? chapterScreens[0] : null;
  useEdgeImageFit(sceneRef, mainScreen);
  const classes = ['sls-feature-scene', edge && 'sls-feature-scene--edge', chapter.id === 'character' && 'sls-feature-scene--wide', chapter.id === 'devotion' && 'sls-feature-scene--multi', chapter.id === 'everywhere' && 'sls-feature-scene--platform'].filter(Boolean).join(' ');
  const closing = chapter.id !== 'everywhere' && chapter.closingLine && <p className="sls-feature-closing"><SaltIcon name="spark" /><span>{chapter.closingLine}</span></p>;
  return <FadePanel panelRef={sceneRef} reducedMotion={reducedMotion} className={classes}>
    <div className="sls-feature-copy"><div className="sls-feature-meta"><span className="sls-feature-symbol"><SaltIcon name={chapter.icon} /></span><span className="sls-feature-number">APP TOUR <i>/</i> {pad(selected + 1)} — {pad(saltFeatureChapters.length)}</span></div>
      <div className="sls-feature-detail"><FeatureTitle title={chapter.title} emphasis={chapter.emphasis} /><p>{featureText(chapter.description)}</p><FeatureBullets highlights={chapter.highlights} chapterId={chapter.id} />
        {milestone ? <div className="sls-milestone-tail">{closing}<FeatureShot screen={chapterScreens[0]} onOpen={onOpen} label="Progress & Bonuses" icon="shield" className="sls-milestone-card" /></div> : closing}
      </div>
    </div>
    <div className="sls-feature-visual">
      {edge ? <EdgeCapture screen={mainScreen} onOpen={onOpen} />
        : chapter.id === 'character' ? <CharacterSpread chapter={chapter} screens={chapterScreens} onOpen={onOpen} />
          : chapter.id === 'devotion' ? <DevotionSpread screens={chapterScreens} onOpen={onOpen} />
            : chapter.id === 'everywhere' ? <ResponsiveSpread screens={chapterScreens} onOpen={onOpen} /> : <ConnectionsVisual />}
    </div>
  </FadePanel>;
}

function FeatureJournal({ reducedMotion, instanceId, onOpen }) {
  const [selected, setSelected] = useState(0);
  const navRef = useRef(null);
  const resetView = useTabScrollReset(navRef, reducedMotion);
  const chapter = saltFeatureChapters[selected];
  const chapterScreens = chapter.screenIds.map(id => screensById[id]).filter(Boolean);
  const panelId = 'salt-feature-panel-' + instanceId;
  const select = (_, index) => { setSelected(index); resetView(); };
  return <div className="sls-feature-journal">
    <div className="sls-panel-heading"><span className="sls-kicker"><SaltIcon name="spark" />EXPLORE THE APP</span><h4>Small Actions. A Bigger Journey.</h4><p>Plan with purpose, reflect each day, and grow through the actions you complete.</p></div>
    <div ref={navRef} className="sls-feature-index-host"><RubberSegment className="sls-feature-index rubber-segment--features" aria-label="Salt and Light features"
      value={chapter.id} onChange={select} draggable={false}
      items={saltFeatureChapters.map((item, index) => ({ value: item.id, label: item.label, icon: <SaltIcon name={item.icon} />, id: 'salt-feature-' + instanceId + '-' + index, panelId }))} />
    </div>
    <div className="sls-feature-workspace" id={panelId} role="tabpanel" tabIndex={0} aria-labelledby={'salt-feature-' + instanceId + '-' + selected} data-tone={chapter.tone} data-chapter={chapter.id}>
      <AnimatePresence mode="wait" initial={false}><FeatureScene key={chapter.id} chapter={chapter} chapterScreens={chapterScreens} selected={selected} reducedMotion={reducedMotion} onOpen={onOpen} /></AnimatePresence>
    </div>
  </div>;
}

function BuildNotes({ reducedMotion = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelHeight, setPanelHeight] = useState(null);
  const panelBody = useRef(null);
  const tabButtons = useRef([]);
  const instanceId = useId().replace(/:/g, '');
  const panelId = 'sls-build-r9-panel-' + instanceId;
  const active = saltBuildStories[activeIndex];
  const labels = {
    'shared-progression': 'Rewards & Progression',
    'optimistic-goals': 'Goals & Feedback',
    'personal-records': 'Accounts & Connections',
    'scripture-preview': 'Scripture & Reflections',
    'image-exports': 'Image Exports',
    'app-delivery': 'Web & Installation',
  };

  // Measure the real reading pane rather than scaling its text. The stable
  // wrapper ignores the brief empty phase between outgoing and incoming views.
  useLayoutEffect(() => {
    const body = panelBody.current;
    if (!body) return undefined;
    let frame = 0;
    const measure = () => {
      const next = Math.ceil(body.getBoundingClientRect().height);
      if (next > 0) setPanelHeight(previous => previous === next ? previous : next);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(body);
    window.addEventListener('resize', schedule);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const handleTabKey = event => {
    let next = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (activeIndex + 1) % saltBuildStories.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (activeIndex - 1 + saltBuildStories.length) % saltBuildStories.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = saltBuildStories.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActiveIndex(next);
    tabButtons.current[next]?.focus({ preventScroll: true });
  };

  return <div className="sls-build-r9" data-active-story={active.id}>
    <header className="sls-build-r9__intro">
      <h4>Tools &amp; Decisions</h4>
      <p>How the tools support the actual experience: a goal completed, a passage read, a request answered, and progress carried forward.</p>
    </header>

    <div className="sls-build-r9__workbench">
      <div className="sls-build-r9__selector" role="tablist" aria-label="Explore the build" aria-orientation="vertical">
        {saltBuildStories.map((story, index) => <button
          type="button"
          role="tab"
          className="sls-build-r9__tab"
          key={story.id}
          ref={node => { tabButtons.current[index] = node; }}
          id={'sls-build-r9-tab-' + instanceId + '-' + story.id}
          aria-controls={panelId}
          aria-selected={index === activeIndex}
          tabIndex={index === activeIndex ? 0 : -1}
          data-tone={story.tone}
          onKeyDown={handleTabKey}
          onClick={() => setActiveIndex(index)}
        >
          {index === activeIndex && <motion.span
            className="sls-build-r9__selection"
            aria-hidden="true"
            layoutId={reducedMotion ? undefined : 'sls-build-r9-selection-' + instanceId}
            transition={{ type: 'spring', duration: reducedMotion ? 0 : .46, bounce: 0 }}
          />}
          <span className="sls-build-r9__tab-icon"><SaltIcon name={story.icon} /></span>
          <span className="sls-build-r9__tab-copy"><span className="sls-build-r9__tab-number" aria-hidden="true">{pad(index + 1)}</span><span>{labels[story.id] || story.title}</span></span>
          <span className="sls-build-r9__tab-current" aria-hidden="true"><SaltIcon name="next" /></span>
        </button>)}
      </div>

      <motion.div
        className="sls-build-r9__viewport"
        role="tabpanel"
        id={panelId}
        tabIndex={0}
        aria-labelledby={'sls-build-r9-tab-' + instanceId + '-' + active.id}
        initial={false}
        animate={{ height: reducedMotion || panelHeight === null ? 'auto' : panelHeight }}
        transition={{ height: { duration: reducedMotion ? 0 : .44, ease: [.22, 1, .36, 1] } }}
      >
        <div className="sls-build-r9__panel-body" ref={panelBody}>
          <AnimatePresence mode="wait" initial={false}>
            <FadePanel className="sls-build-r9__feature" key={active.id} reducedMotion={reducedMotion}>
              <article data-tone={active.tone}>
                <header className="sls-build-r9__feature-heading">
                  <span className="sls-build-r9__feature-icon"><SaltIcon name={active.icon} /></span>
                  <div><span className="sls-build-r9__feature-index">{pad(activeIndex + 1)} <span aria-hidden="true">/</span> {pad(saltBuildStories.length)}</span><h5>{active.title}</h5></div>
                </header>
                <p className="sls-build-r9__summary">{active.summary}</p>

                <ol className="sls-build-r9__steps" aria-label={active.title + ' flow'}>
                  {active.steps.map((step, stepIndex) => <li key={step}><span className="sls-build-r9__step-number" aria-hidden="true">{pad(stepIndex + 1)}</span><span>{step}</span></li>)}
                </ol>

                <dl className="sls-build-r9__tools">
                  {active.tools.map(tool => <div className="sls-build-r9__tool" key={tool.technology}>
                    <dt><span className="sls-build-r9__tool-icon"><TechLogo technology={tool.technology} /></span><span>{technologyCatalog[tool.technology]?.label || tool.technology}</span></dt>
                    <dd>{tool.role}</dd>
                  </div>)}
                </dl>

                {active.detail && <div className="sls-build-r9__detail"><SaltIcon name="check" /><p>{active.detail}</p></div>}
              </article>
            </FadePanel>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  </div>;
}

const galleryFilters = [
  { key: 'all', label: 'All Screens' }, { key: 'mobile', label: 'On Mobile' },
  { key: 'character', label: 'Character' }, { key: 'devotion', label: 'Devotion' }, { key: 'welcome', label: 'Getting Started' },
];
function ScreenGallery({ reducedMotion, onOpen }) {
  const [filter, setFilter] = useState('all');
  const screens = saltShowcaseScreens.filter(screen => filter === 'all' || (filter === 'mobile' ? screen.layout === 'phone' : screen.group === filter));
  const items = screens.map(screen => ({ id: screen.id, img: asset(screen.src), width: screen.width, height: screen.height, span: screen.layout === 'desktop' ? 2 : 1, title: screen.label, description: screen.caption, alt: screen.alt }));
  return <div className="sls-screens"><div className="sls-panel-heading sls-heading-with-mark"><div><h4>See the Journey Take Shape.</h4><p>Planning, reflection, and character growth. A closer look, from desktop to mobile.</p></div><span className="sls-gallery-total" aria-live="polite">{pad(screens.length)} <small>views</small></span></div>
    <div className="sls-gallery-filters" role="group" aria-label="Filter Salt and Light screenshots">{galleryFilters.map(item => <button key={item.key} type="button" aria-pressed={filter === item.key} onClick={() => setFilter(item.key)}><SaltIcon name={item.key === 'mobile' ? 'phone' : item.key === 'character' ? 'layers' : item.key === 'devotion' ? 'book' : item.key === 'welcome' ? 'spark' : 'screen'} />{item.label}</button>)}</div>
    <Masonry items={items} packing="justified" targetRowHeight={400} reducedMotion={reducedMotion} columnWidth={240} gap={20} radius={4} animateFrom={reducedMotion ? 'none' : 'bottom'} stagger={.045} duration={.65} bounce={.12} blurToFocus={!reducedMotion} hoverEffect={reducedMotion ? 'none' : 'lift'} captions="hover" lightbox={false} draggable onItemClick={(item, index, event) => { event.preventDefault(); onOpen(screensById[item.id]); }} className="sls-masonry" />
    <p className="sls-gallery-note"><SaltIcon name="screen" />Actual app captures. Visible progress belongs to an example account.</p>
  </div>;
}

export default function SaltLightProjectNotes({ project, headingId, reducedMotion }) {
  const study = project.caseStudy || {};
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerScreen, setViewerScreen] = useState(null);
  const closeViewer = useCallback(() => setViewerScreen(null), []);
  const navRef = useRef(null);
  const resetView = useTabScrollReset(navRef, reducedMotion);
  const instanceId = useId().replace(/:/g, '');
  const panelId = 'salt-journal-panel-' + instanceId;
  const active = sections[activeIndex];
  const selectSection = (_, index) => { setActiveIndex(index); resetView(); };
  return <div className="salt-study" data-motion={reducedMotion ? 'reduced' : 'full'}>
    <header className="sls-topbar"><div className="sls-topbar-identity"><div className="sls-brand"><span className="sls-brand-mark"><SaltIcon name="bolt" /></span><span>Salt &amp; Light</span></div><span className="sls-topbar-label"><i />DEVOTION JOURNAL &amp; HABIT MANAGEMENT</span></div><div className="sls-topbar-links">{project.sourceUrl && <a className="sls-source-link" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><SaltIcon name="code" /><span>Source Code</span></a>}{project.liveUrl && <a className="sls-visit" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><span>{project.liveLabel || 'Visit project'}</span><SaltIcon name="arrow" /></a>}</div></header>
    <section className="sls-welcome" aria-labelledby={headingId}><div className="sls-welcome__copy"><span className="sls-welcome-label"><SaltIcon name="spark" />FAITH, GOALS & A LITTLE ADVENTURE</span><h3 id={headingId} tabIndex={-1}>Salt <span>&amp;</span> Light</h3><p className="sls-tagline"><mark>{project.description}</mark></p><p className="sls-summary">{project.details}</p><SaltPlatformBadges /><span className="sls-install-note"><SaltIcon name="check" />Installable web app · Android &amp; iOS</span></div>
      <div className="sls-device-scene"><div className="sls-scene-orbit" aria-hidden="true" /><figure className="sls-desktop-preview"><div className="sls-browser-bar"><span><i /><i /><i /></span><small>salt &amp; light / character</small><SaltIcon name="screen" /></div><ScreenButton screen={screensById.equipment} onOpen={setViewerScreen} eager /></figure><figure className="sls-phone-preview"><div className="sls-phone-hardware" aria-hidden="true"><i /><span /></div><ScreenButton screen={screensById.goals} onOpen={setViewerScreen} eager /></figure>
        <div className="sls-device-stickers" aria-hidden="true"><span className="sls-device-sticker sls-device-sticker--plan"><SaltIcon name="target" />PLAN.</span><span className="sls-device-sticker sls-device-sticker--reflect"><SaltIcon name="book" />REFLECT.</span><span className="sls-device-sticker sls-device-sticker--grow"><SaltIcon name="bolt" />LEVEL UP.</span></div></div>
    </section>
    <dl className="sls-facts">{[['My Role', study.role, 'code'], ['Focus', study.focus, 'target'], ['Scope', study.scope, 'phone']].filter(([, value]) => value).map(([label, value, icon]) => <div key={label}><span className="sls-fact-icon"><SaltIcon name={icon} /></span><div><dt>{label}</dt><dd>{value}</dd></div></div>)}</dl>
    <section className="sls-journal" aria-label="Salt and Light case study"><div ref={navRef} className="sls-journal-nav-host"><RubberSegment className="sls-journal-nav rubber-segment--sections" aria-label="Salt and Light case study sections"
      value={active.key} onChange={selectSection} draggable={false}
      items={sections.map((section, index) => ({ value: section.key, label: <><strong>{section.label}</strong><small>{section.note}</small></>, icon: <SaltIcon name={section.icon} />, id: 'salt-journal-' + instanceId + '-' + index, panelId }))} /></div>
      <div className="sls-journal-body" role="tabpanel" id={panelId} tabIndex={0} aria-labelledby={'salt-journal-' + instanceId + '-' + activeIndex}><AnimatePresence mode="wait" initial={false}><FadePanel key={active.key} reducedMotion={reducedMotion}>{active.key === 'features' && <FeatureJournal reducedMotion={reducedMotion} instanceId={instanceId} onOpen={setViewerScreen} />}{active.key === 'screens' && <ScreenGallery reducedMotion={reducedMotion} onOpen={setViewerScreen} />}{active.key === 'overview' && <Overview study={study} reducedMotion={reducedMotion} />}{active.key === 'build' && <BuildNotes reducedMotion={reducedMotion} />}</FadePanel></AnimatePresence></div>
    </section>
    <footer className="sls-footer"><span><SaltIcon name="spark" />Built around small, intentional steps.</span><span>Salt &amp; Light <i aria-hidden="true">/</i> {project.category}</span></footer>
    <ScreenshotViewer screen={viewerScreen} onClose={closeViewer} onChange={setViewerScreen} />
  </div>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R9 | SaltLightProjectNotes.jsx
