// CHANGE VERSION: PORTFOLIO-POLISH-R1 | 2026-10-14 | Complete SocialLinks.jsx
import { socialLinks } from '../data';
import '../styles/PortfolioDetails.css';

const icons = {
  LinkedIn: <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96C2 21.32 2.69 22 3.55 22h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.46 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.29 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.75 1.36-1.55 2.79-1.55 2.98 0 3.58 1.96 3.58 4.51v5.29Z" /></svg>,
  GitHub: <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38l-.01-1.49c-2.23.48-2.7-1.08-2.7-1.08-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.51.28-.86.51-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.49l-.01 2.21c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" /></svg>
};
export default function SocialLinks({ className = '', onNavigate }) {
  return <ul className={`professional-socials ${className}`} aria-label="Professional profiles">
    {socialLinks.map(({ name, href }, index) => <li key={name} style={{ '--item-index': index }}>
      <a className={`social-card social-card-${name.toLowerCase()}`} href={href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} aria-label={`${name} profile (opens in a new tab)`}>
        <span className="social-icon">{icons[name]}</span>
        <span className="social-copy"><strong>{name}</strong><small>{name === 'LinkedIn' ? 'LET’S CONNECT' : 'EXPLORE MY CODE'}</small></span>
        <span className="social-arrow" aria-hidden="true">↗</span>
      </a>
    </li>)}
  </ul>;
}
// END OF FILE: PORTFOLIO-POLISH-R1 | SocialLinks.jsx
