// Geometry is revealed only by a rendered frame after every required resource.
export function createIdentityReadiness({ required = ['front', 'back', 'strap', 'hardware'], onReady, onError } = {}) {
  let pending = new Set(required), state = 'loading';
  return {
    resource(name) { if (state === 'loading') pending.delete(name); },
    frame() {
      if (state !== 'loading' || pending.size) return false;
      state = 'ready';
      onReady?.();
      return true;
    },
    reset() { if (state !== 'disposed') { pending = new Set(required); state = 'loading'; } },
    fail(error) {
      if (state === 'failed' || state === 'disposed') return;
      state = 'failed';
      onError?.(error);
    },
    dispose() { state = 'disposed'; pending.clear(); },
    get state() { return state; },
  };
}

export function loadDecodedIdentityImage(url, {
  timeoutMs = 8000, signal, createImage = () => new Image(), schedule = setTimeout, cancel = clearTimeout,
} = {}) {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const image = createImage();
    let settled = false, decoding = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cancel(timer);
      image.onload = image.onerror = null;
      signal?.removeEventListener('abort', abort);
      if (error) reject(error); else resolve(image);
    };
    const abort = () => { finish(new Error('Identity image loading was cancelled.')); image.src = ''; };
    const timer = schedule(() => finish(new Error('Identity image loading timed out.')), timeoutMs);
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (settled || decoding) return;
      decoding = true;
      Promise.resolve().then(() => typeof image.decode === 'function' ? image.decode() : undefined)
        .then(() => finish(), () => finish(new Error('Identity image could not be decoded.')));
    };
    image.onerror = () => finish(new Error('Identity image could not be loaded.'));
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    else image.src = url;
  });
}
