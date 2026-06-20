# Contact API (Nodemailer)

A tiny Express service that receives contact-form submissions from
[itsavillanosa.com](https://itsavillanosa.com) and emails them to you via SMTP
using [Nodemailer](https://nodemailer.com).

The frontend is a static site hosted on GitHub Pages, which cannot run server
code — so this small backend must be deployed separately (Render, Railway,
Fly.io, a VPS, etc.).

## Run locally

```bash
cd backend
npm install
cp .env.example .env   # then fill in your SMTP credentials
npm run dev            # starts on http://localhost:3001
```

## Endpoints

- `GET  /health` — returns `{ ok: true }`
- `POST /api/contact` — body: `{ name, email, contactNo, budget, message }`

## SMTP setup (Gmail example)

1. Enable 2-Step Verification on the Google account.
2. Create an **App Password** (Google Account → Security → App passwords).
3. Put that 16-character password in `SMTP_PASS` and the address in `SMTP_USER`.

Any SMTP provider works (Zoho, Brevo, Mailgun, your domain host, etc.) — just
change `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE` accordingly.

## Connect the frontend

Set the API base URL in the frontend so the contact form posts here:

```bash
# frontend/.env
VITE_CONTACT_API_URL=https://your-deployed-api.example.com
```

When unset, the form falls back to opening the visitor's mail app (mailto).
