import Link from "next/link";
import type { ReactNode } from "react";

import { logout } from "@/lib/actions";

type Section = "patients" | "calls";

const NAV: { href: "/" | "/calls"; label: string; section: Section }[] = [
  { href: "/", label: "Patients", section: "patients" },
  { href: "/calls", label: "Call log", section: "calls" },
];

/**
 * Chrome shared by every signed-in page. The amber rule under the header is
 * the line-in-use lamp, and it reappears as the spine of a transcript.
 */
export function AppShell({
  current,
  children,
}: {
  current: Section;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-chrome text-chrome-fg">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5">
          <div>
            <p className="font-condensed text-xl font-bold uppercase tracking-[0.09em]">
              Lakeside Family Medicine
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-chrome-fg/55">
              Intake line · answered by Maya
            </p>
          </div>

          <nav className="ml-auto flex items-center gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current === item.section ? "page" : undefined}
                className={`font-condensed text-sm font-semibold uppercase tracking-[0.12em] underline-offset-8 transition-colors hover:text-chrome-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-lamp ${
                  current === item.section
                    ? "text-chrome-fg underline decoration-signal-lamp decoration-2"
                    : "text-chrome-fg/60"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <form action={logout}>
              <button
                type="submit"
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-chrome-fg/50 underline-offset-4 transition-colors hover:text-chrome-fg hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal-lamp"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>

      <div className="h-[3px] bg-signal-lamp" aria-hidden="true" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">{children}</main>
    </div>
  );
}

/** One figure in the ledger strip that heads each page. */
export function Figure({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </dt>
      <dd className="tabular mt-1 font-condensed text-3xl font-bold">{value}</dd>
    </div>
  );
}
