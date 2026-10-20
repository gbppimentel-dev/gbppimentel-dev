// CHANGE VERSION: HEARTS-PAGES-R1 | 2026-10-20 | Anonymous shared portfolio hearts
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

function validateConfig(url, key) {
  url = String(url ?? '').trim().replace(/\/+$/, '');
  key = String(key ?? '').trim();
  if (!url || !key) return { configured: false, url, key: '', reason: 'Heart storage is not configured yet.' };
  try {
    const parsed = new URL(url);
    const local = ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname);
    if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/' || (parsed.protocol !== 'https:' && !(local && parsed.protocol === 'http:'))) throw new Error();
  } catch { return { configured: false, url: '', key: '', reason: 'Check the Supabase project URL.' }; }
  if (!key.startsWith('sb_publishable_') && !legacyAnonKey(key)) {
    return { configured: false, url, key: '', reason: 'Use a Supabase publishable key or legacy anon key, never a secret or service-role key.' };
  }
  return { configured: true, url, key };
}

/** Only public browser credentials belong in these Vite variables. */
export function getPortfolioHeartsConfig() {
  const env = import.meta.env ?? {};
  return validateConfig(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY);
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
  const checked = validateConfig(config.url, config.key);
  const fetchImpl = options.fetchImpl ?? ((...args) => globalThis.fetch(...args));
  const visitorId = () => getHeartVisitorId(options.storage === undefined ? browserStorage() : options.storage);

  const request = async (name, args, { signal } = {}) => {
    if (!checked.configured) throw new Error(checked.reason);
    const controller = new AbortController();
    const onAbort = () => controller.abort(signal?.reason);
    if (signal?.aborted) { onAbort(); throw signal.reason ?? new DOMException('Aborted', 'AbortError'); }
    signal?.addEventListener('abort', onAbort, { once: true });
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, REQUEST_TIMEOUT);
    const headers = { apikey: checked.key, 'Content-Type': 'application/json', Accept: 'application/json' };
    // New publishable keys are not JWTs: send them only in the apikey header.
    if (legacyAnonKey(checked.key)) headers.Authorization = `Bearer ${checked.key}`;
    try {
      const response = await fetchImpl(`${checked.url}/rest/v1/rpc/${name}`, {
        method: 'POST', headers, body: JSON.stringify(args), signal: controller.signal, cache: 'no-store', credentials: 'omit',
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
    read: options => request('portfolio_heart_state', { p_visitor_id: visitorId() }, options),
    set: (liked, options) => typeof liked !== 'boolean'
      ? Promise.reject(new TypeError('Heart state must be true or false.'))
      : request('set_portfolio_heart', { p_visitor_id: visitorId(), p_liked: liked }, options),
  };
}

export const getPortfolioHeartState = options => createPortfolioHeartsClient().read(options);
export const setPortfolioHeart = (liked, options) => createPortfolioHeartsClient().set(liked, options);
// END OF FILE: HEARTS-PAGES-R1 | portfolioHearts.js
