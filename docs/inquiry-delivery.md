# Inquiry delivery

The form has real validation and submission handling. Its local preview and public delivery modes are deliberately separate.

## Local preview

`inquiryDevPlugin()` in the Vite configuration accepts same-origin loopback requests at `/api/inquiries` and appends successful inquiries to `.local/inquiries.ndjson`. The directory is ignored by Git. Successful responses include the saved request ID; repeated requests with that ID do not create another record. There is no public read endpoint and no email is sent. The form explains this before submission and in its receipt.

The local inbox is limited to five valid submissions per minute per local address and stops accepting new records if its file exceeds 10 MB. Invalid forms, oversized requests, malformed JSON, external origins, and the honeypot do not create records. Delete local test records only after reviewing them; real inquiries can contain personal information.

## Public email delivery

No recipient or mail-provider secret was present in this repository. Production submission therefore stays unavailable until a real delivery endpoint is configured. The form retains a direct LinkedIn alternative and never reports an unsent inquiry as delivered.

`cloudflare/inquiries/src/index.js` is a Cloudflare Worker that validates the same fields and forwards plain-text inquiries through Resend. It returns success only after the provider accepts the message and supplies a receipt. The visitor's email is the reply-to address; the destination is a server-side setting, never an input supplied by a visitor. Retries use a stable provider idempotency key. CORS is restricted to configured portfolio origins, and the Worker uses a Cloudflare rate-limit binding.

To connect it:

1. Configure a verified sending domain in Resend and obtain a sending API key.
2. Set the Worker secrets with Wrangler, using `--config cloudflare/inquiries/wrangler.json`: `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL` (a verified sender), and `INQUIRY_TO_EMAIL` (the owner's chosen inbox). Do not put these in `VITE_` variables, frontend files, or Git.
3. Set `ALLOWED_ORIGINS` in the Worker configuration to the exact portfolio origin(s), separated by commas. The default is the existing GitHub Pages account origin. The rate-limit namespace `731205` is distinct from the older hearts Worker; change it if it is already in use on your Cloudflare account.
4. Deploy that Worker with Wrangler. No deployment or external email test was performed during this local update.
5. Set the public build variable `VITE_INQUIRY_API_URL` to the full endpoint, such as `https://YOUR-WORKER.workers.dev/api/inquiries`. For GitHub Pages, add the repository Actions variable with that name; the workflow now passes it into the build. Rebuild the frontend.
6. Verify delivery using a deliberate test inquiry addressed to the configured owner's inbox. Provider acceptance confirms submission, not that a human has read the message.

The Worker accepts only job, project, or commission inquiries, rejects the honeypot, caps request/field sizes, and limits submissions to five per minute per address at each Cloudflare location. It has no attachments, public inbox listing, client-side secrets, or automatic replies to arbitrary addresses. Rate limiting is an abuse bound, not a guarantee against distributed spam.

References: [Cloudflare Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/), [Cloudflare rate-limit bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/), and [Resend idempotency](https://resend.com/blog/engineering-idempotency-keys).
