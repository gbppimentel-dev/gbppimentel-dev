// Terminal-window styling inspired by Uiverse.io contributions by
// egehan_1415 and hexday, adapted to the portfolio's shared hero components.
export function HeroWindowBar({ file, language }) {
  return <div className="hero-window-bar">
    <span className="hero-window-dots" aria-hidden="true"><i /><i /><i /></span>
    <span className="hero-window-file"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m4 5 4 5-4 5m7 0h5" /></svg>{file}</span>
    <span className="hero-window-language">{language}</span>
  </div>;
}

export function HeroWindowFooter({ label, skills, children }) {
  return <div className="hero-window-footer">
    <span className="hero-window-footer-label"><span aria-hidden="true">↳</span> {label}</span>
    <ul aria-label={label}>{skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
    {children && <div className="hero-window-footer-actions">{children}</div>}
  </div>;
}
