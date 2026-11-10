import optimizedAssets from '../data/asset-manifest.json' with { type: 'json' };

export function resolveAsset(path, { base = import.meta.env?.BASE_URL || './', mobile = false } = {}) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  const [, filename, suffix] = String(path).match(/^([^?#]*)(.*)$/);
  const normalized = filename.replace(/^\//, '');
  const entry = optimizedAssets[normalized];
  const source = (mobile && entry?.mobile) || entry?.src || normalized;
  return `${base}${source}${suffix}`;
}

// All existing image references share the same content and optimized derivative.
export const asset = path => resolveAsset(path);
export const mobileAsset = path => resolveAsset(path, { mobile: true });

// URLs stored in CSS custom properties are consumed by an external stylesheet.
// Resolve them against the page so a production /assets/ stylesheet cannot
// reinterpret a relative image path as /assets/images/.
export const absoluteAsset = (path, baseURL = document.baseURI) => new URL(asset(path), baseURL).href;
