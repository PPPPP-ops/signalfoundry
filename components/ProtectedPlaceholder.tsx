export function ProtectedPlaceholder({ title }: { title: string }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-[#fffdf8] p-8 shadow-sm">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-700">Authenticated route</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 max-w-xl leading-7 text-stone-600">
        Clerk authentication and workspace ownership checks are active for this route. Product features will be added in the ordered MVP tasks.
      </p>
    </section>
  );
}
