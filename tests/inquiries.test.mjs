import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { mkdtemp, readFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateInquiry, INQUIRY_BODY_LIMIT } from '../src/utils/inquiries.js';
import { handleInquiryRequest } from '../cloudflare/inquiries/src/index.js';
import { inquiryDevPlugin } from '../scripts/inquiries/dev-plugin.mjs';

const example = () => ({ name: 'Preview Tester', email: 'preview@example.com', type: 'project', details: 'Synthetic test inquiry for the portfolio contact form.', budget: '', timeline: '', website: '', requestId: randomUUID() });
const environment = () => ({ ALLOWED_ORIGINS: 'https://portfolio.example', RESEND_API_KEY: 'synthetic-key', INQUIRY_TO_EMAIL: 'owner@example.com', INQUIRY_FROM_EMAIL: 'sender@example.com', INQUIRY_RATE_LIMITER: { limit: async () => ({ success: true }) } });
const request = (payload, origin = 'https://portfolio.example') => new Request('https://worker.example/api/inquiries', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1' }, body: JSON.stringify(payload) });

test('inquiry validation bounds fields and rejects invalid or hidden submissions', () => {
  assert.equal(validateInquiry(example()).valid, true);
  for (const patch of [{ name: 'x' }, { email: 'bad\r\nreply@example.com' }, { type: 'arbitrary' }, { details: 'short' }, { details: 'x'.repeat(4001) }, { website: 'bot.example' }, { budget: 'x'.repeat(81) }]) {
    assert.equal(validateInquiry({ ...example(), ...patch }).valid, false);
  }
  assert.equal(validateInquiry(null).valid, false);
});

test('the Worker never acknowledges unconfigured, invalid, or failed delivery', async () => {
  let sends = 0;
  const fetcher = async () => { sends += 1; return new Response('{}', { status: 500 }); };
  assert.equal((await handleInquiryRequest(request(example()), {}, { fetcher })).status, 403);
  assert.equal((await handleInquiryRequest(request(example()), { ALLOWED_ORIGINS: 'https://portfolio.example' }, { fetcher })).status, 503);
  assert.equal((await handleInquiryRequest(request({ ...example(), details: '' }), environment(), { fetcher })).status, 422);
  assert.equal((await handleInquiryRequest(request({ ...example(), details: 'x'.repeat(INQUIRY_BODY_LIMIT) }), environment(), { fetcher })).status, 413);
  const limited = environment(); limited.INQUIRY_RATE_LIMITER.limit = async () => ({ success: false });
  assert.equal((await handleInquiryRequest(request(example()), limited, { fetcher })).status, 429);
  assert.equal(sends, 0);
  assert.equal((await handleInquiryRequest(request(example()), environment(), { fetcher })).status, 502);
  assert.equal(sends, 1);
});

test('provider acceptance uses fixed recipient, visitor reply-to, and stable retry key', async () => {
  const inquiry = { ...example(), to: 'untrusted@example.com', details: '<script>This remains plain text in the message.</script>' };
  let sent;
  const response = await handleInquiryRequest(request(inquiry), environment(), { fetcher: async (_, options) => { sent = options; return Response.json({ id: 'provider-receipt' }); } });
  assert.equal(response.status, 201);
  assert.deepEqual((await response.json()).mode, 'email');
  const body = JSON.parse(sent.body);
  assert.deepEqual(body.to, ['owner@example.com']);
  assert.equal(body.reply_to, inquiry.email);
  assert.equal(body.html, undefined);
  assert.match(body.text, /<script>/);
  assert.equal(sent.headers['Idempotency-Key'], `portfolio-inquiry/${inquiry.requestId}`);
});

test('the local endpoint persists real records once and rejects external origins', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'portfolio-inquiry-test-'));
  const plugin = inquiryDevPlugin();
  plugin.configResolved({ root: folder, base: '/' });
  let middleware;
  plugin.configureServer({ middlewares: { use: callback => { middleware = callback; } } });
  const server = createServer((req, res) => middleware(req, res, () => { res.writeHead(404); res.end(); }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    await unlink(join(folder, '.local', 'inquiries.ndjson'));
    await rmdir(join(folder, '.local'));
    await rmdir(folder);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const post = (payload, requestOrigin = origin) => fetch(`${origin}/api/inquiries`, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  assert.equal((await post(example(), 'https://external.example')).status, 403);
  const inquiry = example();
  assert.equal((await post(inquiry)).status, 201);
  assert.equal((await post(inquiry)).status, 201);
  const records = (await readFile(join(folder, '.local', 'inquiries.ndjson'), 'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(records.length, 1);
  assert.equal(records[0].id, inquiry.requestId);
  assert.equal(records[0].details, inquiry.details);
  assert.equal((await post({ ...inquiry, details: 'A changed inquiry must never pretend the old record contains it.' })).status, 409);
  for (let count = 0; count < 2; count += 1) assert.equal((await post(example())).status, 201);
  assert.equal((await post(example())).status, 429);
});
