import type { CallOutcome } from "@/lib/db";

export function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** 10-digit US numbers as stored by the agent; anything else is shown as-is. */
export function formatPhone(value: string | null): string {
  if (!value) return "—";
  if (value.length !== 10) return value;
  return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
}

export function formatDuration(
  startedAt: string | null,
  endedAt: string | null
): string {
  if (!startedAt || !endedAt) return "—";
  const seconds = Math.round(
    (new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000
  );
  if (seconds < 0) return "—";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

export const OUTCOME_LABELS: Record<CallOutcome, string> = {
  registered: "Registered",
  updated: "Details updated",
  confirmed: "Nothing changed",
  incomplete: "Didn't finish",
};
