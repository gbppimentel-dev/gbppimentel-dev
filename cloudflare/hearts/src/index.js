// CHANGE VERSION: HEARTS-CLOUDFLARE-R5 | Anonymous portfolio hearts on Workers and D1
// This is a lightweight browser-ID appreciation counter, not authenticated voting.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BODY_LIMIT = 1024;
const STATE_SQL = `SELECT EXISTS (
  SELECT 1 FROM portfolio_hearts WHERE visitor_id = ?1
) AS liked, count FROM heart_totals WHERE id = 1`;

class RequestError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function allowedOrigin(request, env) {
  const value = request.headers.get('Origin');
  if (!value || value === 'null') return null;
  try {
    const url = new URL(value);
    if (url.origin !== value || url.username || url.password) return null;
    const configured = String(env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);
    if (configured.includes(value)) return value;
    if (String(env.ALLOW_LOCALHOST) === 'true' && url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return value;
  } catch { /* Invalid origins never receive CORS permission. */ }
  return null;
}

function headersFor(origin) {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Origin',
  });
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Access-Control-Max-Age', '86400');
  }
  return headers;
}

function json(value, status, origin, extra) {
  const headers = headersFor(origin);
  for (const [name, value] of Object.entries(extra || {})) headers.set(name, value);
  return new Response(JSON.stringify(value), { status, headers });
}

function visitorId(value) {
  if (typeof value !== 'string' || !UUID.test(value)) throw new RequestError(400, 'A valid browser identifier is required.');
  return value.toLowerCase();
}

function state(row) {
  if (!row || ![0, 1].includes(row.liked) || !Number.isSafeInteger(row.count) || row.count < 0) throw new Error('Invalid stored heart state');
  return { liked: row.liked === 1, count: row.count };
}

async function bodyJson(request) {
  const declared = request.headers.get('Content-Length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > BODY_LIMIT)) throw new RequestError(413, 'The request is too large.');
  if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new RequestError(415, 'Send the request as JSON.');
  if (!request.body) throw new RequestError(400, 'A JSON request body is required.');
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > BODY_LIMIT) {
        await reader.cancel();
        throw new RequestError(413, 'The request is too large.');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const combined = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.byteLength; }
  try {
    const value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(combined));
    if (!value || Array.isArray(value) || typeof value !== 'object' || Object.keys(value).some(key => !['visitor_id', 'liked'].includes(key))) throw new Error();
    return value;
  } catch { throw new RequestError(400, 'Send a valid heart state.'); }
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    const url = new URL(request.url);
    try {
      if (url.pathname === '/health') {
        if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405, origin, { Allow: 'GET' });
        const row = await env.DB.prepare('SELECT count, (SELECT visitor_id FROM portfolio_hearts LIMIT 1) AS probe FROM heart_totals WHERE id = 1').first();
        if (!row || !Number.isSafeInteger(row.count) || row.count < 0 || !env.HEART_WRITE_LIMITER?.limit) throw new Error('Heart storage is not ready');
        return json({ ok: true, service: 'portfolio-hearts', schemaVersion: 1 }, 200, origin);
      }
      if (url.pathname !== '/api/hearts') return json({ error: 'Not found.' }, 404, origin);
      // CORS narrows browser access; anonymous visitor IDs do not authenticate a person.
      if (!origin) return json({ error: 'This origin is not allowed.' }, 403, null);
      if (request.method === 'OPTIONS') {
        const method = request.headers.get('Access-Control-Request-Method');
        const requestedHeaders = String(request.headers.get('Access-Control-Request-Headers') || '').split(',').map(value => value.trim().toLowerCase()).filter(Boolean);
        if (!['GET', 'PUT'].includes(method) || requestedHeaders.some(name => name !== 'content-type')) return json({ error: 'This request is not allowed.' }, 403, origin);
        return new Response(null, { status: 204, headers: headersFor(origin) });
      }
      if (request.method === 'GET') {
        if ([...url.searchParams.keys()].some(key => key !== 'visitor_id') || url.searchParams.getAll('visitor_id').length !== 1) throw new RequestError(400, 'A valid browser identifier is required.');
        const id = visitorId(url.searchParams.get('visitor_id'));
        return json(state(await env.DB.prepare(STATE_SQL).bind(id).first()), 200, origin);
      }
      if (request.method !== 'PUT') return json({ error: 'Method not allowed.' }, 405, origin, { Allow: 'GET, PUT, OPTIONS' });
      if (url.search) throw new RequestError(400, 'Send the heart state in the request body.');
      const body = await bodyJson(request);
      const id = visitorId(body.visitor_id);
      if (typeof body.liked !== 'boolean') throw new RequestError(400, 'Heart state must be true or false.');
      // Cloudflare's limiter is shared across isolates in each location. No IPs
      // are stored, and human clicks are far below the per-browser limit.
      const result = await env.HEART_WRITE_LIMITER.limit({ key: 'heart:' + id });
      if (!result.success) return json({ error: 'Please wait a moment before changing your heart again.' }, 429, origin, { 'Retry-After': '60' });
      const mutation = body.liked
        ? env.DB.prepare('INSERT OR IGNORE INTO portfolio_hearts (visitor_id) VALUES (?1)').bind(id)
        : env.DB.prepare('DELETE FROM portfolio_hearts WHERE visitor_id = ?1').bind(id);
      // D1 executes this batch as a transaction. Repeated true/false requests
      // cannot create duplicate hearts or decrement another visitor's heart.
      const results = await env.DB.batch([mutation, env.DB.prepare(STATE_SQL).bind(id)]);
      return json(state(results[1]?.results?.[0]), 200, origin);
    } catch (error) {
      return error instanceof RequestError
        ? json({ error: error.message }, error.status, origin)
        : json({ error: 'Heart storage is unavailable right now. Please try again.' }, 503, origin);
    }
  },
};
// END OF FILE: HEARTS-CLOUDFLARE-R5
