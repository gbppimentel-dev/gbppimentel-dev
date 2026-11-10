import { INQUIRY_BODY_LIMIT, INQUIRY_TYPES, isEmail, validateInquiry, inquiryEmailText } from '../../../src/utils/inquiries.js';

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const allowedOrigin = (request, env) => {
  const origin = request.headers.get('Origin');
  return String(env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).includes(origin) ? origin : null;
};
const reply = (origin, status, value, extra = {}) => new Response(value === null ? null : JSON.stringify(value), { status, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', Vary: 'Origin',
  ...(origin ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } : {}), ...extra,
} });

export async function handleInquiryRequest(request, env, { fetcher = fetch } = {}) {
  const origin = allowedOrigin(request, env);
  if (!origin) return reply(null, 403, { error: 'This inquiry could not be processed.' });
  if (new URL(request.url).pathname !== '/api/inquiries') return reply(origin, 404, { error: 'Not found.' });
  if (request.method === 'OPTIONS') return reply(origin, 204, null);
  if (request.method !== 'POST') return reply(origin, 405, { error: 'Use POST to submit an inquiry.' });
  if (!env.RESEND_API_KEY || !isEmail(env.INQUIRY_TO_EMAIL) || !env.INQUIRY_FROM_EMAIL || /[\r\n]/.test(env.INQUIRY_FROM_EMAIL) || !env.INQUIRY_RATE_LIMITER) {
    return reply(origin, 503, { error: 'Online inquiries are not available right now. Please use LinkedIn to get in touch.' });
  }
  if (!String(request.headers.get('Content-Type')).startsWith('application/json')) return reply(origin, 415, { error: 'Use a JSON inquiry.' });
  const contentLength = Number(request.headers.get('Content-Length'));
  if (contentLength > INQUIRY_BODY_LIMIT) return reply(origin, 413, { error: 'This inquiry is too long.' });
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(origin, 400, { error: 'Your inquiry is empty.' });
    let size = 0;
    const chunks = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > INQUIRY_BODY_LIMIT) { await reader.cancel(); return reply(origin, 413, { error: 'This inquiry is too long.' }); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.length; });
    let payload;
    try { payload = JSON.parse(new TextDecoder().decode(bytes)); }
    catch { return reply(origin, 400, { error: 'This inquiry could not be read.' }); }
    const checked = validateInquiry(payload);
    if (!checked.valid) return reply(origin, 422, { error: 'Please check your inquiry.', errors: checked.errors });
    if (!ID.test(payload.requestId || '')) return reply(origin, 400, { error: 'This inquiry needs a valid request identifier.' });
    const limited = await env.INQUIRY_RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' });
    if (!limited.success) return reply(origin, 429, { error: 'Please wait a minute before sending another inquiry.' }, { 'Retry-After': '60' });
    const type = INQUIRY_TYPES.find(item => item.value === checked.value.type).label;
    const delivered = await fetcher('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(12_000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `portfolio-inquiry/${payload.requestId}` },
      body: JSON.stringify({ from: env.INQUIRY_FROM_EMAIL, to: [env.INQUIRY_TO_EMAIL], reply_to: checked.value.email,
        subject: `Portfolio inquiry · ${type}`, text: inquiryEmailText(checked.value) }),
    });
    if (!delivered.ok) return reply(origin, 502, { error: 'Your inquiry could not be delivered. Please retry or use LinkedIn.' });
    const receipt = await delivered.json();
    if (!receipt.id) return reply(origin, 502, { error: 'Delivery could not be confirmed. Please retry or use LinkedIn.' });
    return reply(origin, 201, { ok: true, mode: 'email', id: payload.requestId });
  } catch { return reply(origin, 503, { error: 'Your inquiry could not be delivered. Please retry or use LinkedIn.' }); }
}

export default { fetch: handleInquiryRequest };
