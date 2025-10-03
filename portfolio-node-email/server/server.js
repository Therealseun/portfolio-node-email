
// server/server.js
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const validator = require('validator');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5173;

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// JSON parsing
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));

// CORS (allow same-origin by default; if ORIGIN provided, allow it)
const origin = process.env.ORIGIN || `http://localhost:${PORT}`;
app.use(cors({
  origin,
  methods: ['POST', 'GET'],
}));

// Rate limiting for contact endpoint
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { ok: false, error: 'Too many requests, please try again later.' },
});
app.use('/api/contact', limiter);

// Serve static frontend
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

// Email transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Use Gmail App Password
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'All fields are required.' });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (!validator.isLength(message, { min: 10, max: 2000 })) {
      return res.status(400).json({ ok: false, error: 'Message must be between 10 and 2000 characters.' });
    }

    const to = process.env.TO_EMAIL || process.env.GMAIL_USER;
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${validator.escape(name)} &lt;${validator.escape(email)}&gt;</p>
             <p>${validator.escape(message).replace(/\\n/g, '<br>')}</p>`
    };

    await transporter.sendMail(mailOptions);

    // Optional: auto-reply to sender
    const reply = {
      from: `"${to}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'We received your message',
      text: `Hi ${name},\n\nThanks for reaching out! This is to confirm we've received your message and will get back to you shortly.\n\n— Oluwasegun Daniel Osawore`,
    };
    transporter.sendMail(reply).catch(() => {}); // Fire-and-forget

    res.json({ ok: true, message: 'Your message has been sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to send message. Please try again later.' });
  }
});

// Fallback to index.html for SPA-like routing
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
