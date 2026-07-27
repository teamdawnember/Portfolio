import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { enquiryEmail, thankYouEmail } from './emailTemplate.js';

const {
  PORT = 3001,
  SMTP_HOST = 'smtp.zoho.in',
  SMTP_PORT = 465,
  SMTP_SECURE = 'true',
  SMTP_USER,
  SMTP_PASS,
  MAIL_TO = 'hello@dawnember.in',
  MAIL_FROM,
  ALLOWED_ORIGIN = '',
} = process.env;

if (!SMTP_USER || !SMTP_PASS) {
  console.warn(
    '\n[contact-api] SMTP_USER / SMTP_PASS are not set — sending will fail.\n' +
    '  → Copy .env.example to .env and fill in your Zoho mailbox + app password.\n'
  );
}

const app = express();
app.set('trust proxy', 1); // needed for correct client IPs behind a proxy/host
app.use(express.json({ limit: '20kb' }));

// CORS — restrict to configured origins in production (comma-separated).
// Left blank in dev, where the frontend reaches /api via the Vite proxy
// (same-origin, so no CORS preflight is involved).
const allowed = ALLOWED_ORIGIN.split(',').map(s => s.trim()).filter(Boolean);
app.use(cors(allowed.length ? { origin: allowed } : undefined));

// Basic abuse protection: cap submissions per IP.
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: 'Too many messages — please wait a bit and try again.' },
});

// One pooled transporter, reused across requests.
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE) === 'true', // true → 465 (SSL); false → 587 (STARTTLS)
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Verify the connection once at startup so misconfig is obvious immediately.
transporter.verify()
  .then(() => console.log('[contact-api] SMTP connection OK —', SMTP_HOST))
  .catch(err => console.warn('[contact-api] SMTP verify failed:', err.message));

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const clean = (v, max) => String(v ?? '').trim().slice(0, max);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/contact', limiter, async (req, res) => {
  try {
    // Honeypot: a hidden field real users never see. If it's filled, it's a bot.
    if (clean(req.body.company, 100)) return res.json({ ok: true }); // silently accept + drop

    const name = clean(req.body.name, 120);
    const email = clean(req.body.email, 200);
    const phone = clean(req.body.phone, 40);
    const message = clean(req.body.message, 5000);

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Name, email and message are required.' });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }

    // 1) Notify the team (critical path). Zoho requires the From address to be
    //    the authenticated mailbox; the visitor's address goes in Reply-To.
    const notify = enquiryEmail({ name, email, phone, message });
    await transporter.sendMail({
      from: MAIL_FROM || `"DawnEmber Website" <${SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: `"${name}" <${email}>`,
      subject: notify.subject,
      text: notify.text,
      html: notify.html,
    });

    // 2) Auto-reply a branded thank-you to the address the visitor typed.
    //    Best-effort: a failure here must NOT fail the request — the team was
    //    already notified above, which is what actually matters.
    try {
      const reply = thankYouEmail({ name, email, message });
      await transporter.sendMail({
        from: MAIL_FROM || `"DawnEmber" <${SMTP_USER}>`,
        to: email,
        replyTo: MAIL_TO,
        subject: reply.subject,
        text: reply.text,
        html: reply.html,
        attachments: reply.attachments,
      });
    } catch (replyErr) {
      console.warn('[contact-api] thank-you auto-reply failed (non-fatal):', replyErr.message);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('[contact-api] send failed:', err);
    res.status(500).json({ ok: false, error: 'Could not send your message. Please try again, or email us directly.' });
  }
});

app.listen(Number(PORT), () => {
  console.log(`[contact-api] listening on http://localhost:${PORT}`);
});