// CHANGE VERSION: PORTFOLIO-REFINE-R3 | 2026-10-20 | Personal navigation profiles
import { menuSocialLinks } from '../data';

const paths = {
  facebook: 'M13.5 22v-8h2.8l.5-3.3h-3.3V8.6c0-.9.4-1.8 1.9-1.8H17V4a19 19 0 0 0-2.7-.2c-2.8 0-4.6 1.7-4.6 4.8v2.1H7V14h2.7v8z',
  messenger: 'M12 3C6.5 3 2 6.9 2 11.8c0 2.8 1.5 5.4 3.8 7v3l3.2-1.7c1 .3 2 .5 3 .5 5.5 0 10-3.9 10-8.8S17.5 3 12 3zm1 11.8-2.6-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.9-2.7z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.2-3.1a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z',
  x: 'M18.9 3H22l-6.8 7.8L23.2 21H17l-4.8-6.3L6.7 21H3.5l7.2-8.3L3 3h6.4l4.4 5.8zM17.8 19h1.7L8.5 5H6.7z',
};

export default function MenuSocialLinks({ onNavigate, links = menuSocialLinks }) {
  return <div className="sm-socials sm-personal-socials">
    <p>ELSEWHERE</p>
    <ul aria-label="Personal social profiles">{links.map((link, index) => {
      const connected = /^https:\/\//i.test(link.href || '');
      const Icon = <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[link.icon] || paths.instagram} /></svg>;
      return <li key={link.name} style={{ '--item-index': index }}>
        {connected ? <a className="sm-social-link" href={link.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} aria-label={link.name}>
          {Icon}<span className="sm-social-tooltip" aria-hidden="true">{link.name}</span>
        </a> : <button className="sm-social-link" type="button" aria-disabled="true" aria-label={`${link.name} — link coming soon`}>
          {Icon}<span className="sm-social-tooltip" aria-hidden="true">link coming soon</span>
        </button>}
      </li>;
    })}</ul>
  </div>;
}
// END OF FILE: PORTFOLIO-REFINE-R3 | MenuSocialLinks.jsx
