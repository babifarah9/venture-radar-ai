# VentureRadar AI — Devpost submission

## Elevator pitch

VentureRadar AI turns live web signals into evidence-backed venture opportunities—mapping demand, competitors, market gaps, brandable domains, and an eight-week launch plan.

## The whole story

### Inspiration

Founders rarely lack ideas; they lack fast, trustworthy evidence. Early market research is scattered across search results, analyst pages, competitor sites, and disconnected spreadsheets. By the time the picture is clear, teams have often invested weeks validating the wrong assumptions.

We built VentureRadar AI to compress that uncertainty into a decision-ready brief. A founder asks one concrete market question. VentureRadar researches it live, shows the evidence trail, identifies competitive white space, scores the opportunity, proposes a focused venture, finds viable domain names, and maps the fastest route to real customer proof.

### What it does

VentureRadar runs three targeted research tracks in parallel: demand and momentum, the competitive landscape, and adoption barriers. It normalizes the resulting web evidence, then uses an AI analyst constrained to that evidence to produce a concise opportunity thesis.

The report includes:

- market and buyer signals;
- competitor positioning;
- an explainable score across demand, white space, timing, and feasibility;
- specific underserved gaps;
- a beachhead customer, business model, and defensible venture concept;
- live domain search, availability, and registration pricing; and
- an eight-week launch plan with measurable proof gates.

Every source stays linked. If an external provider is unavailable, the app degrades transparently into demo mode instead of failing during a presentation.

### How we built it

The responsive web application uses React, TypeScript, Vinext, Tailwind CSS, and Cloudflare-compatible server routes. SerpApi is the primary real-time intelligence layer. The OpenAI Responses API synthesizes only the collected evidence. Name.com's Core API performs both keyword-based domain discovery and final availability/pricing checks. The app is deployed on OpenAI Sites.

### Challenges we ran into

The hardest design problem was balancing speed with trust. A confident narrative is easy to generate, but a useful market brief needs inspectable evidence and graceful uncertainty. We kept scoring transparent, preserved the source trail, constrained AI synthesis to retrieved evidence, and isolated every integration so one provider cannot take down the workflow.

Domain discovery also needed to be more than a decorative list. We made it part of the venture-creation sequence: the market thesis shapes the brand term, Name.com expands it into candidates, and availability plus pricing determines which names are realistically launchable.

### Accomplishments we're proud of

- A complete question-to-launch workflow in one focused interface
- Parallel, real-time research rather than static training-data answers
- Evidence-grounded AI synthesis with visible sources
- Two meaningful Name.com operations: search plus availability/pricing validation
- A reliable demonstration path with transparent fallbacks
- A new project built from scratch during the hackathon

### What we learned

Opportunity scoring is most useful when it starts a conversation rather than pretending to end one. Showing the dimensions behind the score—and attaching explicit proof gates to the launch plan—turns the report into a falsifiable thesis that a founder can test.

### What's next

Next we would add saved research workspaces, collaborative annotations, longitudinal signal tracking, customer-interview evidence, and one-click domain registration plus DNS setup. We would also evaluate the opportunity score against outcomes from real startup validation experiments.

## Built with

SerpApi, Name.com Core API, OpenAI Responses API, React, TypeScript, Vinext, Tailwind CSS, Cloudflare Workers, OpenAI Sites

## Links

- Live application: https://venture-radar-ai.starmanfarah.chatgpt.site
- Source repository: add the public or judge-shared repository URL before submission

## Challenges to select

- DevNetwork Overall Winner
- SerpApi — Best AI Use Case
- name.com — Domain API Challenge
