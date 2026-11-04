import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { logout } from "@/lib/actions";

type Section = "patients" | "calls";

const NAV: { href: "/" | "/calls"; label: string; section: Section }[] = [
  { href: "/", label: "Patients", section: "patients" },
  { href: "/calls", label: "Calls", section: "calls" },
];

/** Hospital mark: a building with a cross on its tower. */
export function HospitalMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M3 29V14a2 2 0 0 1 2-2h6V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6h6a2 2 0 0 1 2 2v15z"
      />
      <g fill="var(--mark-cut, #fff)">
        <rect x="14.75" y="6" width="2.5" height="7" rx=".5" />
        <rect x="12.5" y="8.25" width="7" height="2.5" rx=".5" />
        <rect x="6" y="16" width="3" height="3" rx=".5" />
        <rect x="23" y="16" width="3" height="3" rx=".5" />
        <rect x="6" y="22" width="3" height="3" rx=".5" />
        <rect x="23" y="22" width="3" height="3" rx=".5" />
        <path d="M13 29v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6z" />
      </g>
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-black/5 [--mark-cut:#fff]">
        <HospitalMark className="h-6 w-6" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[17px] font-bold tracking-tight">
          Lakeside Family Medicine
        </span>
        <span className="block text-xs opacity-70">Hospital &amp; clinic · patient intake</span>
      </span>
    </span>
  );
}

const ON_NAV =
  "border-white/20 bg-white/10 text-white hover:border-white/50 hover:bg-white/15";

/** Chrome shared by every signed-in page: a deep-green bar with tab-style nav. */
export function AppShell({
  current,
  children,
}: {
  current: Section;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 bg-nav text-white shadow-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 pt-3 sm:px-6">
          <Logo />

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle className={ON_NAV} />
            <form action={logout}>
              <button
                type="submit"
                className={`h-9 rounded-xl border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${ON_NAV}`}
              >
                Sign out
              </button>
            </form>
          </div>

          <nav className="-mb-px flex w-full gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current === item.section ? "page" : undefined}
                className={`border-b-[3px] pb-2.5 pt-1 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  current === item.section
                    ? "border-nav-accent text-white"
                    : "border-transparent text-white/65 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
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

/** Holds a data table whose rows render as separate cards. */
export function TableCard({ children }: { children: ReactNode }) {
  return <div className="mt-8 overflow-x-auto pb-2">{children}</div>;
}

/** Table base: separated rows so each one reads as its own card. */
export const TABLE = "w-full border-separate border-spacing-y-2 text-sm";

export const TH =
  "px-3 pb-1 text-left text-[11px] font-semibold uppercase tracking-wider text-ink-faint first:pl-5 last:pr-5";

/** Cell: rows get their card look from the first/last cells' rounded borders. */
export const TD =
  "border-y border-line bg-surface px-3 py-3.5 transition-colors group-hover:bg-brand-soft/40 first:rounded-l-2xl first:border-l first:pl-5 last:rounded-r-2xl last:border-r last:pr-5";

export const TR = "group";

export const LINK =
  "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="mt-10 rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center text-sm text-ink-soft">
      {children}
    </p>
  );
}
