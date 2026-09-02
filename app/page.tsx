'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, CircleAlert, Compass, ExternalLink, Globe2, LoaderCircle, Radar, Rocket, Search, Sparkles, Target, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { VentureAnalysis } from '@/lib/venture-analysis';

const DEFAULT_PROMPT = 'Could there be a commercial market for private 5G networks for warehouses in Africa?';
const SAMPLES = ['AI compliance copilot for small EU manufacturers', 'Water-leak detection for Middle East hotels', 'Carbon reporting for independent logistics fleets'];

function ScoreRing({ score }: { score: number }) {
  return <div className="relative grid size-32 place-items-center rounded-full" style={{ background: `conic-gradient(#07110e ${score * 3.6}deg, rgba(7,17,14,.13) 0)` }}><div className="grid size-[108px] place-items-center rounded-full bg-[#c7ff4a]"><div className="text-center"><span className="font-mono text-4xl font-semibold tracking-[-.07em]">{score}</span><span className="text-xs opacity-50">/100</span></div></div></div>;
}

export default function Home() {
  const [question, setQuestion] = useState(DEFAULT_PROMPT);
  const [analysis, setAnalysis] = useState<VentureAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysis(data);
      requestAnimationFrame(() => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (e) { setError(e instanceof Error ? e.message : 'Analysis failed'); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#07110e]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 lg:px-9">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#c7ff4a] text-[#07110e]"><Radar className="size-5" /></div><div><p className="font-heading text-sm font-semibold tracking-tight text-white">VentureRadar AI</p><p className="text-[10px] uppercase tracking-[.2em] text-[#8fa59d]">Opportunity intelligence</p></div></div>
          <Badge className="border-[#c7ff4a]/25 bg-[#c7ff4a]/10 text-[#d8ff7d]" variant="outline"><span className="size-1.5 rounded-full bg-[#c7ff4a]" /> {analysis ? (analysis.mode === 'live' ? `${analysis.intelligence === 'openai' ? 'AI + ' : ''}Live research` : 'Analysis complete') : 'Research workspace'}</Badge>
        </div>
      </header>

      <section className="overflow-hidden border-b border-white/8 bg-[#07110e] text-white">
        <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-[#c7ff4a]/8 blur-[100px]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-9 px-5 py-10 lg:grid-cols-[.8fr_1.2fr] lg:px-9 lg:py-14">
          <div className="max-w-xl"><p className="mb-4 font-mono text-[11px] uppercase tracking-[.24em] text-[#c7ff4a]">From question to venture thesis</p><h1 className="font-heading text-4xl font-semibold leading-[1.03] tracking-[-.045em] sm:text-5xl">Find the signal<br />before the crowd.</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#9db0a9]">Live web evidence, competitive gaps, and launch decisions—synthesized into one defensible opportunity brief.</p></div>
          <div><div className="rounded-2xl border border-white/10 bg-[#0d1b17] p-2 shadow-[0_28px_80px_rgba(0,0,0,.28)]"><Textarea value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={500} aria-label="Business or technology question" className="min-h-28 resize-none border-0 bg-transparent p-4 text-base leading-7 text-white shadow-none placeholder:text-[#6f847c] focus-visible:ring-0" placeholder="Ask a specific market or technology question…" /><div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-3 py-3"><span className="flex items-center gap-2 text-xs text-[#82978f]"><Globe2 className="size-4" /> SerpApi + Name.com</span><Button onClick={analyze} disabled={loading} className="h-10 rounded-xl bg-[#c7ff4a] px-5 font-semibold text-[#07110e] hover:bg-[#d9ff80]">{loading ? <LoaderCircle className="animate-spin" /> : <Sparkles />} {loading ? 'Researching the market…' : 'Analyze opportunity'}</Button></div></div>
            {error && <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-red-300"><CircleAlert className="size-4" />{error}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2"><span className="mr-1 text-[11px] uppercase tracking-wider text-[#6f847c]">Try</span>{SAMPLES.map((p) => <button key={p} onClick={() => setQuestion(p)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#a9bbb5] transition hover:border-[#c7ff4a]/40 hover:text-white">{p}</button>)}</div>
          </div>
        </div>
      </section>

      {!analysis ? <section className="mx-auto max-w-[1440px] px-5 py-10 lg:px-9"><div className="grid gap-4 md:grid-cols-3">{[[Search,'Live evidence','Searches demand, competitor, and adoption signals.'],[Target,'Decision-grade score','Weights demand, white space, timing, and feasibility.'],[Rocket,'Launch-ready plan','Turns the market thesis into a focused eight-week test.']].map(([Icon,title,copy]) => { const I = Icon as typeof Search; return <article key={String(title)} className="rounded-2xl border bg-card p-6 shadow-sm"><I className="size-5 text-emerald-700"/><h2 className="mt-8 font-heading text-lg font-semibold">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{String(copy)}</p></article>})}</div></section> : <Report analysis={analysis} />}
    </main>
  );
}

function Report({ analysis: a }: { analysis: VentureAnalysis }) {
  return <section id="report" className="scroll-mt-20 mx-auto max-w-[1440px] px-5 py-8 lg:px-9">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2"><p className="font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">Opportunity brief</p><Badge variant="outline" className="text-[10px]">{a.mode === 'live' ? 'LIVE WEB DATA' : 'MOCK FALLBACK'}</Badge></div><h2 className="mt-2 max-w-3xl font-heading text-3xl font-semibold tracking-[-.035em]">{a.title}</h2></div><p className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4 text-emerald-600" /> {a.sources.length} sources synthesized</p></div>
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_.72fr]">
      <article className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2"><p className="eyebrow">Executive readout</p><p className="mt-4 max-w-4xl font-heading text-xl leading-8 tracking-tight">{a.summary}</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{a.signals.map((s) => <div key={s.label} className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="mt-1 font-mono text-lg font-semibold text-emerald-700">{s.value}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{s.detail}</p></div>)}</div></article>
      <article className="flex flex-col items-center justify-between rounded-2xl bg-[#c7ff4a] p-6 text-[#07110e] shadow-sm"><p className="w-full text-xs font-semibold uppercase tracking-wider opacity-60">Opportunity score</p><ScoreRing score={a.score}/><div className="w-full"><p className="font-heading text-lg font-semibold">{a.verdict}</p><p className="mt-1 text-xs opacity-60">Validate buyer urgency before scaling.</p></div></article>
      <article className="rounded-2xl border bg-card p-6 shadow-sm"><p className="eyebrow">Scorecard</p><div className="mt-5 space-y-5">{a.scorecard.map((s) => <div key={s.label}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{s.label}</span><span className="font-mono font-semibold">{s.score}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-emerald-700" style={{width:`${s.score}%`}}/></div><p className="mt-1.5 text-[11px] text-muted-foreground">{s.rationale}</p></div>)}</div></article>
      <article className="rounded-2xl border bg-card p-6 shadow-sm"><div className="flex items-center justify-between"><p className="eyebrow">Competitive signals</p><Compass className="size-4 text-emerald-700"/></div><div className="mt-5 divide-y">{a.competitors.map((c) => <div key={c.name} className="py-3 first:pt-0"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold">{c.name}</p>{c.url && <a href={c.url} target="_blank" rel="noreferrer" aria-label={`Open source for ${c.name}`}><ExternalLink className="size-3.5 text-muted-foreground"/></a>}</div><p className="mt-1 text-xs text-muted-foreground">{c.positioning}</p><p className="mt-1 text-[11px] text-emerald-700">{c.signal}</p></div>)}</div></article>
      <article className="rounded-2xl border bg-[#0d1b17] p-6 text-white shadow-sm"><p className="eyebrow text-[#8fa59d]">Market gaps</p><div className="mt-5 space-y-4">{a.gaps.map((g,i) => <div key={g} className="flex gap-3"><span className="font-mono text-xs text-[#c7ff4a]">0{i+1}</span><p className="text-sm leading-5 text-[#dbe5e1]">{g}</p></div>)}</div></article>
      <article className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Recommended venture</p><h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight">{a.concept.name}</h3></div><Zap className="size-5 text-emerald-700"/></div><p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">{a.concept.pitch}</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{[['First customer',a.concept.customer],['Business model',a.concept.businessModel],['Defensible edge',a.concept.moat]].map(([l,v]) => <div key={l}><p className="text-xs font-semibold">{l}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{v}</p></div>)}</div></article>
      <article className="rounded-2xl border bg-card p-6 shadow-sm"><p className="eyebrow">Domain shortlist</p><div className="mt-5 space-y-2">{a.domains.map((d) => <div key={d.domain} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-3"><div><span className="font-mono text-xs font-semibold">{d.domain}</span>{d.purchasePrice != null && <p className="mt-1 text-[10px] text-muted-foreground">${d.purchasePrice.toFixed(2)} first year{d.premium ? ' · premium' : ''}</p>}</div><Badge variant={d.available ? 'default' : 'outline'} className={d.available ? 'bg-emerald-700' : ''}>{d.available === true ? 'Available' : d.available === false ? 'Taken' : 'Check'}</Badge></div>)}</div><p className="mt-3 text-[10px] leading-4 text-muted-foreground">Name.com searches candidate brands, confirms registration availability, and returns live pricing when credentials are configured.</p></article>
      <article className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3"><p className="eyebrow">8-week launch plan</p><div className="mt-6 grid gap-4 md:grid-cols-3">{a.launchPlan.map((p,i) => <div key={p.phase} className="relative rounded-xl border p-5"><div className="flex items-center justify-between"><span className="font-mono text-xs text-emerald-700">0{i+1}</span><Badge variant="secondary">{p.timing}</Badge></div><h3 className="mt-4 font-heading text-xl font-semibold">{p.phase}</h3><ul className="mt-3 space-y-2">{p.actions.map((x) => <li key={x} className="flex gap-2 text-xs leading-5 text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-emerald-700"/>{x}</li>)}</ul><div className="mt-5 border-t pt-4"><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Proof gate</p><p className="mt-1 text-xs font-medium">{p.proof}</p></div></div>)}</div></article>
      <article className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-3"><div className="flex items-center justify-between"><p className="eyebrow">Research trail</p><span className="text-xs text-muted-foreground">{a.mode === 'live' ? 'Powered by SerpApi' : 'Demo evidence'}</span></div><div className="mt-5 grid gap-3 md:grid-cols-2">{a.sources.slice(0,6).map((s) => <a key={s.link+s.title} href={s.link} target="_blank" rel="noreferrer" className="group rounded-xl border p-4 transition hover:border-emerald-600/40 hover:bg-muted/30"><div className="flex items-start justify-between gap-4"><p className="text-sm font-semibold leading-5">{s.title}</p><ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition group-hover:text-emerald-700"/></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{s.snippet}</p></a>)}</div></article>
    </div>
  </section>;
}
