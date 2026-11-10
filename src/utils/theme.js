export const THEME_STORAGE_KEY = 'portfolio-theme';
export const normalizeTheme = value => value === 'light' ? 'light' : 'dark';

export function initializeTheme() {
  let value = 'dark';
  try { value = localStorage.getItem(THEME_STORAGE_KEY); } catch { /* Private storage still gets a usable dark default. */ }
  const theme = normalizeTheme(value);
  document.documentElement.dataset.theme = theme;
  return theme;
}

export function applyTheme(value) {
  const theme = normalizeTheme(value);
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* The choice still applies for this page. */ }
  window.dispatchEvent(new Event('portfolio-theme-change'));
  return theme;
}
