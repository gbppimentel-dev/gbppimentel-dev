import { useEffect, useId, useRef, useState } from 'react';
import { INQUIRY_TYPES, validateInquiry } from '../utils/inquiries';

const configuredEndpoint = String(import.meta.env.VITE_INQUIRY_API_URL || '').trim();
const localPreview = import.meta.env.DEV && !configuredEndpoint;
const endpoint = configuredEndpoint || (localPreview ? new URL('api/inquiries', document.baseURI).href : '');
const briefGuides = {
  job: {
    caption: 'Role + team', label: 'Role & team',
    placeholder: 'Our product team needs a frontend developer to improve a customer dashboard…',
    help: 'The role, the team, and the work ahead. A rough brief is fine.',
    outline: 'Role / team:\nWhat we’re working on:\nExperience we’re looking for:\nLocation / working setup:',
    budgetLabel: 'Compensation range', budgetPlaceholder: 'A range or let’s discuss',
    timelineLabel: 'Start date', timelinePlaceholder: 'An ideal start date or flexible',
  },
  project: {
    caption: 'Product + workflow', label: 'Project brief',
    placeholder: 'I need a web app for community event sign-ups. Today we use a spreadsheet…',
    help: 'Start with the problem, who it’s for, and the result you want.',
    outline: 'What I want to build:\nWho it’s for:\nThe problem it should solve:\nWhat already exists:',
    budgetLabel: 'Project budget', budgetPlaceholder: 'An estimated range or let’s discuss',
    timelineLabel: 'Target timeline', timelinePlaceholder: 'A target date or flexible',
  },
  commission: {
    caption: 'A focused deliverable', label: 'Commission details',
    placeholder: 'I need a responsive landing page for a new service, with a clear sign-up flow…',
    help: 'The deliverable, its purpose, and any style or scope in mind.',
    outline: 'What I need:\nWhere it will be used:\nStyle / references:\nDeliverables / scope:',
    budgetLabel: 'Commission budget', budgetPlaceholder: 'An estimated range or let’s discuss',
    timelineLabel: 'Delivery date', timelinePlaceholder: 'When you need the finished work',
  },
};

function InquiryTypeIcon({ type }) {
  const paths = {
    job: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V4h8v3M3 12a20 20 0 0 0 18 0M12 11v4" /></>,
    project: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 13h4v4H7ZM14 13h3m-3 4h3" /></>,
    commission: <><path d="m4 16-1 5 5-1L20 8l-4-4ZM13 7l4 4" /><path d="m16 4 1-1a2.8 2.8 0 0 1 4 4l-1 1" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[type]}</svg>;
}

export default function ContactForm() {
  const id = useId();
  const form = useRef(null), briefInput = useRef(null), abort = useRef(null), mounted = useRef(true), attempt = useRef(null);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('project');
  const [details, setDetails] = useState('');
  const guide = briefGuides[type];
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; abort.current?.abort(); }; }, []);
  const errorId = name => `${id}-${name}-error`;
  const fieldProps = name => ({ 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': errors[name] ? errorId(name) : undefined });
  const fieldError = name => errors[name] && <span className="inquiry-field-error" id={errorId(name)}>{errors[name]}</span>;
  const addOutline = () => {
    if (state === 'sending' || details.trim()) return;
    setDetails(guide.outline);
    setErrors(current => ({ ...current, details: undefined }));
    briefInput.current?.focus();
  };

  const submit = async event => {
    event.preventDefault();
    if (state === 'sending' || !endpoint) return;
    const checked = validateInquiry(Object.fromEntries(new FormData(event.currentTarget)));
    if (Object.values(briefGuides).some(item => item.outline === checked.value.details)) {
      checked.errors.details = 'Add your own details to the outline before sending.';
      checked.valid = false;
    }
    setErrors(checked.errors);
    setMessage('');
    if (!checked.valid) {
      setState('invalid');
      form.current.querySelector(`[name="${Object.keys(checked.errors).find(key => key !== 'form') || 'name'}"]`)?.focus();
      return;
    }
    const key = JSON.stringify(checked.value);
    if (attempt.current?.key !== key) attempt.current = { key, id: crypto.randomUUID() };
    const controller = new AbortController();
    abort.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    setState('sending');
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: controller.signal, body: JSON.stringify({ ...checked.value, requestId: attempt.current.id }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok || !['local', 'email'].includes(result.mode)) {
        if (mounted.current) setErrors(result.errors || {});
        throw new Error(result.error || 'Your inquiry could not be delivered. Please retry or use LinkedIn.');
      }
      if (!mounted.current) return;
      setReceipt(result);
      setState('sent');
      form.current.reset();
      setDetails('');
      attempt.current = null;
    } catch (error) {
      if (!mounted.current) return;
      setState('error');
      setMessage(error.name === 'AbortError' ? 'Delivery took too long to confirm. Your details are still here; retry or use LinkedIn.' : error.message);
    } finally { window.clearTimeout(timeout); if (abort.current === controller) abort.current = null; }
  };

  return <div className="inquiry-compose">
    <div className="inquiry-compose__bar"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg><span>Your collaboration brief</span><span className="inquiry-compose__context">Let’s talk.</span></div>
    <form ref={form} className="inquiry-form" onSubmit={submit} noValidate aria-label="Send Glenn an inquiry" aria-busy={state === 'sending'}>
      {state === 'sent' ? <div className="inquiry-success" role="status">
        <span className="inquiry-success__mark" aria-hidden="true">✓</span>
        <h3>{receipt.mode === 'local' ? 'Saved to the preview inbox.' : 'Your inquiry is on its way.'}</h3>
        <p>{receipt.mode === 'local' ? 'This preview saved your inquiry on this computer. No email was sent.' : 'Thanks for reaching out. Glenn can reply using the email you provided.'}</p>
        <button type="button" onClick={() => { setState('idle'); setReceipt(null); setType('project'); setDetails(''); setErrors({}); setMessage(''); }}>Write another inquiry <span aria-hidden="true">↗</span></button>
      </div> : <>
        <fieldset className="inquiry-type" disabled={state === 'sending'} aria-describedby={errors.type ? errorId('type') : undefined}>
          <legend>I’m reaching out about</legend>
          <div>{INQUIRY_TYPES.map(item => <label key={item.value}><input type="radio" name="type" value={item.value} checked={type === item.value} onChange={() => setType(item.value)} /><span><InquiryTypeIcon type={item.value} /><span className="inquiry-type__copy"><strong>{item.label}</strong><small aria-hidden="true">{briefGuides[item.value].caption}</small></span><span className="inquiry-type__check" aria-hidden="true">✓</span></span></label>)}</div>
          {fieldError('type')}
        </fieldset>
        <fieldset className="inquiry-contact-fields" disabled={state === 'sending'}><legend>Your contact details</legend><div className="inquiry-form__row">
          <label htmlFor={`${id}-name`}>Your name<input id={`${id}-name`} name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="Name or company" disabled={state === 'sending'} {...fieldProps('name')} />{fieldError('name')}</label>
          <label htmlFor={`${id}-email`}>Email address<input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" disabled={state === 'sending'} {...fieldProps('email')} />{fieldError('email')}</label>
        </div></fieldset>
        <div className="inquiry-details">
          <div className="inquiry-details__heading"><label htmlFor={`${id}-details`}>{guide.label}</label><span className="inquiry-details__count" aria-hidden="true">{details.length.toLocaleString()} / 4,000</span></div>
          <textarea ref={briefInput} id={`${id}-details`} name="details" value={details} onChange={event => setDetails(event.target.value)} required minLength={20} maxLength={4000} rows={3} placeholder={guide.placeholder} disabled={state === 'sending'} {...fieldProps('details')} aria-describedby={[`${id}-brief-help`, errors.details && errorId('details')].filter(Boolean).join(' ')} />
          <div className="inquiry-details__tools"><p id={`${id}-brief-help`}>{guide.help}</p><button type="button" className="inquiry-outline" onClick={addOutline} disabled={state === 'sending' || Boolean(details.trim())} title={details.trim() ? 'An outline can be added to an empty brief. Your writing stays intact.' : 'Adds editable prompts to the empty brief; nothing is sent.'}><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 5h10M5 10h10M5 15h6M2 5h.01M2 10h.01M2 15h.01" /></svg>Use brief outline</button></div>
          {fieldError('details')}
        </div>
        <details className="inquiry-options"><summary>Budget &amp; timeline <span>(optional)</span></summary><div className="inquiry-form__row">
          <label htmlFor={`${id}-budget`}>{guide.budgetLabel}<input id={`${id}-budget`} name="budget" maxLength={80} placeholder={guide.budgetPlaceholder} disabled={state === 'sending'} {...fieldProps('budget')} />{fieldError('budget')}</label>
          <label htmlFor={`${id}-timeline`}>{guide.timelineLabel}<input id={`${id}-timeline`} name="timeline" maxLength={80} placeholder={guide.timelinePlaceholder} disabled={state === 'sending'} {...fieldProps('timeline')} />{fieldError('timeline')}</label>
        </div></details>
        <div className="inquiry-honeypot" aria-hidden="true"><label htmlFor={`${id}-website`}>Website<input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="inquiry-form__submit"><p>{localPreview ? 'Local preview: saves on this computer; no email is sent.' : !endpoint ? 'Online submissions are being connected. Please use LinkedIn for now.' : 'Your details are used only to respond to this inquiry.'}</p><button type="submit" disabled={state === 'sending' || !endpoint}><span>{state === 'sending' ? 'Sending…' : 'Send inquiry'}</span><span className="inquiry-submit-icon"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></span></button></div>
        <div className="inquiry-form__status" role={state === 'error' || state === 'invalid' ? 'alert' : 'status'} aria-live="polite">{state === 'sending' ? 'Submitting your inquiry…' : message || errors.form || (state === 'invalid' ? 'Please check the highlighted fields.' : '')}</div>
      </>}
    </form>
  </div>;
}
