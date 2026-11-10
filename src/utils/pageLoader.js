export const INTRO_LOADER_DURATION = 1050;
export const ROUTE_LOADER_DURATION = 300;
export const LOADER_MAX_WAIT = 6000;

// Two animation frames leave one committed browser paint between mounting a
// lightweight shell and starting expensive module or scene initialization.
export function afterFirstPaint(callback, {
  requestFrame = requestAnimationFrame, cancelFrame = cancelAnimationFrame,
} = {}) {
  let cancelled = false;
  let frame = requestFrame(() => {
    frame = requestFrame(() => { frame = 0; if (!cancelled) callback(); });
  });
  return () => { cancelled = true; cancelFrame(frame); };
}

// One overlay owns both startup and route readiness. Generation checks prevent
// a previous route's completion from dismissing the current route's loader.
export function createPageLoader({ initialPage, onVisible, onIntroReady = () => {}, reduced = false,
  now = () => performance.now(), schedule = setTimeout, cancel = clearTimeout }) {
  let page = initialPage, generation = 0, started = false, visible = true;
  let resourcesReady = false, routeReady = false, initial = true;
  let minimumTimer = 0, maximumTimer = 0, introTimer = 0;
  let introStarted = false, introComplete = false;
  let introDeadline = 0, deadline = 0;
  const clearSettlement = () => { cancel(minimumTimer); cancel(maximumTimer); minimumTimer = maximumTimer = 0; };
  const clearTimers = () => { clearSettlement(); cancel(introTimer); introTimer = 0; };
  const prepareSurface = () => {
    cancel(introTimer);
    if (!started || introComplete) return;
    introTimer = schedule(() => {
      introTimer = 0;
      if (!started || introComplete) return;
      introComplete = true;
      onIntroReady();
    }, Math.max(0, introDeadline - now()));
  };
  const show = next => { if (visible !== next) { visible = next; onVisible(next); } };
  const finish = token => {
    if (!started || token !== generation) return;
    clearTimers();
    initial = false;
    show(false);
  };
  const settle = () => {
    if (!started || !visible || !resourcesReady || !routeReady) return;
    cancel(minimumTimer);
    const token = generation;
    minimumTimer = schedule(() => finish(token), Math.max(0, deadline - now()));
  };
  const boundWait = () => {
    const token = generation;
    maximumTimer = schedule(() => finish(token), LOADER_MAX_WAIT);
  };
  return {
    get generation() { return generation; },
    get visible() { return visible; },
    start() {
      if (started) return;
      started = true;
      // App calls start after a committed paint. Construction, parsing, and
      // font work cannot consume the visitor's recognizable intro cycle.
      if (!introStarted) {
        introStarted = true;
        introDeadline = now() + (reduced ? 0 : INTRO_LOADER_DURATION);
        deadline = Math.max(deadline, introDeadline);
      }
      prepareSurface();
      if (visible) { boundWait(); settle(); }
    },
    stop() { started = false; clearTimers(); },
    begin(nextPage) {
      if (nextPage === page && visible) return generation;
      clearSettlement();
      page = nextPage;
      generation += 1;
      routeReady = false;
      deadline = Math.max(initial ? introDeadline : 0, now() + (reduced ? 0 : ROUTE_LOADER_DURATION));
      show(true);
      if (started) boundWait();
      return generation;
    },
    resourcesReady() { resourcesReady = true; settle(); },
    ready(readyPage, token = generation) {
      if (readyPage !== page || token !== generation) return false;
      routeReady = true;
      settle();
      return true;
    },
    setReduced(next) {
      reduced = next;
      if (next) { introDeadline = deadline = now(); prepareSurface(); settle(); }
    },
  };
}
