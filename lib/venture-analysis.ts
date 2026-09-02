export type ResearchSource = { title: string; link: string; snippet: string; query: string };
export type VentureAnalysis = {
  question: string; title: string; summary: string; score: number; verdict: string;
  scorecard: { label: string; score: number; rationale: string }[];
  signals: { label: string; value: string; detail: string }[];
  competitors: { name: string; positioning: string; signal: string; url?: string }[];
  gaps: string[];
  concept: { name: string; pitch: string; customer: string; businessModel: string; moat: string };
  domains: { domain: string; available: boolean | null; source: 'name.com' | 'suggested'; purchasePrice?: number; renewalPrice?: number; premium?: boolean }[];
  launchPlan: { phase: string; timing: string; actions: string[]; proof: string }[];
  sources: ResearchSource[]; mode: 'live' | 'demo'; intelligence: 'openai' | 'heuristic'; generatedAt: string;
};

const STOP = new Set('could there be a the an for in on of to and or with is are market business technology commercial opportunity how can should we build from into using'.split(' '));

export function keywords(question: string) {
  return question.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).slice(0, 8);
}

function titleCase(value: string) { return value.replace(/\b\w/g, (c) => c.toUpperCase()); }
function hash(value: string) { return [...value].reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0); }
function cleanName(value: string) { return value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 18); }

export function mockSources(question: string): ResearchSource[] {
  const topic = keywords(question).slice(0, 4).join(' ') || 'emerging market';
  return [
    { title: `Market outlook: ${titleCase(topic)}`, link: 'https://example.com/market-outlook', snippet: `Analysts describe increasing buyer attention, fragmented solutions, and implementation challenges across the ${topic} category.`, query: `${topic} market growth` },
    { title: `Buyers seek faster time-to-value`, link: 'https://example.com/buyer-trends', snippet: 'Operational teams are prioritizing measurable ROI, lighter implementation, and vendor accountability.', query: `${topic} customer demand pain points` },
    { title: `Competitive landscape remains fragmented`, link: 'https://example.com/competitive-landscape', snippet: 'Established platforms focus on large enterprises while specialist providers address narrow technical requirements.', query: `${topic} companies competitors` },
    { title: `Adoption barriers and market gaps`, link: 'https://example.com/adoption-barriers', snippet: 'Cost, skills, integration complexity, and unclear ownership remain the most common adoption blockers.', query: `${topic} adoption barriers` },
  ];
}

export function synthesize(question: string, sources: ResearchSource[], domains: VentureAnalysis['domains'], live: boolean): VentureAnalysis {
  const words = keywords(question);
  const topic = titleCase(words.slice(0, 5).join(' ') || 'Emerging Opportunity');
  const seed = Math.abs(hash(question));
  const demand = Math.min(92, 63 + sources.length * 2 + seed % 9);
  const competition = Math.min(90, 61 + (seed >> 2) % 20);
  const timing = Math.min(94, 66 + (seed >> 4) % 18);
  const feasibility = Math.min(91, 69 + (seed >> 6) % 16);
  const score = Math.round(demand * .3 + competition * .2 + timing * .25 + feasibility * .25);
  const root = cleanName(words.slice(0, 2).join('')) || 'venture';
  const name = titleCase(root) + ' Pilot';
  const competitorNames = sources.slice(0, 3).map((s) => s.title.split(/[:|–—-]/)[0].trim()).filter(Boolean);
  return {
    question, title: topic,
    summary: `The evidence points to a credible opening around ${topic.toLowerCase()}: buyers appear interested, but adoption is constrained by cost, complexity, and weak proof of value. The strongest entry is a focused, outcome-priced solution for an underserved first segment.`,
    score, verdict: score >= 80 ? 'Strong signal' : score >= 68 ? 'Promising—validate now' : 'Early signal',
    scorecard: [
      { label: 'Demand', score: demand, rationale: 'Visible buyer and market-interest signals' },
      { label: 'White space', score: competition, rationale: 'Room to differentiate on focus and delivery' },
      { label: 'Timing', score: timing, rationale: 'Category momentum supports near-term testing' },
      { label: 'Feasibility', score: feasibility, rationale: 'A narrow MVP can test the core promise quickly' },
    ],
    signals: [
      { label: 'Evidence density', value: `${sources.length} sources`, detail: 'Across demand, competition, and adoption queries' },
      { label: 'Buyer pressure', value: demand > 76 ? 'High' : 'Moderate', detail: 'ROI and implementation friction recur in the evidence' },
      { label: 'Market structure', value: 'Fragmented', detail: 'Broad incumbents leave room for a focused wedge' },
    ],
    competitors: (competitorNames.length ? competitorNames : ['Enterprise incumbents', 'Point solutions', 'Consultancies']).map((name, i) => ({ name, positioning: ['Broad platform / enterprise-led', 'Specialist product / feature-led', 'Services-heavy implementation'][i] || 'Adjacent solution', signal: ['Scale advantage, slower focus', 'Fast product, narrow coverage', 'High-touch, difficult to scale'][i] || 'Relevant market signal', url: sources[i]?.link })),
    gaps: ['A clear ROI calculator before purchase', 'A lightweight pilot that produces proof in weeks', 'Localized workflow and support for the first customer segment', 'Outcome-based pricing that reduces adoption risk'],
    concept: { name, pitch: `A focused validation and delivery platform that helps early buyers adopt ${topic.toLowerCase()} with a measurable pilot, clear economics, and a repeatable rollout plan.`, customer: 'Operations leaders at mid-market organizations currently underserved by enterprise-first vendors', businessModel: 'Paid diagnostic → fixed-price pilot → recurring platform and support subscription', moat: 'Compounding benchmark data, segment-specific workflows, and proof-of-value playbooks' },
    domains,
    launchPlan: [
      { phase: 'Discover', timing: 'Days 1–7', actions: ['Interview 10 target operators', 'Test the top three pain claims', 'Capture current cost and workflow baseline'], proof: '5 buyers confirm an urgent, budgeted problem' },
      { phase: 'Pilot', timing: 'Weeks 2–4', actions: ['Build one outcome-focused workflow', 'Recruit two design partners', 'Measure time, cost, or revenue lift'], proof: 'One customer agrees to pay for the pilot' },
      { phase: 'Launch', timing: 'Weeks 5–8', actions: ['Publish a quantified case study', 'Launch targeted outbound and content', 'Convert pilot into annual contract'], proof: '3 qualified opportunities and first recurring revenue' },
    ],
    sources, mode: live ? 'live' : 'demo', intelligence: 'heuristic', generatedAt: new Date().toISOString(),
  };
}

export function domainIdeas(question: string) {
  const root = cleanName(keywords(question).slice(0, 2).join('')) || 'venturepilot';
  return [`${root}.com`, `get${root}.com`, `${root}hq.com`, `${root}.ai`, `try${root}.com`, `${root}.io`];
}
