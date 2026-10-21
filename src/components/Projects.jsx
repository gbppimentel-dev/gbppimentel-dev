// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R2 | Salt & Light's web and mobile collection
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { projects } from '../data';
import { asset } from '../utils/assets';
import AccordionGallery from './AccordionGallery';
import LogoLoop from './LogoLoop';
import TechLogo, { technologyCatalog } from './TechLogo';
import ProjectsBackdrop from './ProjectsBackdrop';
import LifeCityProjectNotes from './LifeCityProjectNotes';
import PortfolioProjectNotes from './PortfolioProjectNotes';
import SaltLightProjectNotes from './SaltLightProjectNotes';
import SaltPlatformBadges from './SaltPlatformBadges';
import '../styles/ProjectGallery.css';

const pad = value => String(value).padStart(2, '0');
const categoryOptions = ['All', ...new Set(projects.map(project => project.category))];

function useProjectReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function ProjectIcon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: <path d="M6 18 18 6M6 6h12v12" />,
    code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></>,
    devices: <><path d="M13 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2M6 21h7m-3-4v4" /><rect x="15" y="9" width="7" height="12" rx="1.5" /><path d="M18 18h1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.arrow}</svg>;
}

// Expand below the moving row, keeping its measured item widths stable.
function ProjectTechnologyLoop({ logos, projectTitle, reducedMotion }) {
  const [active, setActive] = useState(null);
  const lastActive = useRef(null);
  if (active) lastActive.current = active;
  const detail = active || lastActive.current;
  const wrapperRef = useRef(null);
  const closeTimer = useRef(null);
  const detailId = 'technology-detail-' + useId().replace(/:/g, '');
  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const preview = useCallback(item => { cancelClose(); setActive(item); }, [cancelClose]);
  const closeLater = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActive(null), 160);
  }, [cancelClose]);
  const closePreview = useCallback(() => {
    cancelClose();
    setActive(null);
  }, [cancelClose]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  return <div ref={wrapperRef} className="project-tech-explorer"
    onPointerEnter={cancelClose} onPointerLeave={closeLater}
    onFocusCapture={cancelClose}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeLater(); }}
    onKeyDown={event => { if (event.key === 'Escape') { closePreview(); event.stopPropagation(); } }}>
    <LogoLoop logos={logos} speed={active ? 0 : 42} direction="left" logoHeight={27} gap={29}
      hoverSpeed={0} fadeOut fadeOutWidth={.06} scaleOnHover labels="inline" layout="line" intro={false} draggable
      previewOnly onItemPreview={preview} activeItemId={active?.id} previewId={detailId}
      ariaLabel={projectTitle + ' technology stack'} className="project-toolkit__loop" />
    <motion.div className="project-tech-detail-shell" initial={false}
      animate={{ height: active ? 'auto' : 0, opacity: active ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : .38, ease: [.22, 1, .36, 1] }}
      aria-hidden={!active} inert={!active}>
      {detail && <div id={detailId} className="project-tech-detail" role="tooltip"
        style={{ '--technology-color': detail.hoverColor }}>
        <span className="project-tech-detail__emblem" aria-hidden="true">{detail.node}</span>
        <motion.div key={detail.id} className="project-tech-detail__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : .22 }}>
          <strong>{detail.title}</strong><p>{detail.description}</p>
        </motion.div>
      </div>}
    </motion.div>
  </div>;
}

function DraftText({ value, children, className = '' }) {
  return <p className={(value ? '' : 'project-draft ') + className}>{value || children}</p>;
}

function DestinationLink({ href, children, icon = 'arrow', label }) {
  const content = <><ProjectIcon name={icon} /><span>{children}<small>{href ? label : 'link not connected'}</small></span><ProjectIcon className="project-link-arrow" /></>;
  return href ? <a href={href} target={href.startsWith('#') ? undefined : '_blank'} rel={href.startsWith('#') ? undefined : 'noopener noreferrer'}>{content}</a>
    : <button type="button" aria-disabled="true" aria-label={children + ' — link not connected'}>{content}</button>;
}

function ScreenshotSlot({ screen, number }) {
  return <figure className={'project-screen' + (screen?.src ? ' project-screen--real' : ' project-screen--draft')}>
    <div className="project-screen__chrome" aria-hidden="true"><span /><span /><span /><i>{pad(number)} / SCREEN</i></div>
    {screen?.src ? <img src={asset(screen.src)} alt={screen.alt || 'Project screen ' + number} loading="lazy" /> : <div className="project-screen__placeholder">
      <div className="project-screen__wireframe" aria-hidden="true"><i /><div><b /><b /><b /></div><span /><span /></div>
      <strong>{number === 1 ? 'The main experience' : 'A closer look'}</strong>
      <span>{number === 1 ? 'Add the primary product screenshot here.' : 'Add a feature, flow, or detail screen here.'}</span>
    </div>}
    <figcaption>{screen?.caption || (number === 1 ? 'Describe what this screen helps people do.' : 'Explain the feature or decision shown in this view.')}</figcaption>
  </figure>;
}

// Keep both layouts mounted during a crossfade. The outgoing copy leaves flow,
// while the incoming copy supplies its real height and becomes the only active UI.
function ProjectNotesPanel({ projectId, accent, reducedMotion, onMeasure, onReady, children }) {
  const panelRef = useRef(null);
  const present = useIsPresent();
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || !present) return undefined;
    const measure = () => onMeasure(projectId, panel.getBoundingClientRect().height || panel.scrollHeight);
    measure();
    onReady(projectId);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(panel);
    return () => observer?.disconnect();
  }, [projectId, present, onMeasure, onReady]);
  return <motion.div ref={panelRef} className="project-case-study__transition"
    data-notes-project={projectId} data-notes-active={present ? 'true' : 'false'}
    aria-hidden={present ? undefined : true} inert={!present}
    style={{ '--project-accent': `var(--${accent})`, position: present ? 'relative' : 'absolute' }}
    initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: reducedMotion ? 0 : -3 }}
    transition={{ opacity: { duration: reducedMotion ? 0 : present ? .58 : .42, ease: [.25, .1, .25, 1] },
      y: { duration: reducedMotion ? 0 : .64, ease: [.22, 1, .36, 1] } }}>
    {children}
  </motion.div>;
}

function ProjectNotesTransition({ projectId, accent, reducedMotion, onReady, children }) {
  const [height, setHeight] = useState(0);
  const activeProject = useRef(projectId);
  const latestHeight = useRef(0);
  const changing = useRef(false);
  if (activeProject.current !== projectId) {
    activeProject.current = projectId;
    changing.current = !reducedMotion;
  }
  const measure = useCallback((id, value) => {
    if (id !== activeProject.current || value <= 0) return;
    latestHeight.current = value;
    // A shorter incoming panel must not crop the outgoing copy mid-fade.
    setHeight(previous => {
      const next = changing.current ? Math.max(previous, value) : value;
      return Math.abs(previous - next) < .5 ? previous : next;
    });
  }, []);
  const settle = useCallback(() => {
    changing.current = false;
    if (latestHeight.current > 0) setHeight(latestHeight.current);
  }, []);
  useLayoutEffect(() => { if (reducedMotion) settle(); }, [reducedMotion, settle]);
  return <motion.div className="project-case-study__viewport" initial={false}
    animate={{ height: height || 'auto' }}
    transition={{ duration: reducedMotion ? 0 : .64, ease: [.22, 1, .36, 1] }}>
    <AnimatePresence mode="sync" initial={false} onExitComplete={settle}>
      <ProjectNotesPanel key={projectId} projectId={projectId} accent={accent} reducedMotion={reducedMotion}
        onMeasure={measure} onReady={onReady}>{children}</ProjectNotesPanel>
    </AnimatePresence>
  </motion.div>;
}

export default function Projects() {
  const reducedMotion = useProjectReducedMotion();
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(projects[0]?.id || null);
  const [notesId, setNotesId] = useState(projects[0]?.id || null);
  const [activation, setActivation] = useState(null);
  const [readyProjectId, setReadyProjectId] = useState(projects[0]?.id || null);
  const detailsRef = useRef(null);
  const activationCount = useRef(0);
  const handledActivation = useRef(0);
  const detailsId = 'project-details-' + useId().replace(/:/g, '');
  const shown = useMemo(() => projects.filter(project => category === 'All' || project.category === category), [category]);
  const galleryItems = useMemo(() => shown.map(project => ({
    ...project,
    image: asset(project.screenshot || project.artwork || 'images/slide01.png'),
    label: project.title,
    hasScreenshot: Boolean(project.screenshot),
  })), [shown]);
  const selected = shown.find(project => project.id === selectedId) || shown[0];
  const notes = shown.find(project => project.id === notesId) || selected;
  const study = notes?.caseStudy || {};
  const selectedIndex = projects.findIndex(project => project.id === notes?.id);
  const notesHeadingId = `${detailsId}-title-${notes?.id || 'empty'}`;
  // Brief hover intent keeps the notes readable while crossing other panels.
  // Activating a project below bypasses this delay entirely.
  useEffect(() => {
    if (selected?.id === notesId) return undefined;
    if (reducedMotion) { setNotesId(selected?.id); return undefined; }
    const timer = window.setTimeout(() => setNotesId(selected?.id), 130);
    return () => window.clearTimeout(timer);
  }, [selected?.id, notesId, reducedMotion]);
  const techLogos = useMemo(() => (selected?.technologies || []).map(technology => {
    const entry = technologyCatalog[technology];
    return { id: technology, node: <TechLogo technology={technology} />, title: entry?.label || technology,
      description: entry?.description, hoverColor: entry?.color || '#f2e9d6' };
  }), [selected]);
  const handleSelection = useCallback(item => { if (item?.id) setSelectedId(item.id); }, []);
  const handleActivation = useCallback(item => {
    if (!item?.id) return;
    setSelectedId(item.id);
    setNotesId(item.id);
    setActivation({ id: item.id, count: ++activationCount.current });
  }, []);
  const filter = value => {
    setActivation(null);
    const next = projects.filter(project => value === 'All' || project.category === value);
    if (!next.some(project => project.id === selectedId)) setSelectedId(next[0]?.id || null);
    setNotesId(next.some(project => project.id === selectedId) ? selectedId : next[0]?.id || null);
    setCategory(value);
  };

  useLayoutEffect(() => {
    if (!activation || handledActivation.current === activation.count) return undefined;
    if (activation.id !== selected?.id) { handledActivation.current = activation.count; setActivation(null); return undefined; }
    if (readyProjectId !== activation.id) return undefined;
    handledActivation.current = activation.count;
    const frame = requestAnimationFrame(() => {
      const section = detailsRef.current;
      if (!section) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = Math.max(0, window.scrollY + section.getBoundingClientRect().top - 104);
      document.getElementById(notesHeadingId)?.focus({ preventScroll: true });
      window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
      setActivation(null);
    });
    return () => cancelAnimationFrame(frame);
  }, [activation, selected?.id, readyProjectId, notesHeadingId]);

  return <section id="projects" className="portfolio-projects project-showcase" aria-labelledby="projects-title">
    <ProjectsBackdrop />
    <div className="project-showcase__content">
      <header className="project-showcase__heading">
        <div><span className="project-index-label"><span aria-hidden="true">✦</span> stuff that i do :&gt;</span><h2 id="projects-title">Projects<span>.</span></h2></div>
        <p>browse case studies of my projects &amp; commissions.</p>
      </header>
      <div className="project-showcase__toolbar">
        <div className="project-filters" role="group" aria-label="Filter projects">
          {categoryOptions.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => filter(value)}>
            <ProjectIcon name={value === 'All' ? 'grid' : value === 'Web & mobile app' ? 'devices' : 'code'} /><span>{value === 'All' ? 'All work' : value}</span><small>{pad(value === 'All' ? projects.length : projects.filter(project => project.category === value).length)}</small>
          </button>)}
        </div>
        <span className="project-showcase__count" aria-live="polite"><b>{pad(shown.length)}</b> {shown.length === 1 ? 'project' : 'projects'}</span>
      </div>
      {selected ? <>
        <div className="project-collection" data-collection-theme={selected.id === 'salt-and-light' ? 'salt' : selected.id === 'lifecity-attendance' ? 'lifecity' : selected.id === 'gbppimentel-dev' ? 'gbp' : 'portfolio'}
          style={{ '--collection-accent': `var(--${selected.accent || 'blue'})` }}>
          <div className="project-collection__bar"><span>THE COLLECTION</span>
            <span className="project-collection__identity">
              {selected.id === 'salt-and-light' ? <img src={asset('images/projects/salt-light-icon-r1.png')} alt="" width="22" height="22" /> : selected.id === 'lifecity-attendance' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /><circle cx="9" cy="7" r="4" /></svg> : selected.id === 'gbppimentel-dev' ? <img src={asset('brand/triangle-logo.png')} alt="" width="22" height="22" /> : <span aria-hidden="true">✦</span>}
              <motion.span key={selected.id} initial={reducedMotion ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .35 }}>{selected.title}</motion.span>
            </span><span aria-hidden="true">01 — {pad(shown.length)}</span></div>
          <AnimatePresence initial={false}>
            {selected.id === 'salt-and-light' && <motion.div className="project-collection__platform-strip" key="salt-platforms"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : .42, ease: [.22, 1, .36, 1] }}>
              <div><span><b>Built for the browser.</b> Ready for your home screen.</span><SaltPlatformBadges compact /></div>
            </motion.div>}
          </AnimatePresence>
          <div className="project-collection__gallery">
            <AccordionGallery items={galleryItems} defaultIndex={0} expandRatio={0.7} height={450}
              duration={1} ease="power3.inOut" tilt={2} gap={14} radius={14} detailsId={detailsId}
              onSelectionChange={handleSelection} onItemActivate={handleActivation}
              label={(category === 'All' ? 'Selected' : category) + ' projects'} />
          </div>
          <section className="project-toolkit" aria-label={'Technologies used in ' + selected.title}>
            <div className="project-toolkit__heading"><span>BUILT WITH</span><motion.strong key={selected.id} initial={reducedMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }}>{selected.title}</motion.strong><span className="project-toolkit__mark" aria-hidden="true">✦</span></div>
            <motion.div key={selected.id} className="project-toolkit__body" initial={reducedMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .35, ease: 'easeOut' }}>
              {techLogos.length ? <ProjectTechnologyLoop logos={techLogos} projectTitle={selected.title} reducedMotion={reducedMotion} />
                : <div className="project-toolkit__unlisted"><ProjectIcon name="code" /><span>Add the verified technologies used in this project.</span></div>}
            </motion.div>
          </section>
        </div>
        <section ref={detailsRef} id={detailsId} className={'project-case-study accent-' + (notes.accent || 'blue') + (notes.id === 'salt-and-light' ? ' project-case-study--salt' : notes.id === 'lifecity-attendance' ? ' project-case-study--lifecity' : notes.id === 'gbppimentel-dev' ? ' project-case-study--portfolio' : '')} aria-labelledby={notesHeadingId} data-project-id={selected.id} data-notes-id={notes.id}>
          <div className="project-case-study__bar"><span>PROJECT NOTES</span><motion.span key={notes.id}
            initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .4 }}>
            {pad(selectedIndex + 1)} / {pad(projects.length)}</motion.span></div>
          <ProjectNotesTransition projectId={notes.id} accent={notes.accent || 'blue'} reducedMotion={reducedMotion} onReady={setReadyProjectId}>
            {notes.id === 'salt-and-light' ? <SaltLightProjectNotes project={notes} headingId={notesHeadingId} reducedMotion={reducedMotion} /> : notes.id === 'lifecity-attendance' ? <LifeCityProjectNotes project={notes} headingId={notesHeadingId} reducedMotion={reducedMotion} /> : notes.id === 'gbppimentel-dev' ? <PortfolioProjectNotes project={notes} headingId={notesHeadingId} reducedMotion={reducedMotion} /> : <>
            <div className="project-case-study__overview">
              <div className="project-case-study__intro">
                <span className="project-case-study__category">{notes.category}</span>
                <h3 tabIndex={-1} id={notesHeadingId}>{notes.title}<span>.</span></h3>
                <p className="project-case-study__description">{notes.description}</p>
                {notes.details && <p className="project-case-study__summary">{notes.details}</p>}
              </div>
              <aside className="project-destination" aria-label="Visit this project">
                <span className="project-section-label">OPEN THE PROJECT</span>
                <div className="project-links">
                  <DestinationLink href={notes.liveUrl} label={notes.liveUrl?.startsWith('#') ? 'return to the live portfolio' : 'open the live experience'}>{notes.liveLabel || 'Visit project'}</DestinationLink>
                  <DestinationLink href={notes.sourceUrl} icon="code" label="explore the repository">Source code</DestinationLink>
                </div>
              </aside>
            </div>
            <dl className="project-facts">
              <div><dt>My role</dt><dd className={study.role ? '' : 'project-draft'}>{study.role || 'Add your role and contribution.'}</dd></div>
              <div><dt>Focus</dt><dd className={study.focus ? '' : 'project-draft'}>{study.focus || 'Describe the core focus.'}</dd></div>
              <div><dt>Scope</dt><dd className={study.scope ? '' : 'project-draft'}>{study.scope || 'Add the project scope or timeline.'}</dd></div>
            </dl>
            <div className="project-story-grid">
              <article className="project-note project-note--challenge"><span className="project-note__number" aria-hidden="true">01</span><h4>The challenge</h4><DraftText value={study.challenge}>Describe the problem, who it affected, and why this project mattered.</DraftText></article>
              <article className="project-note project-note--approach"><span className="project-note__number" aria-hidden="true">02</span><h4>The approach</h4><DraftText value={study.approach}>Explain the decisions behind the experience, structure, and technical approach.</DraftText></article>
              <article className="project-note project-note--features"><span className="project-note__number" aria-hidden="true">03</span><h4>Key features</h4><ul>{(study.features?.length ? study.features : ['Add the first key feature.', 'Add a second important capability.', 'Add one thoughtful detail.']).map(feature => <li key={feature} className={study.features?.length ? '' : 'project-draft'}><ProjectIcon name="check" /><span>{feature}</span></li>)}</ul></article>
              <article className="project-note project-note--outcome"><span className="project-note__number" aria-hidden="true">04</span><h4>The outcome</h4><DraftText value={study.outcome}>Share what changed, what you learned, or the result you can support with evidence.</DraftText></article>
            </div>
            <div className="project-screens-heading"><div><span className="project-section-label">IN THE DETAILS</span><h4>A look inside<span>.</span></h4></div><ProjectIcon name="screen" /></div>
            <div className="project-screens"><ScreenshotSlot screen={study.screens?.[0]} number={1} /><ScreenshotSlot screen={study.screens?.[1]} number={2} /></div>
            </>}
          </ProjectNotesTransition>
        </section>
      </> : <div className="project-empty"><h3>No projects in this view.</h3><button type="button" onClick={() => filter('All')}>Show all work</button></div>}
    </div>
  </section>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R2 | Projects.jsx
