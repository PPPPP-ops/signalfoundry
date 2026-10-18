"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import type { ActionState } from "@/src/db/actions";

function SubmitButton({ label }: { label: string }) {
  return (
    <button type="submit" className="rounded-full bg-stone-900 px-4 py-2 font-mono text-xs font-semibold text-white transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
      {label}
    </button>
  );
}

export function FormShell({
  action,
  children,
  submitLabel = "Save",
  className = "",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, { message: "" });
  return (
    <form action={formAction} className={`space-y-4 ${className}`}>
      {children}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className={`text-xs ${state.tone === "error" ? "text-red-700" : "text-emerald-700"}`}>
          {state.message}
        </p>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-500">{children}</label>;
}

export const inputClass = "mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-amber-500 placeholder:text-stone-400 focus:ring-2";
