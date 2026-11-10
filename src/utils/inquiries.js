export const INQUIRY_TYPES = [
  { value: 'job', label: 'Job opportunity' },
  { value: 'project', label: 'Project' },
  { value: 'commission', label: 'Commission' },
];
export const INQUIRY_BODY_LIMIT = 16_384;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = value => typeof value === 'string' && value.length <= 254 && emailPattern.test(value) && !/[\r\n]/.test(value);

export function validateInquiry(input = {}) {
  const fields = ['name', 'email', 'type', 'details', 'budget', 'timeline', 'website'];
  const value = Object.fromEntries(fields.map(field => [field, typeof input?.[field] === 'string' ? input[field].trim() : '']));
  const errors = {};
  if (value.name.length < 2 || value.name.length > 80 || /[\r\n]/.test(value.name)) errors.name = 'Please enter your name (2–80 characters).';
  if (!isEmail(value.email)) errors.email = 'Please enter a valid email address.';
  if (!INQUIRY_TYPES.some(type => type.value === value.type)) errors.type = 'Choose the kind of inquiry.';
  if (value.details.length < 20 || value.details.length > 4000) errors.details = 'Share a little more detail (20–4,000 characters).';
  if (value.budget.length > 80) errors.budget = 'Keep the budget under 80 characters.';
  if (value.timeline.length > 80) errors.timeline = 'Keep the timeline under 80 characters.';
  if (value.website) errors.form = 'This inquiry could not be processed. Please try again.';
  return { value, errors, valid: Object.keys(errors).length === 0 };
}

export function inquiryEmailText(inquiry) {
  const type = INQUIRY_TYPES.find(item => item.value === inquiry.type)?.label || 'Inquiry';
  return [
    `New portfolio inquiry: ${type}`, '',
    `Name: ${inquiry.name}`, `Reply to: ${inquiry.email}`,
    `Budget / compensation: ${inquiry.budget || 'Not specified'}`,
    `Timeline: ${inquiry.timeline || 'Not specified'}`, '',
    inquiry.details,
  ].join('\n');
}
