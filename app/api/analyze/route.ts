import { domainIdeas, keywords, mockSources, synthesize, type ResearchSource, type VentureAnalysis } from '@/lib/venture-analysis';

export const runtime = 'edge';

async function searchSerpApi(question: string): Promise<ResearchSource[]> {
  const key = process.env.SERPAPI_API_KEY;
  if (!key) return [];
  const queries = [`${question} market demand trends`, `${question} companies competitors`, `${question} adoption barriers customer pain points`];
  const batches = await Promise.all(queries.map(async (query) => {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.set('engine', 'google'); url.searchParams.set('q', query); url.searchParams.set('api_key', key); url.searchParams.set('num', '6');
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`SerpApi returned ${response.status}`);
    const data = await response.json() as { organic_results?: { title?: string; link?: string; snippet?: string }[] };
    return (data.organic_results || []).slice(0, 5).map((r) => ({ title: r.title || 'Untitled result', link: r.link || '#', snippet: r.snippet || 'Relevant market evidence', query }));
  }));
  return batches.flat();
}

type DomainResult = VentureAnalysis['domains'][number];

async function discoverDomains(question: string, fallbackNames: string[]): Promise<DomainResult[]> {
  const username = process.env.NAMECOM_USERNAME;
  const token = process.env.NAMECOM_API_TOKEN;
  if (!username || !token) return fallbackNames.map((domain) => ({ domain, available: null, source: 'suggested' as const }));
  const base = process.env.NAMECOM_API_BASE_URL || 'https://api.name.com/core/v1';
  const authorization = `Basic ${btoa(`${username}:${token}`)}`;
  const keyword = keywords(question).slice(0, 2).join('') || 'venturepilot';
  const searchResponse = await fetch(`${base}/domains:search`, {
    method: 'POST', headers: { Authorization: authorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword, timeout: 2500, tldFilter: ['com', 'ai', 'io'], purchaseType: 'registration' }), signal: AbortSignal.timeout(10000),
  });
  const searched = searchResponse.ok ? await searchResponse.json() as { results?: { domainName: string }[] } : { results: [] };
  const names = [...new Set([...(searched.results || []).slice(0, 8).map((d) => d.domainName), ...fallbackNames])].slice(0, 12);
  const response = await fetch(`${base}/domains:checkAvailability`, {
    method: 'POST', headers: { Authorization: `Basic ${btoa(`${username}:${token}`)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainNames: names, purchaseType: 'registration' }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Name.com returned ${response.status}`);
  const data = await response.json() as { results?: { domainName: string; purchasable?: boolean; purchasePrice?: number; renewalPrice?: number; premium?: boolean }[] };
  return (data.results || []).sort((a, b) => Number(Boolean(b.purchasable)) - Number(Boolean(a.purchasable))).slice(0, 6).map((d) => ({ domain: d.domainName, available: Boolean(d.purchasable), purchasePrice: d.purchasePrice, renewalPrice: d.renewalPrice, premium: d.premium, source: 'name.com' as const }));
}

async function enhanceWithOpenAI(base: VentureAnalysis): Promise<VentureAnalysis> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return base;
  const evidence = base.sources.slice(0, 12).map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`).join('\n');
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', signal: AbortSignal.timeout(25000),
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini', store: false, max_output_tokens: 1400,
      instructions: 'You are a rigorous venture analyst. Use only the supplied web evidence. Return valid JSON only, with no markdown. Avoid invented facts or numbers. Make the thesis specific, concise, and decision-useful.',
      input: `Question: ${base.question}\n\nEvidence:\n${evidence}\n\nReturn this exact JSON shape: {"summary":"2-3 sentence evidence-grounded synthesis","verdict":"short verdict","gaps":["four specific gaps"],"concept":{"name":"short brand name","pitch":"one sentence","customer":"specific beachhead customer","businessModel":"specific model","moat":"credible compounding advantage"}}`,
    }),
  });
  if (!response.ok) throw new Error(`OpenAI returned ${response.status}`);
  const data = await response.json() as { output_text?: string; output?: { content?: { type?: string; text?: string }[] }[] };
  const text = data.output_text || data.output?.flatMap((o) => o.content || []).find((c) => c.type === 'output_text')?.text;
  if (!text) throw new Error('OpenAI returned no text');
  const patch = JSON.parse(text) as Partial<Pick<VentureAnalysis, 'summary' | 'verdict' | 'gaps' | 'concept'>>;
  return { ...base, ...patch, concept: { ...base.concept, ...(patch.concept || {}) }, intelligence: 'openai' };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { question?: string };
    const question = body.question?.trim();
    if (!question || question.length < 12) return Response.json({ error: 'Enter a specific question of at least 12 characters.' }, { status: 400 });
    if (question.length > 500) return Response.json({ error: 'Keep the question under 500 characters.' }, { status: 400 });
    let sources: ResearchSource[] = [];
    try { sources = await searchSerpApi(question); } catch (error) { console.warn('SerpApi unavailable; using demo research.', error); }
    const isLive = sources.length > 0;
    if (!isLive) sources = mockSources(question);
    let analysis = synthesize(question, sources, [], isLive);
    try { analysis = await enhanceWithOpenAI(analysis); } catch (error) { console.warn('OpenAI unavailable; using heuristic synthesis.', error); }
    const ideas = domainIdeas(`${question} ${analysis.concept.name}`);
    let domains;
    try { domains = await discoverDomains(question, ideas); } catch (error) {
      console.warn('Name.com unavailable; returning suggestions.', error);
      domains = ideas.map((domain) => ({ domain, available: null, source: 'suggested' as const }));
    }
    return Response.json({ ...analysis, domains });
  } catch {
    return Response.json({ error: 'We could not analyze that question. Please try again.' }, { status: 500 });
  }
}
