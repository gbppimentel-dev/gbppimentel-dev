function ActionArrow({ className }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M5 5h14v14" /></svg>;
}

/** One accessible label; decorative text and arrows exchange on interaction. */
export default function HeroAction({ href, label, hoverLabel = label, ariaLabel, external = false, className = '' }) {
  return <a className={`hero-action ${className}`.trim()} href={href}
    aria-label={ariaLabel || label}
    target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
    <span className="hero-action-label-window" aria-hidden="true">
      <span className="hero-action-label-rest">{label}</span>
      <span className="hero-action-label-hover">{hoverLabel}</span>
    </span>
    <span className="hero-action-arrow" aria-hidden="true"><ActionArrow className="hero-action-arrow-rest" /><ActionArrow className="hero-action-arrow-next" /></span>
  </a>;
}
