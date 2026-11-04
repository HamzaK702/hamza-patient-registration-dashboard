import { INTAKE_LINE, formatPhone } from "@/lib/format";

/** Maya's number, front and centre: the line the whole dashboard is fed by. */
export function IntakeLineCard() {
  return (
    <a
      href={`tel:+1${INTAKE_LINE}`}
      className="group flex items-center gap-4 border border-signal/35 bg-signal-wash px-5 py-4 transition-colors hover:border-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chrome text-signal-lamp ring-1 ring-signal-lamp/40">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
        </svg>
      </span>
      <span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          <span className="lamp inline-block h-1.5 w-1.5 rounded-full bg-signal-lamp" aria-hidden="true" />
          Maya&apos;s line · live 24/7
        </span>
        <span className="tabular mt-0.5 block font-condensed text-2xl font-bold tracking-[0.02em] text-ink group-hover:text-signal">
          +1 {formatPhone(INTAKE_LINE)}
        </span>
      </span>
    </a>
  );
}
