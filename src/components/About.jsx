import { Component, Suspense, lazy, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { asset } from '../utils/assets';
import { aboutProfile } from '../data/aboutProfile';
import useAnimationActivity, { AnimationActivityContext } from '../hooks/useAnimationActivity';
import { loadDecodedIdentityImage } from '../utils/identityReadiness';
import TextLoop from './TextLoop';
import BranchedMenu from './BranchedMenu';
import '../styles/about-responsive.css';
import '../styles/about-technical.css';
import '../styles/id-workbench.css';

const loadLanyard = () => import('./Lanyard');
const Crosshair = lazy(() => import('./Crosshair'));
const ID_CARD_SIZE = 0.67;
const ID_STRAP_WIDTH = 0.56;
const ID_FRONT = asset('images/profile-id-front-r9.svg?v=IDENTITY-PASS-R9');
const ID_BACK = asset('images/profile-id-back-r9.svg?v=IDENTITY-PASS-R9');
const LIGHT_ID_QUERY = '(max-width: 999px), (pointer: coarse), (prefers-reduced-motion: reduce)';

function useAboutMedia(queryText) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(queryText).matches);
  useEffect(() => {
    const query = window.matchMedia(queryText);
    const update = () => setMatches(query.matches);
    query.addEventListener('change', update);
    update();
    return () => query.removeEventListener('change', update);
  }, [queryText]);
  return matches;
}

function AboutCursor({ containerRef }) {
  const desktopPointer = useAboutMedia('(min-width: 1000px) and (hover: hover) and (pointer: fine)');
  const { active } = useAnimationActivity(containerRef, { enabled: desktopPointer, threshold: .05 });
  // Reuse NetSuite's demand-rendered effect only while this scene is usable.
  // The canvas never receives pointer events, so card dragging stays native.
  return active ? <Suspense fallback={null}><Crosshair containerRef={containerRef} viewport adaptiveColor
    thickness={1} opacity={0.65} gap={14} fade={0.45} smoothing={0.3}
    targetEffect="lock" showCoordinates clickPulse hideCursor={false}
    className="about-crosshair" style={{ zIndex: 3, width: '100%' }} /></Suspense> : null;
}

function TouchIdentityCard({ artwork, recovery, onRetry }) {
  const [back, setBack] = useState(false);
  const [broken, setBroken] = useState({});
  const source = artwork?.[back ? 'back' : 'front'];
  const recoveryMessage = recovery || (Object.keys(broken).length ? 'Profile images unavailable.' : null);
  return <div className={`about-touch-id${recoveryMessage ? ' about-touch-id--recovery' : ''}`}>
    <span className="about-touch-id__strap" aria-hidden="true"><span className="about-touch-id__weave">gbppimentel-dev</span></span>
    <button type="button" className="about-touch-id__card" aria-label={back ? 'Show the front of my identity card' : 'Show the back of my identity card'} aria-pressed={back} onClick={() => setBack(value => !value)}>
      {source && !broken[source] ? <img key={source} className="about-touch-id__image" src={source} alt={back ? 'The back of Glenn Bernard Pimentel’s identity card' : 'Glenn Bernard Pimentel’s professional identity card'} width="1024" height="1440" decoding="async" onError={() => setBroken(value => ({ ...value, [source]: true }))} />
        : <span className="about-touch-id__text"><small>PERSON / PROFILE</small><strong>Glenn Bernard<br />Pimentel<span>.</span></strong><span>{back ? 'React · application logic\nUI / UX · visual systems\nNetSuite · workflows' : 'Software engineer\nUI / UX designer\nNetSuite support'}</span></span>}
    </button>
    <div className="about-touch-id__hint">Tap the card to flip it <span aria-hidden="true">↔</span>{recoveryMessage && <><small>{recoveryMessage}</small><button type="button" className="identity-retry" onClick={onRetry}>Retry {recoveryMessage === 'Showing card view.' ? 'interactive ID' : 'ID images'} <span aria-hidden="true">↻</span></button></>}</div>
  </div>;
}

class IdentityBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { this.props.onError(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

function IdentityLoading({ active }) {
  return <div className="identity-loading" role="status" data-active={active}>
    <div className="identity-loading__badge" aria-hidden="true"><i /><span><b /><b /><b /></span></div>
    <strong>Preparing identity card</strong><span>Artwork, strap & hardware</span>
  </div>;
}

function IdentityPresentation({ lightIdentity, enabled, active, strapColor, attempt, onRetry }) {
  const [mode, setMode] = useState(lightIdentity ? 'flat' : 'three');
  const [Renderer, setRenderer] = useState(null);
  const [sceneStarted, setSceneStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [artwork, setArtwork] = useState(null);
  const [imageIssue, setImageIssue] = useState(false);
  const [rendererIssue, setRendererIssue] = useState(false);
  const finish = useCallback(() => setReady(true), []);
  const fail = useCallback(() => { setReady(false); setRendererIssue(true); setMode('flat'); setRenderer(null); }, []);
  useEffect(() => { if (Renderer && active) setSceneStarted(true); }, [Renderer, active]);
  useEffect(() => {
    if (!enabled || mode !== 'three') return undefined;
    let cancelled = false, delay;
    const start = () => {
      // Opt-in development states make slow startup and retry reviewable.
      if (import.meta.env.DEV && attempt === 0 && new URLSearchParams(location.search).get('id-check') === 'error') { fail(); return; }
      loadLanyard().then(module => { if (!cancelled) setRenderer(() => module.default); }).catch(() => { if (!cancelled) fail(); });
    };
    if (import.meta.env.DEV && attempt === 0 && new URLSearchParams(location.search).get('id-check') === 'slow') delay = setTimeout(start, 2400);
    else start();
    return () => { cancelled = true; clearTimeout(delay); };
  }, [enabled, mode, attempt, fail]);
  useEffect(() => {
    if (!enabled || !active || ready || mode !== 'three') return undefined;
    const timeout = setTimeout(fail, 10000);
    return () => clearTimeout(timeout);
  }, [enabled, active, ready, mode, fail]);
  useEffect(() => {
    if (!enabled || mode !== 'flat') return undefined;
    const abort = new AbortController();
    Promise.allSettled([ID_FRONT, ID_BACK].map(url => loadDecodedIdentityImage(url, { signal: abort.signal, timeoutMs: 6000 }))).then(results => {
      if (abort.signal.aborted) return;
      setArtwork({ front: results[0].status === 'fulfilled' ? ID_FRONT : null, back: results[1].status === 'fulfilled' ? ID_BACK : null });
      setImageIssue(results.some(result => result.status === 'rejected'));
      setReady(true);
    });
    return () => abort.abort();
  }, [enabled, mode]);
  return <div className="about-id-presentation" data-id-ready={ready} data-id-mode={mode} aria-busy={!ready}>
    <div className="identity-render" aria-hidden={!ready} inert={!ready}>
      {mode === 'flat' && ready && <TouchIdentityCard artwork={artwork} onRetry={onRetry} recovery={imageIssue ? 'Profile images unavailable.' : rendererIssue ? 'Showing card view.' : null} />}
      {mode === 'three' && Renderer && (active || sceneStarted) && <IdentityBoundary onError={fail}><Renderer
        frontImage={ID_FRONT} backImage={ID_BACK} active={active} onReady={finish} onError={fail}
        orientation="portrait" finish="matte" cardColor="#111a26" cornerRadius={0.22}
        size={ID_CARD_SIZE} strapLength={0.54} strapColor={strapColor} adaptiveColor strapWidth={ID_STRAP_WIDTH}
        metal="silver" gravity={0.82} damping={0.46} elasticity={0.42} breeze={0.06} intro={false} interactive extendTo=".about-studio-layout"
      /></IdentityBoundary>}
    </div>
    {!ready && <IdentityLoading active={active} />}
  </div>;
}

function CvLink() {
  return <a className="about-technical__cv" href={asset('Pimentel-Resume-IT.pdf')} target="_blank" rel="noopener noreferrer" aria-label="View résumé (PDF, opens in a new tab)">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9l-6-6Z" /><path d="M13 3v6h6M8.5 13h7M8.5 17h5" /></svg>
    <span>Résumé ↗</span>
  </a>;
}

function SkillExplorer() {
  const [selected, setSelected] = useState(aboutProfile.skills[0].children[0]);
  const compact = useAboutMedia('(max-width: 999px), (pointer: coarse)');
  const short = useAboutMedia('(min-width: 1000px) and (max-height: 660px)');
  return <section className="about-technical__panel about-technical__skills" aria-labelledby="about-capabilities-title" data-crosshair-target>
    <div className="about-technical__heading"><h3 id="about-capabilities-title">Capabilities</h3><span aria-hidden="true">{'{ }'}</span></div>
    <BranchedMenu items={aboutProfile.skills} defaultOpen={0} defaultActive="responsive" singleOpen reserveOpenSpace
      width={340} rowHeight={compact ? 44 : short ? 24 : 28} indent={27} fontSize={compact ? 12 : 11} radius={6}
      color="var(--text, #f2efe8)" accentColor="var(--brand-accent, var(--amber))" lineColor="var(--line, #465160)" drawDuration={350} foldDuration={300}
      label="Explore my skills" onSelect={(_, item) => setSelected(item)} />
    <div className="about-technical__skill-detail" aria-live="polite" aria-atomic="true">
      <strong>{selected.label}</strong><p>{selected.detail}</p>
    </div>
  </section>;
}

function ProjectEvidence() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);
  const prefix = useId().replace(/:/g, '');
  const project = aboutProfile.evidence[selected];
  const navigateTabs = event => {
    let next;
    if (event.key === 'ArrowRight') next = (selected + 1) % aboutProfile.evidence.length;
    else if (event.key === 'ArrowLeft') next = (selected - 1 + aboutProfile.evidence.length) % aboutProfile.evidence.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = aboutProfile.evidence.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  };
  return <section className="about-technical__panel about-technical__evidence" aria-labelledby="about-evidence-title" data-crosshair-target>
    <div className="about-technical__heading"><h3 id="about-evidence-title">Built in practice</h3><span aria-hidden="true">↗</span></div>
    <div className="about-technical__tabs" role="tablist" aria-label="Project engineering examples" onKeyDown={navigateTabs}>
      {aboutProfile.evidence.map((item, index) => <button ref={node => { tabs.current[index] = node; }} type="button" role="tab" key={item.id}
        id={`${prefix}-tab-${item.id}`} aria-controls={`${prefix}-panel`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
        onClick={() => setSelected(index)}>{item.label}</button>)}
    </div>
    <div className="about-technical__proof" role="tabpanel" id={`${prefix}-panel`} aria-labelledby={`${prefix}-tab-${project.id}`} tabIndex={0}>
      <h4>{project.title}</h4>
      <ul>{project.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
    </div>
    <a className="about-technical__projects" href="#projects">Explore the projects <span aria-hidden="true">↗</span></a>
  </section>;
}

function ProfileDetails() {
  return <div className="about-technical" aria-labelledby="about-profile-name">
    <section className="about-technical__panel" data-crosshair-target>
      <div className="about-technical__bar"><span className="about-technical__dots" aria-hidden="true"><i /><i /><i /></span><span>profile.tsx</span><CvLink /></div>
      <div className="about-technical__intro">
        <p className="about-technical__eyebrow">{aboutProfile.intro}</p>
        <h2 id="about-profile-name">{aboutProfile.name}<span className="about-technical__period">.</span></h2>
        <p className="about-technical__bio">{aboutProfile.bio}</p>
        <ul className="about-technical__roles" aria-label="Areas I work in">{aboutProfile.roles.map(role => <li key={role}>{role}</li>)}</ul>
      </div>
    </section>
    <div className="about-technical__lower"><SkillExplorer /><ProjectEvidence /></div>
  </div>;
}

function LanyardId({ strapColor, active }) {
  const stageRef = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const lightIdentity = useAboutMedia(LIGHT_ID_QUERY);
  const activity = useAnimationActivity(stageRef, { enabled: active, threshold: .05 });
  useEffect(() => {
    // The loader/menu can cover this scene while it intersects the viewport.
    // Defer the initial Three import until the desktop card can be used.
    if (active && nearViewport && activity.documentVisible) setHasActivated(true);
  }, [active, nearViewport, activity.documentVisible]);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    if (!('IntersectionObserver' in window)) { setNearViewport(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: '0px', threshold: 0.05 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  return <div className="about-centerpiece" style={{ '--about-strap-color': strapColor }}>
    <div className="identity-workbench" aria-hidden="true">
      <div className="identity-workbench__bar"><span>PERSON / PROFILE</span><span>PORTFOLIO</span></div>
      <div className="identity-workbench__depth" />
      <div className="identity-workbench__halftone" />
      <svg className="identity-workbench__contours" viewBox="0 0 420 680" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g transform="rotate(-16 210 355)">
          {Array.from({ length: 14 }, (_, index) => <ellipse key={index} cx="210" cy="355" rx={110 + index * 14} ry={166 + index * 19} />)}
        </g>
      </svg>
      <div className="identity-workbench__footer"><span>DEVELOPMENT</span><span>DESIGN</span><span>ERP SUPPORT</span></div>
    </div>
    <div className="about-id-stage" ref={stageRef} role="group" aria-label="Interactive identity card">
      <IdentityPresentation key={`${lightIdentity}-${attempt}`} lightIdentity={lightIdentity} enabled={hasActivated} active={activity.active} strapColor={strapColor} attempt={attempt} onRetry={() => setAttempt(value => value + 1)} />
    </div>
  </div>;
}

export default function About({ strapColor = '#d8b97c' }) {
  const sectionRef = useRef(null);
  const parentActive = useContext(AnimationActivityContext);
  const [covered, setCovered] = useState(false);
  const active = parentActive && !covered;
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1000px) and (pointer: fine)');
    let frame = 0;
    const update = () => {
      frame = 0;
      // The sticky About scene can still intersect while Contact paints over it.
      const contactTop = document.querySelector('.contact-scroll-stage')?.getBoundingClientRect().top ?? Infinity;
      // Fractional scroll rounding can settle the 88px cap just above 88.
      setCovered(desktop.matches && contactTop <= 89);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    desktop.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      desktop.removeEventListener('change', schedule);
    };
  }, []);

  return <AnimationActivityContext.Provider value={active}>
  <div className="about-scroll-stage">
    <section ref={sectionRef} className="works about-profile about-profile--technical" id="about" aria-label="About Glenn Bernard Pimentel" tabIndex={-1} data-covered={covered}>
    <AboutCursor containerRef={sectionRef} />
    <div className="section-art" aria-hidden="true" style={{ backgroundImage: `url(${asset('images/about-me.png')})` }} />
    <div className="about-design-field" aria-hidden="true"><svg viewBox="0 0 1440 840" preserveAspectRatio="none" focusable="false"><path d="M0 172H1440M0 676H1440M430 0v840M1356 0v840" /><path className="about-design-field__marks" d="M48 172h36m-18-18v36m1260 486h36m-18-18v36M430 48v36m-18-18h36" /></svg></div>
    <TextLoop text="ABOUT ME" connected speed={76} direction="forward" separator=""
      fontSize={36} fontWeight={800} letterSpacing={1.8} color="var(--text)" ribbon
      ribbonColor="var(--brand-accent, var(--amber))" ribbonWidth={88}
      separatorColors={['var(--brand-accent, var(--amber))', 'var(--brand-accent, var(--amber))']} pauseOnHover className="about-profile__text-loop" />
    <div className="about-studio-layout">
      <LanyardId strapColor={strapColor} active={active} />
      <ProfileDetails />
    </div>
    </section>
  </div>
  {/* Keep reading space outside the sticky scene so Contact covers it before release. */}
  <div className="about-scroll-hold" aria-hidden="true" />
  </AnimationActivityContext.Provider>;
}
/* END OF FILE: PORTFOLIO-REFINE-R6 | About.jsx */
