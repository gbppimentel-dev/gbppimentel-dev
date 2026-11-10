// Advance against a stable timeline rather than rounding every interval up to
// the next display frame (which turns a 30Hz effect into an uneven 20Hz one).
export function createPaintClock(fps = 60) {
  let anchor = NaN;
  return {
    reset() { anchor = NaN; },
    due(now, rate = fps) {
      const interval = 1000 / Math.max(1, rate);
      const elapsed = now - anchor;
      if (!Number.isFinite(anchor) || elapsed < -interval || elapsed > interval * 4) {
        anchor = now;
        return true;
      }
      if (elapsed + .75 < interval) return false;
      anchor += Math.floor((elapsed + .75) / interval) * interval;
      return true;
    },
  };
}

// Cap the whole transparent WebGL surface, not just each dimension. A wide
// high-DPI About layout otherwise allocates several million drawing pixels.
export function renderPixelRatio(width, height, deviceRatio = 1, maxRatio = 1.5, pixelBudget = 1_600_000) {
  const area = Math.max(1, width) * Math.max(1, height);
  return Math.min(Math.max(.1, deviceRatio || 1), maxRatio, Math.sqrt(pixelBudget / area));
}
