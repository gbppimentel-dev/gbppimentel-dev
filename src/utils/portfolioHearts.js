// CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Portable anonymous hearts with a safe staged cutover
const VISITOR_KEY = 'gbppimentel-dev:heart-visitor:v1';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REQUEST_TIMEOUT = 8000;
let memoryVisitor = null;

const browserStorage = () => {
  try { return globalThis.localStorage ?? null; } catch { return null; }
};

const makeVisitorId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

/** An anonymous browser identifier, never an account or a visitor's personal data. */
export function getHeartVisitorId(storage = browserStorage()) {
  try {
    const saved = storage?.getItem(VISITOR_KEY);
    if (UUID.test(saved ?? '')) { memoryVisitor = saved; return saved; }
  } catch { /* Storage may be blocked; the current tab still works. */ }
  if (!memoryVisitor) memoryVisitor = makeVisitorId();
  try { storage?.setItem(VISITOR_KEY, memoryVisitor); } catch { /* Keep the in-memory identifier. */ }
  return memoryVisitor;
}

const legacyAnonKey = key => {
  try {
    const parts = key.split('.');
    if (parts.length !== 3) return false;
    const part = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(globalThis.atob(part.padEnd(Math.ceil(part.length / 4) * 4, '=')));
    return payload.role === 'anon';
  } catch { return false; }
};

function validateConfig(config = {}) {
  const provider = config.provider || 'supabase';
  let url = String(config.url ?? '').trim().replace(/\/+$/, '');
  const key = provider === 'cloudflare' ? '' : String(config.key ?? '').trim();
  if (!['cloudflare', 'supabase'].includes(provider)) {
    return { configured: false, provider, url: '', key: '', reason: 'Check the heart storage provider.' };
  }
  if (!url || (provider === 'supabase' && !key)) {
    return { configured: false, provider, url, key: '', reason: 'Heart storage is not configured yet.' };
  }
  try {
    const parsed = new URL(url);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' || (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:'))) throw new Error();
    url = parsed.origin;
  } catch {
    return { configured: false, provider, url: '', key: '', reason: provider === 'cloudflare' ? 'Check the heart API URL.' : 'Check the Supabase project URL.' };
  }
  if (provider === 'supabase' && !key.startsWith('sb_publishable_') && !legacyAnonKey(key)) {
    return { configured: false, provider, url, key: '', reason: 'Use a Supabase publishable key or legacy anon key, never a secret or service-role key.' };
  }
  return { configured: true, provider, url, key };
}

/** The public Worker URL opts into Cloudflare; blank keeps the existing service. */
export function getPortfolioHeartsConfig(env = import.meta.env ?? {}) {
  if (String(env.VITE_HEARTS_API_URL ?? '').trim()) {
    return validateConfig({ provider: 'cloudflare', url: env.VITE_HEARTS_API_URL });
  }
  // Keep the old project working until the new counter has been imported and tested.
  return validateConfig({ provider: 'supabase', url: env.VITE_SUPABASE_URL, key: env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY });
}

const parseState = value => {
  const row = Array.isArray(value) && value.length === 1 ? value[0] : value;
  const count = typeof row?.count === 'string' && /^\d+$/.test(row.count) ? Number(row.count) : row?.count;
  if (!row || typeof row.liked !== 'boolean' || !Number.isSafeInteger(count) || count < 0) {
    throw new Error('The heart count could not be read. Please try again.');
  }
  return { liked: row.liked, count };
};

/** Small REST client; dependency-free and injectable for focused verification. */
export function createPortfolioHeartsClient(config = getPortfolioHeartsConfig(), options = {}) {
  const checked = validateConfig(config);
  const fetchImpl = options.fetchImpl ?? ((...args) => globalThis.fetch(...args));
  const visitorId = () => getHeartVisitorId(options.storage === undefined ? browserStorage() : options.storage);

  const request = async (liked, { signal } = {}) => {
    if (!checked.configured) throw new Error(checked.reason);
    const controller = new AbortController();
    const onAbort = () => controller.abort(signal?.reason);
    if (signal?.aborted) { onAbort(); throw signal.reason ?? new DOMException('Aborted', 'AbortError'); }
    signal?.addEventListener('abort', onAbort, { once: true });
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, REQUEST_TIMEOUT);
    try {
      const id = visitorId();
      const reading = liked === undefined;
      let endpoint;
      let method;
      let body;
      const headers = { Accept: 'application/json' };
      if (checked.provider === 'cloudflare') {
        endpoint = `${checked.url}/api/hearts${reading ? `?visitor_id=${encodeURIComponent(id)}` : ''}`;
        method = reading ? 'GET' : 'PUT';
        if (!reading) body = JSON.stringify({ visitor_id: id, liked });
      } else {
        endpoint = `${checked.url}/rest/v1/rpc/${reading ? 'portfolio_heart_state' : 'set_portfolio_heart'}`;
        method = 'POST';
        body = JSON.stringify(reading ? { p_visitor_id: id } : { p_visitor_id: id, p_liked: liked });
        headers.apikey = checked.key;
        // Publishable keys are not JWTs and must never be sent as bearer tokens.
        if (legacyAnonKey(checked.key)) headers.Authorization = `Bearer ${checked.key}`;
      }
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      const response = await fetchImpl(endpoint, {
        method, headers, ...(body !== undefined ? { body } : {}), signal: controller.signal,
        cache: 'no-store', credentials: 'omit',
      });
      if (!response.ok) throw new Error('Heart storage is unavailable right now. Please try again.');
      return parseState(await response.json());
    } catch (error) {
      if (signal?.aborted) throw signal.reason ?? new DOMException('Aborted', 'AbortError');
      if (timedOut) throw new Error('The heart count took too long to respond. Please try again.');
      if (error instanceof Error && /^(Heart storage|The heart count)/.test(error.message)) throw error;
      throw new Error('Couldn’t reach the heart count. Please try again.');
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', onAbort);
    }
  };

  return {
    configured: checked.configured,
    provider: checked.provider,
    read: options => request(undefined, options),
    set: (liked, options) => typeof liked !== 'boolean'
      ? Promise.reject(new TypeError('Heart state must be true or false.'))
      : request(liked, options),
  };
}

export const getPortfolioHeartState = options => createPortfolioHeartsClient().read(options);
export const setPortfolioHeart = (liked, options) => createPortfolioHeartsClient().set(liked, options);
// END OF FILE: HEARTS-CLOUDFLARE-R5 | portfolioHearts.js
