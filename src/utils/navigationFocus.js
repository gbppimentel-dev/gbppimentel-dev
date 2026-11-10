const stopSelector = 'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]';

// An invisible checkbox can still be the accessible control for its visible
// label. Check layout/visibility and inert ancestors, rather than opacity.
export function getNavigationStops(...roots) {
  return [...new Set(roots.flatMap(root => [...(root?.querySelectorAll(stopSelector) || [])]))].filter(node => {
    if (node.tabIndex < 0 || node.matches(':disabled') || node.closest('[inert], [hidden], [aria-hidden="true"]')) return false;
    if (!node.getClientRects().length) return false;
    const visibility = node.ownerDocument.defaultView.getComputedStyle(node).visibility;
    return visibility !== 'hidden' && visibility !== 'collapse';
  });
}

export function focusNavigationItem(node, { panel, header } = {}) {
  if (!node) return;
  node.focus({ preventScroll: true });
  if (!panel?.contains(node)) return;
  const bounds = node.getBoundingClientRect();
  const viewport = panel.getBoundingClientRect();
  const top = Math.max(viewport.top + 12, (header?.getBoundingClientRect().bottom || 0) + 12);
  const bottom = viewport.bottom - 12;
  if (bounds.top < top) panel.scrollTop += bounds.top - top;
  else if (bounds.bottom > bottom) panel.scrollTop += bounds.bottom - bottom;
}

// Both menu compositions use one logical sequence: routes/social profiles,
// then the heart, theme control, and close button. Enter remains native.
export function createNavigationKeyHandler({ getStops, getActiveElement, focus, close, onKeyboard = () => {} }) {
  return event => {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const stops = getStops();
    if (!stops.length) return;
    const current = stops.indexOf(getActiveElement());
    const next = current < 0 ? (event.shiftKey ? stops.length - 1 : 0)
      : (current + (event.shiftKey ? -1 : 1) + stops.length) % stops.length;
    event.preventDefault();
    onKeyboard();
    focus(stops[next]);
  };
}
