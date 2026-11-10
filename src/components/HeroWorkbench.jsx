// The words keep their own springs; the surrounding window stays steady.
export default function HeroWorkbench({ children }) {
  return <div className="hero-print-workbench">
    <div className="hero-workbench-backdrop" aria-hidden="true" />
    <div className="hero-workbench-content">{children}</div>
  </div>;
}
