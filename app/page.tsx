import Link from "next/link";

const workflow = [
  "Capture customer signals",
  "Group recurring problems",
  "Prioritise what to build",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <Link href="/" className="font-mono text-sm font-semibold tracking-wide text-stone-900">
            SignalFoundry
          </Link>
          <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.16em] text-stone-500">
            <Link className="hidden transition-colors hover:text-stone-900 sm:inline" href="/pricing">
              Pricing
            </Link>
            <Link className="transition-colors hover:text-stone-900" href="/sign-in">
              Sign in
            </Link>
          </nav>
        </header>

        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-14 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber-700">
              Customer discovery / product decisions
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">
              Turn scattered feedback into a sharper product roadmap.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl">
              SignalFoundry gives solo founders and small teams one calm workspace to capture customer signals, find recurring problems, and decide what to build next with evidence.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-stone-900 px-7 font-mono text-sm font-semibold text-stone-50 transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
              >
                Create your workspace
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-stone-300 px-7 font-mono text-sm text-stone-700 transition hover:border-stone-500 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-5 font-mono text-xs text-stone-500">Free personal workspace · No payment required</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-amber-200/40 blur-3xl" aria-hidden="true" />
            <div className="relative rounded-[2rem] border border-stone-200 bg-[#fffdf8] p-6 shadow-[0_24px_80px_-32px_rgba(41,37,36,0.35)] sm:p-8">
              <div className="flex items-center justify-between border-b border-stone-200 pb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">SignalFoundry / workspace</p>
                  <p className="mt-2 text-lg font-semibold">Evidence to action</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-800">Live view</span>
              </div>
              <div className="mt-7 space-y-3">
                {workflow.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-900 font-mono text-xs text-stone-50">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-medium text-stone-700">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-2xl bg-stone-900 p-5 text-stone-50">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">Priority signal</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <p className="text-lg font-semibold">Reduce onboarding friction</p>
                  <span className="font-mono text-2xl text-amber-300">18.5</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-stone-300">Frequency · severity · fit · effort — visible, explainable, editable.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
