import { useState } from 'react';
import { projects } from '../data';
import { asset } from '../utils/assets';

const categories = ['All', 'Web development', 'Artworks', 'Games'];
export default function Projects() {
  const [category, setCategory] = useState('All');
  const shown = projects.filter(project => category === 'All' || project.category === category);
  return <section id="projects" className="portfolio-projects">
    <div className="section-heading"><span className="section-kicker">02 / SELECTED WORK</span><h2>PROJECTS<span>.</span></h2><p>Ideas brought to life through code and design.</p></div>
    <div className="project-filters" role="group" aria-label="Filter projects">
      {categories.map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}
    </div>
    <div className="project-grid" aria-live="polite">
      {shown.map((project, index) => <article className={`project-card accent-${project.accent || 'blue'}`} key={project.id}>
        <div className={`project-visual ${project.screenshot ? 'has-screenshot' : ''}`}>
          {project.screenshot ? <img src={asset(project.screenshot)} alt={`${project.title} screenshot`} loading="lazy" /> : <>
            <div className="project-art" aria-hidden="true" style={{ backgroundImage: `url(${asset(project.artwork || 'images/slide01.png')})` }} />
            <span className="project-index" aria-hidden="true">/0{index + 1}</span>
            <span className="project-display-title" aria-hidden="true">{project.title}</span>
            <span className="project-status">{project.status}</span>
          </>}
        </div>
        <div className="project-info"><span className="section-kicker">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p>
          {project.details && <details><summary>About this project</summary><p>{project.details}</p></details>}
          {(project.liveUrl || project.sourceUrl) && <div className="project-links">
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live project ↗</a>}
            {project.sourceUrl && <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source code ↗</a>}
          </div>}
        </div>
      </article>)}
      {shown.length === 0 && <div className="collection-placeholder"><span className="placeholder-glyph" aria-hidden="true">{category === 'Games' ? '{ play }' : '/* art */'}</span><h3>{category} collection</h3><p>Selected work coming soon.</p></div>}
    </div>
    {category === 'All' && <div className="project-next"><span aria-hidden="true">↳</span><p>More experiments, games, and artworks.<small>Coming to the collection soon.</small></p></div>}
  </section>;
}
