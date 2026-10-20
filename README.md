# GK Portfolio: React website + Node backend

Frontend: React + Vite + Tailwind 3 + Framer Motion. Backend: Express (`server/`) that receives the contact form and
**emails every message to ghazanfaralikhan62@gmail.com**. Requires Node.js 20.19 or newer.

## 1. One-time setup: let the server send email

The server sends mail through your Gmail account using an **App Password** (not your normal password).

1. Google Account -> **Security** -> turn on **2-Step Verification**.
2. Google Account -> **Security** -> **App passwords** -> create one (name it "Portfolio") -> copy the 16 characters.
3. In this folder, copy `.env.example` to `.env` and paste the password:

       SMTP_PASS=abcd efgh ijkl mnop

`.env` is git-ignored. Never commit it or share it. Until `SMTP_PASS` is set the website still works, but the form
honestly answers "email service is not configured" (it never pretends a message was sent).

## 2. Run it

    npm install
    npm run dev           # website on http://localhost:5173 + API on http://localhost:8787 (the website forwards /api to the API)
                          # (npm run dev:web starts the website only; the contact form then cannot send)

When the API starts it checks the Gmail login and prints `SMTP login OK: ready to send email.` or the reason it failed.

**Production (one server does everything):**

    npm run build
    npm start             # serves the built website AND the API on http://localhost:8787 (set PORT to change)

## 3. Deploy

Any Node host works (Render, Railway, Fly.io, a VPS). Build command `npm install && npm run build`, start command `npm start`,
then add the variables from `.env.example` in the host's dashboard (never upload `.env`). Also set `TRUST_PROXY=1`
so rate limiting sees the real visitor IP. Because one server serves both site and API, no CORS setup is needed.
If you host the website elsewhere (e.g. Netlify) set `formEndpoint` in `src/data/site.js` to the full `https://` API URL
and `ALLOWED_ORIGIN` on the API to your website's address.

## How a message flows

form -> `POST /api/contact` -> validated -> emailed to `CONTACT_TO` (reply-to = the visitor) -> `{ ok: true }` only after
Gmail accepted it. Anything else (bad input, mail server down, rate limit) returns an error and the form shows it; the visitor's
text stays in the form so nothing is lost.

## Settings (`.env`)

| Variable | Default | Meaning |
|---|---|---|
| `SMTP_USER` / `SMTP_PASS` | none | Gmail address + App Password (required to send) |
| `CONTACT_TO` | ghazanfaralikhan62@gmail.com | where messages are delivered |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | smtp.gmail.com / 465 / true | other providers work too |
| `PORT` | 8787 | server port |
| `TRUST_PROXY` | off | set `1` behind a proxy/host |
| `RATE_MAX` / `RATE_WINDOW_MINUTES` | 5 / 15 | messages allowed per IP per window |
| `ALLOWED_ORIGIN` | none | only if the website is on another domain |

## Security built in
Input validation and length limits, 20 KB body limit, per-IP rate limiting, header-injection protection (CR/LF stripped, visitor
address only used as Reply-To), HTML-escaped emails, Helmet security headers with a Content-Security-Policy, no stack traces or
visitor data in logs, path-traversal-safe static serving, secrets only in environment variables.
`npm audit --omit=dev` reports 0 vulnerabilities. `npm audit` still lists 5 build-time advisories from Tailwind 3's dependency `braces`
(no patched release exists; they only run on your own files during the build).
For production also consider a CAPTCHA (e.g. Cloudflare Turnstile) if you ever receive spam.

## Tests

    npm test              # 22 backend tests: a fake mail server proves real delivery, injection/abuse protection, failures

## Customize the website (`src/data/site.js`)
Portrait, resume path, social links (replace each `YOUR_*_URL`), stats (hidden until `placeholder: false`), projects' `live`/`github` links.
# portfolio
# Portfolio
