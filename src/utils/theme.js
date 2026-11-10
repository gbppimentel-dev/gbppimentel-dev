export const THEME_STORAGE_KEY = 'portfolio-theme';
export const THEME_SWIPE_DURATION = 650;
export const THEME_FADE_DURATION = 360;
export const normalizeTheme = value => value === 'light' ? 'light' : 'dark';

// One finite transition owns the viewport. A superseded snapshot callback must
// never put an older choice back after a second click or another tab's update.
export function createThemeTransition({ document: owner, window: view, commit,
  schedule = (callback, delay) => view.setTimeout(callback, delay), cancel = id => view.clearTimeout(id),
}) {
  let generation = 0;
  let active = null;
  const clear = record => {
    cancel(record.timer);
    if (active !== record) return;
    active = null;
    delete owner.documentElement.dataset.themeTransition;
    delete owner.documentElement.dataset.themeDirection;
  };
  const stop = record => {
    try { record?.transition?.skipTransition(); } catch { /* Already finished. */ }
    if (record) clear(record);
  };
  return (value, { animate = true, persist = true } = {}) => {
    const theme = normalizeTheme(value);
    const token = ++generation;
    stop(active);
    let committed = false;
    const update = () => {
      if (token !== generation || committed) return;
      committed = true;
      commit(theme, { persist });
    };
    const reduced = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!animate || reduced || owner.hidden || owner.documentElement.dataset.theme === theme) {
      update();
      return theme;
    }
    const record = { transition: null, timer: 0 };
    active = record;
    const finish = () => { update(); clear(record); };
    const fade = () => {
      owner.documentElement.dataset.themeTransition = 'fade';
      // Commit the old surface colors before changing their custom properties.
      if (owner.body && view.getComputedStyle) void view.getComputedStyle(owner.body).backgroundColor;
      update();
      record.timer = schedule(() => clear(record), THEME_FADE_DURATION + 40);
    };
    if (typeof owner.startViewTransition !== 'function') fade();
    else {
      owner.documentElement.dataset.themeTransition = 'swipe';
      owner.documentElement.dataset.themeDirection = theme;
      try {
        record.transition = owner.startViewTransition(update);
        // Browsers may skip snapshots, for example when the tab becomes hidden.
        // These promises are intentionally handled even when no animation starts.
        record.transition.ready?.catch(() => {});
        record.transition.updateCallbackDone?.catch(() => {});
        record.transition.finished.then(finish, finish);
        record.timer = schedule(() => { update(); stop(record); }, 1600);
      } catch {
        fade();
      }
    }
    return theme;
  };
}

export function initializeTheme() {
  let value = 'dark';
  try { value = localStorage.getItem(THEME_STORAGE_KEY); } catch { /* Private storage still gets a usable dark default. */ }
  const theme = normalizeTheme(value);
  document.documentElement.dataset.theme = theme;
  return theme;
}

let transitionDocument;
let transitionTheme;
export function applyTheme(value, options) {
  if (!transitionTheme || transitionDocument !== document) {
    transitionDocument = document;
    transitionTheme = createThemeTransition({ document, window, commit: (theme, { persist }) => {
      document.documentElement.dataset.theme = theme;
      if (persist) {
        try { localStorage.setItem(THEME_STORAGE_KEY, theme); } catch { /* The choice still applies for this page. */ }
      }
      window.dispatchEvent(new Event('portfolio-theme-change'));
    } });
  }
  return transitionTheme(value, options);
}
