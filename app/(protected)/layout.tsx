import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ensurePersonalWorkspace } from "@/src/db/onboarding";

const links = [
  ["/dashboard", "Dashboard"],
  ["/signals", "Signals"],
  ["/problems", "Problems"],
  ["/opportunities", "Opportunities"],
  ["/decisions", "Decisions"],
  ["/settings", "Settings"],
] as const;

export default async function ProtectedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await ensurePersonalWorkspace();
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-[#fffdf8] px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-6">
            <Link href="/dashboard" className="font-mono text-sm font-semibold tracking-wide">SignalFoundry</Link>
            <UserButton />
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-stone-500">
            {links.map(([href, label]) => <Link key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-stone-100 hover:text-stone-900">{label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
