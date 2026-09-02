# VentureRadar AI

VentureRadar AI turns a business or technology question into an evidence-backed opportunity brief: live market signals, competitor positioning, unserved gaps, a weighted opportunity score, a venture concept, domain suggestions, and an eight-week launch plan.

Built from scratch for the **DEVNetwork API + Cloud + AI Hackathon 2026**.

## What the MVP demonstrates

- SerpApi-powered research across demand, competitors, and adoption barriers
- Name.com Domain API search, availability validation, and live registration pricing
- OpenAI Responses API synthesis grounded exclusively in SerpApi evidence
- A transparent opportunity score across demand, white space, timing, and feasibility
- A polished, responsive decision brief with linked research sources
- Automatic mock fallbacks, so the full demo works without credentials
- Three one-click sample prompts for a reliable judging demo

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The app works immediately in demo mode. Add credentials to `.env.local` to enable live integrations:

```dotenv
SERPAPI_API_KEY=your_serpapi_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
NAMECOM_USERNAME=your_name.com_username
NAMECOM_API_TOKEN=your_name.com_api_token
```

For Name.com's sandbox, also set:

```dotenv
NAMECOM_API_BASE_URL=https://api.dev.name.com/core/v1
```

Never commit `.env.local` or API credentials.

## Demo prompts

1. Could there be a commercial market for private 5G networks for warehouses in Africa?
2. AI compliance copilot for small EU manufacturers
3. Water-leak detection for Middle East hotels
4. Carbon reporting for independent logistics fleets

For the strongest demo, begin with prompt 1, point out the live/demo status badge, scan the scorecard and linked research trail, then finish on the domain shortlist and eight-week proof gates.

## Architecture

The browser sends a question to `POST /api/analyze`. The server runs three targeted SerpApi searches in parallel and normalizes the organic results into a common evidence model. OpenAI's Responses API turns that evidence into a focused thesis without introducing unsupported facts. Name.com then searches brand terms, validates registration availability, and returns pricing. Each integration fails independently and falls back safely, keeping the demo available even if a provider is slow or unconfigured.

Key files:

- `app/page.tsx` — interactive research workspace and report UI
- `app/api/analyze/route.ts` — API orchestration and integration adapters
- `lib/venture-analysis.ts` — scoring, synthesis, mock evidence, and domain ideas
- `.env.example` — required configuration

## Production build and deployment

```bash
npm run build
```

This project is configured for OpenAI Sites / Cloudflare-compatible deployment. Deploy through Sites and add `SERPAPI_API_KEY`, `OPENAI_API_KEY`, `NAMECOM_USERNAME`, and `NAMECOM_API_TOKEN` as encrypted production environment variables. The generated worker uses HTTP APIs only and requires no database.

For another Cloudflare Workers deployment flow, deploy the generated worker output with Wrangler after building, then configure the same secrets in that environment.

## Responsible use

VentureRadar is a decision-support tool, not a substitute for customer interviews or financial, legal, and technical diligence. Scores are directional. Live sources remain linked so users can inspect the evidence behind the brief.
