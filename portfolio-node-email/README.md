
# Portfolio (Node.js + Gmail SMTP)

A responsive portfolio site with a functional backend contact form that sends messages directly to your email via **Gmail SMTP**.

## Features
- Modern, responsive one-page portfolio (Home, About, Projects, Contact)
- Contact form posts to `/api/contact` and emails the details to your inbox
- Input validation, basic rate limiting, and security headers
- Environment-based configuration using `.env`

## Quick Start

### 1) Prerequisites
- Node.js 18+ installed
- A Gmail account with **2-Step Verification** enabled
- A **Gmail App Password** (not your normal password)
  - Google Account → Security → 2-Step Verification → App passwords → Create app ("Mail" on "Other") → Copy the 16-character password

### 2) Clone or unzip this project
```
cd portfolio-node-email
```

### 3) Install dependencies
```
npm install
```

### 4) Configure environment
Create a `.env` file in the project root using `.env.example` as a guide:
```
GMAIL_USER=yourgmail@gmail.com
GMAIL_PASS=your_16_char_app_password
TO_EMAIL=your_destination_email@example.com
PORT=5173
ORIGIN=http://localhost:5173
```

> `TO_EMAIL` is where you want to receive messages. You can set it to the same as `GMAIL_USER`.

### 5) Run
```
npm run dev
```
Open: `http://localhost:5173`

### Deploying
- You can deploy the Node server to services like Render, Railway, Fly.io, or a VPS.
- Set environment variables on the platform.
- If serving `public/` from Express, you'll have a single origin. Otherwise, set `ORIGIN` to your frontend URL for CORS.

## Tech
- Frontend: HTML, CSS, vanilla JS
- Backend: Node.js, Express, Nodemailer (Gmail SMTP)
- Extras: Helmet, express-rate-limit, validator, dotenv

## Customize
- Edit `public/index.html`, `public/styles.css`, and `public/script.js` to change content and styling.
- Replace images in `public/assets/images/` with your own.

## License
MIT
