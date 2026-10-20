// CHANGE VERSION: PORTFOLIO-LIFECITY-PORTAL-R2 | A LifeCity-native case-study experience
import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useIsPresent } from 'motion/react';
import { asset } from '../utils/assets';
import '../styles/LifeCityProjectNotes.css';

function LifeCityIcon({ name = 'arrow', className = '' }) {
  const paths = {
    arrow: <path d="M7 17 17 7M7 7h10v10" />,
    next: <path d="M4 12h16m-6-6 6 6-6 6" />,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /><circle cx="9" cy="7" r="4" /></>,
    code: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" />,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5" /></>,
    target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
    route: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="M8 5h8a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h8" /></>,
    scan: <><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 12h18M8 7v2m8-2v2m-8 6v2m8-2v2" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m4 0h2m-8 3h2" /></>,
    csv: <><path d="M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8m-8 4h8m-4-6v9" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    feedback: <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8A8.5 8.5 0 0 1 12.5 20a8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 4a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.4Z" />,
    screen: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
    expand: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  };
  return <svg className={`lcs-icon ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name] || paths.arrow}</svg>;
}

function CaseStudyContent({ section, features, reducedMotion }) {
  const present = useIsPresent();
  const featureIcons = ['scan', 'users', 'calendar', 'csv', 'shield', 'feedback'];
  return <motion.div className="lcs-panel" aria-hidden={present ? undefined : true}
    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
    transition={{ duration: reducedMotion ? 0 : present ? .34 : .14, ease: [.16, 1, .3, 1] }}>
    <h4>{section.title}</h4>
    {section.key === 'features' ? <ul className="lcs-features">{features.map((feature, index) =>
      <li key={feature}><LifeCityIcon name={featureIcons[index % featureIcons.length]} /><span>{feature}</span></li>
    )}</ul> : <p>{section.content}</p>}
  </motion.div>;
}

export default function LifeCityProjectNotes({ project, headingId, reducedMotion }) {
  const study = project.caseStudy;
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const rootRef = useRef(null);
  const tabRefs = useRef([]);
  const instanceId = useId().replace(/:/g, '');
  const panelId = `lifecity-case-panel-${instanceId}`;
  const sections = [
    { key: 'challenge', title: 'The challenge', icon: 'target', content: study.challenge },
    { key: 'approach', title: 'The approach', icon: 'route', content: study.approach },
    { key: 'features', title: 'Key features', icon: 'scan' },
    { key: 'outcome', title: 'The outcome', icon: 'check', content: study.outcome },
  ];
  const active = sections[activeIndex];
  const nextIndex = (activeIndex + 1) % sections.length;
  const pad = value => String(value).padStart(2, '0');

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') { setInView(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .03 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleTabKey = (event, index) => {
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % sections.length;
    if (event.key === 'ArrowUp') next = (index - 1 + sections.length) % sections.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = sections.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveIndex(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  };

  return <div ref={rootRef} className="lifecity-study" data-motion={reducedMotion ? 'reduced' : 'full'} data-in-view={String(inView)}>
    <header className="lcs-topbar">
      <div className="lcs-brand"><span className="lcs-brand__mark"><LifeCityIcon name="users" /></span><strong>LifeCity Attendance</strong></div>
      <span className="lcs-status"><i aria-hidden="true" />{project.status}</span>
    </header>

    <section className="lcs-welcome" aria-labelledby={headingId}>
      <div className="lcs-welcome__copy">
        <span className="lcs-eyebrow">CASE STUDY / {project.category}</span>
        <h3 className="lcs-title" id={headingId} tabIndex={-1}><span>LifeCity</span> <span>Attendance</span></h3>
        <p className="lcs-lead">{project.description}</p>
        <p className="lcs-summary">{project.details}</p>
        <div className="lcs-actions">
          <a className="lcs-button lcs-button--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer"><LifeCityIcon name="screen" /><span>{project.liveLabel || 'Visit project'}</span><LifeCityIcon name="arrow" /></a>
          <a className="lcs-button lcs-button--secondary" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><LifeCityIcon name="code" /><span>Source code</span><LifeCityIcon name="arrow" /></a>
        </div>
      </div>
      <aside className="lcs-facts" aria-label="Project at a glance">
        <svg className="lcs-orbit" viewBox="0 0 400 360" fill="none" aria-hidden="true" focusable="false"><ellipse cx="200" cy="180" rx="164" ry="139" stroke="currentColor" /><ellipse cx="200" cy="180" rx="133" ry="165" stroke="currentColor" strokeDasharray="3 6" /><circle cx="332" cy="82" r="6" fill="currentColor" /></svg>
        <dl>{[
          ['My role', study.role, 'code'],
          ['Focus', study.focus, 'users'],
          ['Scope', study.scope, 'layers'],
        ].map(([label, value, icon], index) => <div className={`lcs-fact lcs-fact--${index}`} key={label}>
          <span className="lcs-fact__icon"><LifeCityIcon name={icon} /></span><div><dt>{label}</dt><dd>{value}</dd></div>
        </div>)}</dl>
      </aside>
    </section>

    <section className="lcs-story" aria-labelledby={`lifecity-story-${instanceId}`}>
      <header className="lcs-section-heading"><small>PROJECT NOTES</small><h4 id={`lifecity-story-${instanceId}`}>Explore the case study.</h4></header>
      <div className="lcs-workspace">
        <div className="lcs-index" role="tablist" aria-label="LifeCity case study sections" aria-orientation="vertical">
          {sections.map((section, index) => <button className="lcs-tab" type="button" key={section.key}
            ref={node => { tabRefs.current[index] = node; }}
            role="tab" aria-selected={activeIndex === index} aria-controls={panelId}
            id={`lifecity-tab-${instanceId}-${index}`} tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)} onKeyDown={event => handleTabKey(event, index)}>
            <span className="lcs-tab__number">{pad(index + 1)}</span><LifeCityIcon name={section.icon} /><span className="lcs-tab__label">{section.title}</span><LifeCityIcon name="arrow" />
          </button>)}
        </div>
        <div className="lcs-inspector">
          <div className="lcs-inspector__orbit" aria-hidden="true" />
          <span className="lcs-inspector__position" aria-hidden="true">CASE STUDY / {pad(activeIndex + 1)}</span>
          <div className="lcs-inspector__body" role="tabpanel" id={panelId} tabIndex={0} aria-labelledby={`lifecity-tab-${instanceId}-${activeIndex}`}>
            <AnimatePresence mode="wait" initial={false}>
              <CaseStudyContent key={active.key} section={active} features={study.features} reducedMotion={reducedMotion} />
            </AnimatePresence>
          </div>
          <div className="lcs-inspector__footer"><span>{pad(activeIndex + 1)} / {pad(sections.length)}</span><button type="button" className="lcs-next" onClick={() => setActiveIndex(nextIndex)}><span>Next: {sections[nextIndex].title}</span><LifeCityIcon name="next" /></button></div>
        </div>
      </div>
    </section>

    <section className="lcs-screens" aria-labelledby={`lifecity-screens-${instanceId}`}>
      <header className="lcs-section-heading"><small>IN THE DETAILS</small><h4 id={`lifecity-screens-${instanceId}`}>A look inside.</h4></header>
      <div className="lcs-screen-grid">{study.screens.map((screen, index) => <figure className="lcs-screen" key={screen.src}>
        <div className="lcs-screen__chrome"><span>{pad(index + 1)} / SCREEN</span><LifeCityIcon name="screen" /></div>
        <a className="lcs-screen__image" href={asset(screen.src)} target="_blank" rel="noopener noreferrer" aria-label={`Open LifeCity screenshot ${index + 1} at full size`}>
          <img src={asset(screen.src)} alt={screen.alt} loading="lazy" /><span className="lcs-screen__expand"><LifeCityIcon name="expand" /></span>
        </a>
        <figcaption>{screen.caption}</figcaption>
      </figure>)}</div>
    </section>
  </div>;
}
// END OF FILE: PORTFOLIO-LIFECITY-PORTAL-R2 | LifeCityProjectNotes.jsx
