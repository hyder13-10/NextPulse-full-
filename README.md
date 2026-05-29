# NextPulse

**Your health, one pulse ahead.**

A modern, mobile-responsive health assistant web app built with React, Tailwind CSS, and client-side API integrations. No backend server required—all data persists in `localStorage`.

## Features

- **Dashboard** — Greeting, daily health tip, quick actions
- **Medicine Reminders** — Schedules, browser notifications, mark-as-taken
- **Fitness Tips** — Daily tips, step counter, weekly bar chart
- **AI Symptom Checker** — Text + image analysis (Gemini or OpenAI)
- **Nearby Doctor Finder** — Geolocation + Google Places
- **Mental Wellness** — Mood tracker, affirmations, breathing exercise, weekly chart
- **Emergency SOS** — Twilio SMS to up to 3 contacts with GPS coordinates

## Quick Start

1. **Install Node.js** (v18+) from [nodejs.org](https://nodejs.org/) if not already installed.

2. **Install dependencies:**

   ```bash
   cd C:\Users\Admin\Projects\nextpulse
   npm install
   ```

3. **Configure API keys** — copy `.env.example` to `.env`:

   ```bash
   copy .env.example .env
   ```

4. **Run the dev server:**

   ```bash
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini for symptom analysis (recommended) |
| `VITE_OPENAI_API_KEY` | OpenAI fallback for text/image analysis |
| `VITE_GOOGLE_MAPS_API_KEY` | Maps JavaScript API + Places (enable both in Google Cloud Console) |
| `VITE_TWILIO_ACCOUNT_SID` | Twilio account SID |
| `VITE_TWILIO_AUTH_TOKEN` | Twilio auth token |
| `VITE_TWILIO_FROM_NUMBER` | Twilio phone number (E.164 format, e.g. `+15551234567`) |
| `VITE_TWILIO_PROXY_URL` | Optional proxy URL if direct Twilio calls are blocked by CORS |

### Google Cloud setup

Enable these APIs for your key:

- Maps JavaScript API
- Places API

Restrict the key to HTTP referrers (e.g. `http://localhost:5173/*`) for development.

### Twilio (dev vs production)

During `npm run dev`, SMS is sent through a built-in Vite proxy at `/api/twilio/sms` so you do not need `VITE_TWILIO_PROXY_URL`.

**Do not** set `VITE_TWILIO_PROXY_URL` to `http://localhost:5173` — that is the React app, not Twilio.

For production builds, deploy `examples/twilio-proxy.js` and set `VITE_TWILIO_PROXY_URL` to that URL.

### Troubleshooting

| Problem | Fix |
|---------|-----|
| APIs show as missing on dashboard | Save `.env`, stop dev server (Ctrl+C), run `npm run dev` again |
| Gemini errors | Use a key from [Google AI Studio](https://aistudio.google.com/apikey). New `AQ.` keys are supported. |
| Maps / Places fails | Enable **Maps JavaScript API** + **Places API**, billing on, HTTP referrer `http://localhost:*` |
| Wrong port (5174, 5175…) | Stop other `npm run dev` windows or use the URL Vite prints; update Maps referrer to match |
| Twilio SMS fails | Trial accounts must verify recipient numbers in Twilio console |

## Build for production

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Recharts
- Google Gemini / OpenAI
- Google Maps Places
- Twilio SMS

## Disclaimer

NextPulse provides general wellness information only. It is not a substitute for professional medical advice, diagnosis, or treatment.
