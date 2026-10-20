// CHANGE VERSION: NETSUITE-PROJECTS-R1 | 2026-10-20 | Complete Projects.jsx
import { useCallback, useId, useMemo, useState } from 'react';
import { projects } from '../data';
import { asset } from '../utils/assets';
import AccordionGallery from './AccordionGallery';
import LogoLoop from './LogoLoop';
import TechLogo, { technologyCatalog } from './TechLogo';
import '../styles/ProjectGallery.css';

const categories = ['All', 'Web development', 'Artworks', 'Games'];

export default function Projects() {
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const detailsId = `project-details-${useId().replace(/:/g, '')}`;
  const shown = useMemo(() => projects.filter(project => category === 'All' || project.category === category), [category]);
  const galleryItems = useMemo(() => shown.map(project => ({
    ...project,
    image: asset(project.screenshot || project.artwork || 'images/slide01.png'),
    label: project.title,
    hasScreenshot: Boolean(project.screenshot),
  })), [shown]);
  const selected = shown.find(project => project.id === selectedId) || shown[0];
  const techLogos = useMemo(() => (selected?.technologies || []).map(technology => {
    const entry = technologyCatalog[technology];
    return {
      node: <TechLogo technology={technology} />,
      title: entry?.label || technology,
      hoverColor: entry?.color || '#f2e9d6',
    };
  }), [selected]);
  const handleSelection = useCallback(item => setSelectedId(item?.id || null), []);

  return <section id="projects" className="portfolio-projects project-showcase">
    <div className="section-heading project-showcase__heading">
      <div><span className="section-kicker">02 / SELECTED WORK</span><h2>PROJECTS<span>.</span></h2></div>
      <p>Ideas brought to life through code and design.<span>Pick a project. Take a closer look.</span></p>
    </div>
    <div className="project-showcase__toolbar">
      <div className="project-filters" role="group" aria-label="Filter projects">
        {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
      </div>
      <span className="project-showcase__count" aria-live="polite">{String(shown.length).padStart(2, '0')} {shown.length === 1 ? 'project' : 'projects'}</span>
    </div>
    {shown.length ? <>
      <div className="project-showcase__instruction"><span aria-hidden="true">↔</span><span>Hover, tap, or use the arrow keys to explore.</span></div>
      <AccordionGallery items={galleryItems} defaultIndex={0} expandRatio={0.72} height={470}
        duration={0.85} tilt={3} gap={14} detailsId={detailsId} onSelectionChange={handleSelection}
        label={`${category === 'All' ? 'Selected' : category} projects`} />
      <div id={detailsId} className={`project-spotlight accent-${selected.accent || 'blue'}`} role="region" aria-label="Selected project details">
        <div className="project-spotlight__main" aria-live="polite" aria-atomic="true">
          <span className="project-spotlight__category">{selected.category}</span>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          {selected.details && <details key={selected.id}><summary>About this project<span aria-hidden="true">+</span></summary><p>{selected.details}</p></details>}
        </div>
        <div className="project-spotlight__aside">
          {selected.status && <span className="project-spotlight__status"><span aria-hidden="true" />{selected.status}</span>}
          {(selected.liveUrl || selected.sourceUrl) && <div className="project-links">
            {selected.liveUrl && <a href={selected.liveUrl} target={selected.liveUrl.startsWith('#') ? undefined : '_blank'} rel={selected.liveUrl.startsWith('#') ? undefined : 'noopener noreferrer'}><span>{selected.liveLabel || 'Live project'}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg></a>}
            {selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer"><span>Source code</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-2-14-4 18" /></svg></a>}
          </div>}
          <span className="project-spotlight__edition" aria-hidden="true">made with purpose<span>✦</span></span>
        </div>
      </div>
      <section className="project-toolkit" aria-label={`Technologies used in ${selected.title}`}>
        <div className="project-toolkit__heading">
          <div><span className="project-toolkit__kicker">TOOLS BEHIND THE BUILD</span><h3>{selected.title}<span aria-hidden="true"> ✦</span></h3></div>
          <span className="project-toolkit__hint">{techLogos.length ? 'Drag to explore · hover to pause' : 'More details on the way'}</span>
        </div>
        {techLogos.length ? <LogoLoop key={selected.id} logos={techLogos} speed={48} direction="left" logoHeight={32} gap={34}
          hoverSpeed={0} fadeOut fadeOutWidth={0.07} scaleOnHover labels="inline" layout="line" intro draggable
          ariaLabel={`${selected.title} technology stack`} className="project-toolkit__loop" />
          : <div className="project-toolkit__empty"><span aria-hidden="true">{'{ }'}</span><p>Stack details coming soon.</p></div>}
      </section>
    </> : <div className="collection-placeholder"><span className="placeholder-glyph" aria-hidden="true">{category === 'Games' ? '{ play }' : '/* art */'}</span><h3>{category} collection</h3><p>Selected work coming soon.</p></div>}
    {category === 'All' && <div className="project-next"><span aria-hidden="true">↳</span><p>More experiments, games, and artworks.<small>Coming to the collection soon.</small></p></div>}
  </section>;
}
// END OF FILE: NETSUITE-PROJECTS-R1 | Projects.jsx
