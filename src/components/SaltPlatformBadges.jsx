// CHANGE VERSION: PORTFOLIO-SALT-LIGHT-R2 | Salt & Light's cross-device availability
import '../styles/SaltPlatformBadges.css';

export function SaltPlatformIcon({ name = 'web', className = '' }) {
  if (name === 'android') return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="m7.2 5.6-1.6-2.5m11.2 2.5 1.6-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 11a8 8 0 0 1 16 0v1H4v-1Zm0 3h16v5a2 2 0 0 1-2 2h-1v1H7v-1H6a2 2 0 0 1-2-2v-5Z" fill="currentColor" />
    <circle cx="8.5" cy="9" r="1" fill="var(--salt-platform-eye, #f5f7f6)" /><circle cx="15.5" cy="9" r="1" fill="var(--salt-platform-eye, #f5f7f6)" />
  </svg>;
  if (name === 'ios') return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M16.7 2c.1 1.2-.4 2.4-1.1 3.2-.8.9-1.9 1.4-3 1.3-.2-1.2.4-2.4 1.1-3.1.8-.9 2-1.4 3-1.4Zm3.5 16.4c-.5 1.1-.8 1.6-1.5 2.6-.9 1.2-2.1 2.8-3.6 2.8-1.3 0-1.6-.8-3.4-.8-1.7 0-2.1.8-3.4.8-1.5 0-2.6-1.4-3.5-2.6-2.4-3.4-3.4-8.7-1.5-11.5 1.3-2 3.4-2.8 5.4-2.8 1.5 0 2.5.8 3.5.8s2.8-1 4.7-.8c1.6.1 2.8.9 3.6 2-3.2 1.8-2.7 6.5.5 8.1l-.8 1.4Z" transform="translate(1 -.5) scale(.88)" />
  </svg>;
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4M3 9h18" /><circle cx="6.5" cy="6.5" r=".4" fill="currentColor" stroke="none" /><circle cx="9" cy="6.5" r=".4" fill="currentColor" stroke="none" /></svg>;
}

export default function SaltPlatformBadges({ compact = false }) {
  return <span className={'salt-platform-badges' + (compact ? ' salt-platform-badges--compact' : '')} role="list" aria-label="Installable web app for web, Android and iOS">
    {[['web', 'Web'], ['android', 'Android'], ['ios', 'iOS']].map(([name, label]) => <span role="listitem" key={name} className={'salt-platform-badge salt-platform-badge--' + name}><SaltPlatformIcon name={name} /><span>{label}</span></span>)}
  </span>;
}
// END OF FILE: PORTFOLIO-SALT-LIGHT-R2 | SaltPlatformBadges.jsx
