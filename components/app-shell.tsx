import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/actions";

type Section = "patients" | "calls";

const NAV: { href: "/" | "/calls"; label: string; section: Section }[] = [
  { href: "/", label: "Patients", section: "patients" },
  { href: "/calls", label: "Calls", section: "calls" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-fg"
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[17px] font-bold tracking-tight">
          Lakeside Family Medicine
        </span>
        <span className="block text-xs text-ink-faint">Patient intake</span>
      </span>
    </span>
  );
}

/** Chrome shared by every signed-in page. */
export function AppShell({
  current,
  children,
}: {
  current: Section;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Logo />

          <nav className="ml-auto flex items-center gap-1 rounded-xl bg-surface-2 p-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current === item.section ? "page" : undefined}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  current === item.section
                    ? "bg-surface text-ink shadow-card"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={logout}>
              <button
                type="submit"
                className="h-9 rounded-xl border border-line bg-surface px-3 text-sm text-ink-soft transition-colors hover:border-ink-faint hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}

/** Page title block. */
export function PageHeading({ title, lede }: { title: ReactNode; lede?: ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {lede ? <p className="mt-2 max-w-lg text-[15px] text-ink-soft">{lede}</p> : null}
    </div>
  );
}

/** One stat card; `accent` marks the headline one. */
export function Figure({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-40 flex-1 rounded-2xl px-5 py-4 shadow-card ${
        accent ? "bg-brand text-brand-fg" : "border border-line bg-surface"
      }`}
    >
      <dt className={`text-sm ${accent ? "opacity-80" : "text-ink-soft"}`}>{label}</dt>
      <dd className="tabular mt-1 font-display text-4xl font-bold tracking-tight">{value}</dd>
    </div>
  );
}

export function Figures({ children }: { children: ReactNode }) {
  return <dl className="mt-8 flex flex-wrap gap-4">{children}</dl>;
}

/** White rounded card that holds a data table. */
export function TableCard({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      {children}
    </div>
  );
}

export const TH =
  "px-3 py-3 text-left text-xs font-medium text-ink-faint first:pl-5 last:pr-5";

export const LINK =
  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="mt-10 rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center text-sm text-ink-soft">
      {children}
    </p>
  );
}
