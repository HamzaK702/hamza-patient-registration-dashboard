import type { CallOutcome } from "@/lib/db";
import { OUTCOME_LABELS } from "@/lib/format";

const STYLES: Record<CallOutcome, string> = {
  registered: "bg-brand-soft text-brand-strong",
  updated: "bg-surface-2 text-ink-soft",
  confirmed: "bg-surface-2 text-ink-faint",
  incomplete: "bg-live-soft text-alert",
};

export function OutcomeTag({ outcome }: { outcome: CallOutcome }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[outcome]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {OUTCOME_LABELS[outcome]}
    </span>
  );
}
