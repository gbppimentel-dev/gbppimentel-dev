import { awards } from '../data';
export default function Awards() {
  return <section id="awards" className="portfolio-awards">
    <div className="section-heading"><span className="section-kicker">03 / MILESTONES</span><h2>AWARDS<span>.</span></h2></div>
    {awards.length ? <ul className="award-list">{awards.map((award, index) => <li key={`${award.title}-${index}`}><span>{award.year}</span><div><h3>{award.title}</h3><p>{award.organization}</p></div>{award.url && <a href={award.url} target="_blank" rel="noopener noreferrer">View award ↗</a>}</li>)}</ul> :
      <div className="awards-placeholder"><span className="award-orbit" aria-hidden="true">✳</span><div><h3>A few milestones along the way.</h3><p>Awards, certifications, and highlights coming soon.</p></div><span className="outline-label">TO BE CONTINUED</span></div>}
  </section>;
}
