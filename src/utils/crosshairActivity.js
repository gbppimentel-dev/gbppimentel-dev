// Decorative transform/opacity animations do not change a cursor lock. Layout,
// visibility and interactive-subtree changes still request a fresh hit test.
const paintOnly = new Set(['transform', 'translate', 'rotate', 'scale', 'opacity', 'will-change']);
const declarations = text => new Map(String(text || '').split(';').flatMap(part => {
  const colon = part.indexOf(':');
  return colon < 0 ? [] : [[part.slice(0, colon).trim(), part.slice(colon + 1).trim()]];
}));

export function createCrosshairMutationFilter({ host, canvas, selector }) {
  let interactive = new WeakMap();
  let previousSelector = selector();
  const containsTarget = element => {
    if (!interactive.has(element)) {
      let found = true;
      try { found = element.matches(selector()) || !!element.querySelector(selector()); } catch { /* Invalid selectors remain conservative. */ }
      interactive.set(element, found);
    }
    return interactive.get(element);
  };
  return records => {
    // Children/classes or an updated selector can change cached eligibility.
    const currentSelector = selector();
    if (currentSelector !== previousSelector || records.some(record => record.type === 'childList' || record.attributeName === 'class')) interactive = new WeakMap();
    previousSelector = currentSelector;
    return records.some(record => {
      const element = record.target;
      if (element === canvas) return false;
      if (record.type !== 'attributes' || record.attributeName !== 'style' || element === host) return true;
      const before = declarations(record.oldValue);
      const after = declarations(element.getAttribute('style'));
      const changed = [...new Set([...before.keys(), ...after.keys()])].filter(key => before.get(key) !== after.get(key));
      return changed.some(key => !paintOnly.has(key)) || (changed.length > 0 && containsTarget(element));
    });
  };
}
