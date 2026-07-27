# Contact form API

A tiny Express server that receives the website contact form and emails it to
`hello@dawnember.in` via **Zoho SMTP** (Nodemailer). No third-party service.

## 1. One-time setup

### a) Create a Zoho app password
The server logs in to your Zoho mailbox to send mail. Zoho requires an
**app-specific password** (your normal login password won't work):

1. Sign in to Zoho Mail → **Settings** (gear) → **Security** → **App Passwords**.
2. **Generate New Password**, name it e.g. `dawnember-website`.
3. Copy the generated password.

> Tip: confirm your account region. Accounts created on Zoho India use
> `smtp.zoho.in`; global accounts use `smtp.zoho.com`. Set `SMTP_HOST` to match.

### b) Fill in `.env`
Copy the template and paste your app password:

```bash
cp .env.example .env
# then edit .env → set SMTP_PASS to the app password from step (a)
```

`.env` is gitignored — never commit it.

## 2. Run it (local dev)

```bash
npm install          # if you haven't already
npm run dev:all      # runs the Vite site + this API together
```

- Site: http://localhost:5173
- API:  http://localhost:3001  (the site proxies `/api` → here automatically)

Or run them separately: `npm run dev` (site) and `npm run server` (API).

On start you should see `[contact-api] SMTP connection OK`. If instead you see
`SMTP verify failed`, the host/port/credentials are wrong.

## 3. Endpoints

| Method | Path            | Purpose                              |
|--------|-----------------|--------------------------------------|
| GET    | `/api/health`   | Liveness check → `{ ok: true }`      |
| POST   | `/api/contact`  | `{ name, email, phone, message }` → sends the email |

Built-in protections: input validation + length caps, a hidden **honeypot**
field, and **rate limiting** (5 requests / 10 min per IP).

## 4. Deploy (production)

The API is a standard Node process — host it on any free Node host
(Render, Railway, Fly.io, a small VPS, etc.):

1. Set the same env vars there (`SMTP_*`, `MAIL_TO`, `MAIL_FROM`, `PORT`).
2. Set `ALLOWED_ORIGIN` to your site origin(s), e.g.
   `https://dawnember.in,https://www.dawnember.in`.
3. Start with `npm run server` (or `node server/index.js`).

Then point the built site at it. If the API is on a **different origin** than
the site, set `VITE_API_BASE=https://your-api-host` before `npm run build`.
If you serve the API and site on the **same origin** (e.g. behind one reverse
proxy where `/api` routes to Node), leave `VITE_API_BASE` unset.