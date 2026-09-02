import { domainIdeas, mockSources, synthesize, type ResearchSource } from '@/lib/venture-analysis';

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

async function checkDomains(names: string[]) {
  const username = process.env.NAMECOM_USERNAME;
  const token = process.env.NAMECOM_API_TOKEN;
  if (!username || !token) return names.map((domain) => ({ domain, available: null, source: 'suggested' as const }));
  const base = process.env.NAMECOM_API_BASE_URL || 'https://api.name.com/v4';
  const response = await fetch(`${base}/domains:checkAvailability`, {
    method: 'POST', headers: { Authorization: `Basic ${btoa(`${username}:${token}`)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ domainNames: names }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Name.com returned ${response.status}`);
  const data = await response.json() as { results?: { domainName: string; purchasable?: boolean }[] };
  const result = new Map((data.results || []).map((d) => [d.domainName, Boolean(d.purchasable)]));
  return names.map((domain) => ({ domain, available: result.get(domain) ?? null, source: 'name.com' as const }));
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
    const ideas = domainIdeas(question);
    let domains;
    try { domains = await checkDomains(ideas); } catch (error) {
      console.warn('Name.com unavailable; returning suggestions.', error);
      domains = ideas.map((domain) => ({ domain, available: null, source: 'suggested' as const }));
    }
    return Response.json(synthesize(question, sources, domains, isLive));
  } catch {
    return Response.json({ error: 'We could not analyze that question. Please try again.' }, { status: 500 });
  }
}
