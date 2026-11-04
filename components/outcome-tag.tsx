import type { CallOutcome } from "@/lib/db";
import { OUTCOME_LABELS } from "@/lib/format";

// Amber is the outside line, so it marks the calls that produced a new
// patient. Everything else stays quiet unless it needs attention.
const STYLES: Record<CallOutcome, string> = {
  registered: "border-signal/40 bg-signal-wash text-signal",
  updated: "border-rule bg-paper-raised text-ink-soft",
  confirmed: "border-rule bg-paper-raised text-ink-faint",
  incomplete: "border-alert/40 bg-transparent text-alert",
};

export function OutcomeTag({ outcome }: { outcome: CallOutcome }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.14em] ${STYLES[outcome]}`}
    >
      {OUTCOME_LABELS[outcome]}
    </span>
  );
}
