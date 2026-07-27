// Branded emails for the DawnEmber contact form:
//   • enquiryEmail   → the notification sent to the team (hello@)
//   • thankYouEmail  → the visitor auto-reply, rendered from the marketing
//     template in ./templates/thank-you.html with the two logos delivered as
//     inline CID attachments (so they render in Gmail/Outlook without hosting).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), 'templates');
const THANK_YOU_HTML = readFileSync(join(TEMPLATE_DIR, 'thank-you.html'), 'utf8');
const THANK_YOU_ATTACHMENTS = [
  { filename: 'logo-mark.png', path: join(TEMPLATE_DIR, 'logo-mark.png'), cid: 'logo-mark' },
  { filename: 'logo-badge.png', path: join(TEMPLATE_DIR, 'logo-badge.png'), cid: 'logo-badge' },
];

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
));
const nl2br = (s) => esc(s).replace(/\r?\n/g, '<br>');

// A single label/value row for the details table.
const row = (label, valueHtml) => `
  <tr>
    <td style="padding:11px 0;border-bottom:1px solid #EFE3D0;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;color:#9A8468;width:92px;vertical-align:top;">${label}</td>
    <td style="padding:11px 0;border-bottom:1px solid #EFE3D0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2A1D10;vertical-align:top;">${valueHtml}</td>
  </tr>`;

const pill = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#AD4F2E;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:999px;">${label}</a>`;

const quote = (html) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="border-left:3px solid #E6C8AC;padding:2px 0 2px 16px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:#2A1D10;">${html}</td>
  </tr></table>`;

// The shared branded shell: dark header (wordmark + tag), orange rule, the
// per-email content rows, then the outside sign-off line.
const wrap = ({ subject, preheader, tag, contentHtml }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F8ECE0;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F8ECE0;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8ECE0;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FBF5EA;border-radius:16px;overflow:hidden;box-shadow:0 14px 34px -14px rgba(80,50,20,0.28);">
        <tr><td style="background:#191919;padding:24px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:bold;color:#F8ECE0;letter-spacing:-0.5px;">Dawn<span style="color:#AD4F2E;">Ember</span></td>
            <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#AD4F2E;font-weight:bold;">${esc(tag)}</td>
          </tr></table>
        </td></tr>
        <tr><td style="height:4px;line-height:4px;font-size:0;background:#AD4F2E;">&nbsp;</td></tr>
        ${contentHtml}
      </table>
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
        <tr><td align="center" style="padding:18px 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#B49B78;">Made with &#9829; in Coimbatore &middot; &copy; ${new Date().getFullYear()} DawnEmber</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/** Team notification → sent to hello@ (MAIL_TO). */
export function enquiryEmail({ name, email, phone, message }) {
  const safeName = esc(name);
  const safeEmail = esc(email);
  const safePhone = esc(phone) || '&mdash;';
  const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  const subject = `New enquiry from ${name} — dawnember.in`;

  const text =
`New enquiry from the dawnember.in contact form
----------------------------------------------

Name:     ${name}
Email:    ${email}
Phone:    ${phone || '—'}
Received: ${when} IST

Message:
${message}

Reply directly to this email to respond to ${name}.`;

  const contentHtml = `
    <tr><td style="padding:30px 32px 6px;font-family:Georgia,'Times New Roman',serif;font-size:21px;color:#2A1D10;">You&rsquo;ve got a new message &#9749;</td></tr>
    <tr><td style="padding:0 32px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#7A6650;">Someone just reached out through the dawnember.in contact form.</td></tr>
    <tr><td style="padding:0 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${row('Name', safeName)}
        ${row('Email', `<a href="mailto:${safeEmail}" style="color:#AD4F2E;text-decoration:none;">${safeEmail}</a>`)}
        ${row('Phone', safePhone)}
        ${row('Received', `${when} IST`)}
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#AD4F2E;font-weight:bold;">Message</td></tr>
    <tr><td style="padding:0 32px 26px;">${quote(nl2br(message))}</td></tr>
    <tr><td style="padding:0 32px 34px;">${pill(`mailto:${safeEmail}?subject=${encodeURIComponent('Re: your enquiry to DawnEmber')}`, `Reply to ${safeName} &rarr;`)}</td></tr>
    <tr><td style="background:#F1E6D4;padding:18px 32px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#9A8468;">Sent automatically from the <a href="https://dawnember.in" style="color:#AD4F2E;text-decoration:none;">dawnember.in</a> contact form. Just hit reply to respond to ${safeName} directly.</td></tr>`;

  return { subject, text, html: wrap({ subject, preheader: `New enquiry from ${name} · ${email}`, tag: 'New enquiry', contentHtml }) };
}

/** Visitor auto-reply → the branded marketing template with the enquiry recap
    merged in, plus the two logos delivered as inline CID attachments. */
export function thankYouEmail({ name, email, message }) {
  const first = (name || '').trim().split(/\s+/)[0] || name || 'there';
  const vars = {
    first_name: esc(first),
    name: esc(name),
    email: esc(email),
    message: nl2br(message),
  };
  const html = THANK_YOU_HTML.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in vars ? vars[key] : ''));
  const subject = `We've got your message, ${first} ☕`;

  const text =
`Hi ${first},

Thanks for writing in — your message landed safely in our inbox. We read every
one ourselves, so give us a day or two to brew a proper reply.

What you sent us
  Name:    ${name}
  Email:   ${email}
  Message: ${message}

What happens next
  1. We read it properly — Anbu or Aswin looks over the details.
  2. You'll hear back directly at ${email}, usually within 1–2 business days.

See our work meanwhile: https://dawnember.in/work

Talk soon,
Anbu & Aswin
DawnEmber · Coimbatore

(You're receiving this because you sent us a message at dawnember.in.)`;

  return { subject, text, html, attachments: THANK_YOU_ATTACHMENTS };
}