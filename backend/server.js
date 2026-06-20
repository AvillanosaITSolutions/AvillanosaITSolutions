import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'

const {
    PORT = 3001,
    SMTP_HOST,
    SMTP_PORT = 587,
    SMTP_SECURE = 'false',
    SMTP_USER,
    SMTP_PASS,
    MAIL_FROM,
    MAIL_TO = 'hello@itsavillanosa.com',
    ALLOWED_ORIGINS = 'https://itsavillanosa.com,http://localhost:5173',
} = process.env

const allowedOrigins = ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '10kb' }))
app.use(
    cors({
        origin(origin, callback) {
            // Allow same-origin / server-to-server requests (no Origin header) and whitelisted origins.
            if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
            return callback(new Error('Not allowed by CORS'))
        },
    }),
)

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'Too many requests. Please try again later.' },
})

// Build the transporter once and reuse it.
const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
})

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^09\d{9}$/

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/api/contact', limiter, async (req, res) => {
    try {
        const name = String(req.body?.name ?? '').trim()
        const email = String(req.body?.email ?? '').trim()
        const contactNo = String(req.body?.contactNo ?? '').trim()
        const budget = String(req.body?.budget ?? '').trim()
        const message = String(req.body?.message ?? '').trim()
        const honeypot = String(req.body?.company ?? '').trim() // bots tend to fill hidden fields

        if (honeypot) return res.json({ ok: true }) // silently drop spam

        if (!name || !email || !contactNo || !budget || !message) {
            return res.status(400).json({ ok: false, error: 'All fields are required.' })
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ ok: false, error: 'Invalid email address.' })
        }
        if (!PHONE_REGEX.test(contactNo)) {
            return res.status(400).json({ ok: false, error: 'Invalid PH mobile number.' })
        }

        await transporter.sendMail({
            from: MAIL_FROM || SMTP_USER,
            to: MAIL_TO,
            replyTo: `${name} <${email}>`,
            subject: `New Inquiry from ${name}`,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Contact No.: ${contactNo}`,
                `Budget: ${budget}`,
                '',
                'Message:',
                message,
            ].join('\n'),
            html: `
                <h2 style="margin:0 0 16px;font-family:sans-serif;color:#1e293b">New Inquiry from ${escapeHtml(name)}</h2>
                <table style="font-family:sans-serif;font-size:14px;color:#334155;border-collapse:collapse">
                    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td>${escapeHtml(name)}</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td>${escapeHtml(email)}</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Contact No.</td><td>${escapeHtml(contactNo)}</td></tr>
                    <tr><td style="padding:4px 12px 4px 0;color:#64748b">Budget</td><td>${escapeHtml(budget)}</td></tr>
                </table>
                <p style="font-family:sans-serif;font-size:14px;color:#334155;margin-top:16px;white-space:pre-wrap">${escapeHtml(message)}</p>
            `,
        })

        return res.json({ ok: true })
    } catch (error) {
        console.error('Failed to send contact email:', error)
        return res.status(500).json({ ok: false, error: 'Failed to send message. Please try again later.' })
    }
})

app.listen(PORT, () => {
    console.log(`Contact API listening on port ${PORT}`)
})
