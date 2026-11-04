import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell, EmptyState } from "@/components/app-shell";
import { OutcomeTag } from "@/components/outcome-tag";
import { getCall, type TranscriptTurn } from "@/lib/db";
import {
  formatDateTime,
  formatDuration,
  formatPhone,
  formatTime,
} from "@/lib/format";

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="tabular mt-1 font-mono text-sm">{value}</dd>
    </div>
  );
}

/** One chat bubble: Maya on the left, the caller on the right. */
function Turn({ turn, callerName }: { turn: TranscriptTurn; callerName: string }) {
  const isAgent = turn.role === "agent";
  const name = isAgent ? "Maya" : callerName;

  return (
    <li className={`flex items-end gap-2.5 ${isAgent ? "" : "flex-row-reverse"}`}>
      <span
        aria-hidden="true"
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold ${
          isAgent ? "bg-brand text-brand-fg" : "bg-surface-2 text-ink-soft"
        }`}
      >
        {name[0]}
      </span>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 md:max-w-[70%] ${
          isAgent
            ? "rounded-bl-md border border-line bg-surface shadow-card"
            : "rounded-br-md bg-brand-soft"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className={`text-xs font-semibold ${isAgent ? "text-brand" : "text-ink-soft"}`}>
            {name}
          </span>
          <time dateTime={turn.at} className="tabular font-mono text-[11px] text-ink-faint">
            {formatTime(turn.at)}
          </time>
        </div>
        <p className="mt-1 leading-relaxed text-ink">{turn.text}</p>
      </div>
    </li>
  );
}

export default async function TranscriptPage({
  params,
}: PageProps<"/calls/[callId]">) {
  const { callId } = await params;
  const call = await getCall(callId);
  if (!call) notFound();

  const callerName = call.first_name ? call.first_name : "Caller";
  const heading = call.first_name
    ? `${call.first_name} ${call.last_name}`
    : "Unknown caller";

  return (
    <AppShell current="calls">
      <Link
        href="/calls"
        className="text-sm text-ink-soft hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        ← All calls
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h1>
        <OutcomeTag outcome={call.outcome} />
      </div>

      <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 rounded-2xl border border-line bg-surface px-5 py-4 shadow-card">
        <Detail label="Called from" value={formatPhone(call.caller_phone_number)} />
        <Detail label="Started" value={formatDateTime(call.started_at)} />
        <Detail label="Length" value={formatDuration(call.started_at, call.ended_at)} />
        <Detail label="Turns" value={call.turns.length} />
        {call.patient_id ? (
          <Detail
            label="Record"
            value={
              <Link href="/" className="text-brand underline underline-offset-4">
                On file
              </Link>
            }
          />
        ) : null}
      </dl>

      {call.turns.length === 0 ? (
        <EmptyState>This call ended before anything was said.</EmptyState>
      ) : (
        <div className="mx-auto mt-10 max-w-3xl">
          <p className="text-center text-xs text-ink-faint">Call started</p>
          <ol className="mt-5 space-y-4">
            {call.turns.map((turn, index) => (
              <Turn key={`${turn.at}-${index}`} turn={turn} callerName={callerName} />
            ))}
          </ol>
          <p className="mt-6 text-center text-xs text-ink-faint">
            Call ended · {formatDateTime(call.ended_at)}
          </p>
        </div>
      )}
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
