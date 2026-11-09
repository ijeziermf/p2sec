# Ijeanyi — Cybersecurity Content Business

Free cert roadmaps, study guides, and career resources from a practicing cybersecurity professional.

## Stack

- **Framework**: Next.js (React)
- **Email**: Resend
- **Hosting**: Vercel

## Setup

```bash
npm install
```

Copy `.env.local.example` to `.env.local` and fill in your Resend credentials:

```bash
cp .env.local.example .env.local
```

## Development

```bash
npm run dev
```

## Deploy

Connect the repo to Vercel. Add environment variables in Vercel project settings:
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`

## Branding Rules

- NO mention of SSA, government affiliation, or federal employment anywhere on the site or in emails
- He is "cybersecurity professional" only
- His story: certs → experience → practitioner. Nothing else.