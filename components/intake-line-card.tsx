import { INTAKE_LINE, formatPhone } from "@/lib/format";

/** Maya's number on the main page: the line the whole dashboard is fed by. */
export function IntakeLineCard() {
  return (
    <a
      href={`tel:+1${INTAKE_LINE}`}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-live-soft text-live">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
        </svg>
        <span className="live-dot absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-surface bg-live" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-sm text-ink-soft">Call Maya · open 24/7</span>
        <span className="tabular block font-display text-2xl font-bold tracking-tight text-ink group-hover:text-brand">
          +1 {formatPhone(INTAKE_LINE)}
        </span>
      </span>
    </a>
  );
}
