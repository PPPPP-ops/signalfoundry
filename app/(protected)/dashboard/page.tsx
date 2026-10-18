import Link from "next/link";
import { getDashboardData } from "@/src/db/queries";

const cards = [
  ["signals", "Signals", "/signals"],
  ["problems", "Problems", "/problems"],
  ["opportunities", "Opportunities", "/opportunities"],
  ["decisions", "Decisions", "/decisions"],
] as const;

export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">Workspace overview</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Make the next decision with evidence.</h1><p className="mt-3 max-w-2xl text-stone-600">{data.workspace.name} is your working set for turning customer feedback into clear product priorities.</p></div>
        <Link href="/signals" className="rounded-full bg-stone-900 px-5 py-3 text-center font-mono text-xs font-semibold text-white hover:bg-stone-700">Capture a signal</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([key, label, href]) => <Link key={key} href={href} className="rounded-2xl border border-stone-200 bg-[#fffdf8] p-5 transition hover:-translate-y-0.5 hover:shadow-sm"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-4 text-4xl font-semibold">{data.counts[key]}</p><p className="mt-2 text-sm text-stone-500">Open workspace records →</p></Link>)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-stone-200 bg-[#fffdf8] p-6"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">Priority queue</p><h2 className="mt-2 text-2xl font-semibold">Highest-signal opportunities</h2></div><Link href="/opportunities" className="font-mono text-xs text-amber-700">View all</Link></div><div className="mt-6 space-y-3">{data.topOpportunities.length ? data.topOpportunities.map(({ opportunity, problemTitle }) => <div key={opportunity.id} className="flex items-center justify-between gap-4 rounded-2xl bg-stone-100 p-4"><div><p className="font-medium">{opportunity.title}</p><p className="mt-1 text-xs text-stone-500">From: {problemTitle}</p></div><span className="font-mono text-lg text-amber-700">{opportunity.priorityScore}</span></div>) : <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-sm text-stone-500">No opportunities yet. Add signals first, then group a problem.</p>}</div></section>
        <section className="rounded-3xl border border-stone-200 bg-[#fffdf8] p-6"><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">Recent activity</p><h2 className="mt-2 text-2xl font-semibold">Decisions with context</h2><div className="mt-6 space-y-4">{data.recentDecisions.length ? data.recentDecisions.map(({ decision, opportunityTitle }) => <div key={decision.id} className="border-b border-stone-200 pb-4 last:border-0"><div className="flex justify-between gap-3"><p className="font-medium">{opportunityTitle}</p><span className="font-mono text-[10px] uppercase text-amber-700">{decision.decisionType}</span></div><p className="mt-1 text-sm text-stone-500">{decision.rationale}</p></div>) : <p className="rounded-2xl border border-dashed border-stone-300 p-5 text-sm text-stone-500">Decisions will appear here after you score an opportunity.</p>}</div></section>
      </div>
    </div>
  );
}
