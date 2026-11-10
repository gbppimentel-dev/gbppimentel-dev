import { useEffect, useId, useState } from 'react';
import { applyTheme, normalizeTheme, THEME_STORAGE_KEY } from '../utils/theme';

// Sun/moon transition adapted from Uiverse.io by Type-Delta (Josh Comeau inspiration).
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => normalizeTheme(document.documentElement.dataset.theme));
  const [pointerFocus, setPointerFocus] = useState(false);
  const mask = `theme-moon-${useId().replace(/:/g, '')}`;
  useEffect(() => {
    const sync = event => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      const next = normalizeTheme(event.newValue);
      document.documentElement.dataset.theme = next;
      setTheme(next);
      window.dispatchEvent(new Event('portfolio-theme-change'));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  return <label className="theme-toggle" title={label} data-pointer-focus={pointerFocus || undefined}
    onPointerDown={() => setPointerFocus(true)} onKeyDown={() => setPointerFocus(false)} onBlur={() => setPointerFocus(false)}>
    <input type="checkbox" className="theme-toggle-input" checked={theme === 'light'} aria-label="Light mode"
      onChange={event => setTheme(applyTheme(event.target.checked ? 'light' : 'dark'))} />
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <defs><mask id={mask}><rect width="20" height="20" fill="white" /><circle cx="11" cy="3" r="8" fill="black" /></mask></defs>
      <circle className="theme-sun-moon" cx="10" cy="10" r="8" mask={`url(#${mask})`} />
      <g>{[[18,10],[14,16.928],[6,16.928],[2,10],[6,3.1718],[14,3.1718]].map(([cx,cy], index) => <circle className="theme-ray" cx={cx} cy={cy} r="1.5" key={index} style={{ '--ray-delay': `${index * 45}ms` }} />)}</g>
    </svg>
  </label>;
}
