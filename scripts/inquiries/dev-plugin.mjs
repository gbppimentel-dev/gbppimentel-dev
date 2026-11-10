import { appendFile, mkdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { INQUIRY_BODY_LIMIT, validateInquiry } from '../../src/utils/inquiries.js';

const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WINDOW = 60_000;

// Development only: an actual disk-backed inbox, never an email delivery claim.
export function inquiryDevPlugin() {
  let root, base = '/';
  const recent = new Map();
  let writing = Promise.resolve();
  return {
    name: 'portfolio-local-inquiries',
    apply: 'serve',
    configResolved(config) { root = config.root; base = config.base.startsWith('/') ? config.base : '/'; },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname;
        if (![`${base}api/inquiries`, '/api/inquiries'].includes(pathname)) return next();
        const respond = (status, data) => {
          response.statusCode = status;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.setHeader('X-Content-Type-Options', 'nosniff');
          response.end(JSON.stringify(data));
        };
        if (request.method !== 'POST') return respond(405, { error: 'Use POST to submit an inquiry.' });
        const origin = request.headers.origin;
        const host = request.headers.host;
        let permitted = false;
        try {
          const site = new URL(origin);
          permitted = site.host === host && ['localhost', '127.0.0.1', '[::1]'].includes(site.hostname) && ['http:', 'https:'].includes(site.protocol);
        } catch { /* Malformed origins are rejected before reading a body. */ }
        if (!permitted) return respond(403, { error: 'This inquiry could not be processed.' });
        if (!String(request.headers['content-type']).startsWith('application/json')) return respond(415, { error: 'Use a JSON inquiry.' });
        if (Number(request.headers['content-length']) > INQUIRY_BODY_LIMIT) return respond(413, { error: 'This inquiry is too long.' });
        try {
          let size = 0;
          const parts = [];
          for await (const chunk of request) {
            size += chunk.length;
            if (size > INQUIRY_BODY_LIMIT) return respond(413, { error: 'This inquiry is too long.' });
            parts.push(chunk);
          }
          let payload;
          try { payload = JSON.parse(Buffer.concat(parts).toString('utf8')); }
          catch { return respond(400, { error: 'This inquiry could not be read.' }); }
          const checked = validateInquiry(payload);
          if (!checked.valid) return respond(422, { error: 'Please check your inquiry.', errors: checked.errors });
          if (!ID.test(payload.requestId || '')) return respond(400, { error: 'This inquiry needs a valid request identifier.' });
          const ip = request.socket.remoteAddress || 'local';
          const now = Date.now();
          const attempts = (recent.get(ip) || []).filter(time => now - time < WINDOW);
          if (attempts.length >= 5) { response.setHeader('Retry-After', '60'); return respond(429, { error: 'Please wait a minute before sending another inquiry.' }); }
          attempts.push(now); recent.set(ip, attempts);
          const inbox = resolve(root, '.local', 'inquiries.ndjson');
          const record = { id: payload.requestId, receivedAt: new Date().toISOString(), ...checked.value };
          delete record.website;
          const operation = writing.catch(() => {}).then(async () => {
            await mkdir(resolve(root, '.local'), { recursive: true });
            let existing = '';
            try {
              const file = await stat(inbox);
              if (file.size > 10_000_000) throw new Error('Inbox capacity reached');
              existing = await readFile(inbox, 'utf8');
            } catch (error) { if (error.code !== 'ENOENT') throw error; }
            const stored = existing.split('\n').map(line => { try { return JSON.parse(line); } catch { return null; } }).find(item => item?.id === record.id);
            if (stored && Object.entries(record).some(([key, value]) => key !== 'receivedAt' && stored[key] !== value)) {
              const conflict = new Error('Inquiry request changed');
              conflict.code = 'INQUIRY_CONFLICT';
              throw conflict;
            }
            if (!stored) {
              await appendFile(inbox, JSON.stringify(record) + '\n', { mode: 0o600 });
            }
          });
          writing = operation;
          await operation;
          respond(201, { ok: true, mode: 'local', id: record.id });
        } catch (error) {
          if (error.code === 'INQUIRY_CONFLICT') return respond(409, { error: 'This request already saved a different inquiry. Please start a new inquiry.' });
          respond(503, { error: 'The local inbox is unavailable. Your inquiry has not been saved.' });
        }
      });
    },
  };
}
