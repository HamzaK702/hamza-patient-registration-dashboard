import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
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
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
        {label}
      </dt>
      <dd className="tabular mt-1 font-mono text-sm">{value}</dd>
    </div>
  );
}

/**
 * One side of the conversation. The line runs down the middle of the page on
 * wide screens with Maya on the left and the caller on the right; on narrow
 * screens the line moves to the edge and both speakers stack against it.
 */
function Turn({ turn, callerName }: { turn: TranscriptTurn; callerName: string }) {
  const isAgent = turn.role === "agent";

  return (
    <li
      className={`relative pl-12 md:w-1/2 md:pl-0 ${
        isAgent ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"
      }`}
    >
      {/* Sits on the line: the agent's half ends at it, the caller's begins at it. */}
      <span
        aria-hidden="true"
        className={`absolute left-4 top-5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 ${
          isAgent
            ? "border-ink bg-ink md:left-full"
            : "border-signal-lamp bg-paper md:left-0"
        }`}
      />

      <div
        className={`border px-4 py-3 ${
          isAgent
            ? "border-rule bg-paper-raised"
            : "border-signal/25 bg-signal-wash"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
              isAgent ? "text-ink-faint" : "text-signal"
            }`}
          >
            {isAgent ? "Maya" : callerName}
          </span>
          <time
            dateTime={turn.at}
            className="tabular font-mono text-[10px] text-ink-faint"
          >
            {formatTime(turn.at)}
          </time>
        </div>
        <p className="mt-1.5 leading-relaxed text-ink">{turn.text}</p>
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
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
      >
        ← Call log
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-condensed text-4xl font-bold uppercase tracking-[0.03em]">
          {heading}
        </h1>
        <OutcomeTag outcome={call.outcome} />
      </div>

      <dl className="mt-7 flex flex-wrap gap-x-12 gap-y-5 border-y border-rule py-5">
        <Detail label="Called from" value={formatPhone(call.caller_phone_number)} />
        <Detail label="Started" value={formatDateTime(call.started_at)} />
        <Detail
          label="Length"
          value={formatDuration(call.started_at, call.ended_at)}
        />
        <Detail label="Turns" value={call.turns.length} />
        {call.patient_id ? (
          <Detail
            label="Record"
            value={
              <Link
                href="/"
                className="text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal"
              >
                On file
              </Link>
            }
          />
        ) : null}
      </dl>

      {call.turns.length === 0 ? (
        <p className="mt-12 border border-dashed border-rule px-6 py-14 text-center text-sm text-ink-soft">
          This call ended before anything was said.
        </p>
      ) : (
        <div className="relative mt-10">
          {/* The line itself: the same amber rule that sits under the header. */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-4 top-0 w-px bg-signal-lamp/45 md:left-1/2"
          />

          <p className="relative pl-12 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint md:pl-0 md:text-center">
            Line opened
          </p>

          <ol className="mt-6 space-y-5">
            {call.turns.map((turn, index) => (
              <Turn
                key={`${turn.at}-${index}`}
                turn={turn}
                callerName={callerName}
              />
            ))}
          </ol>

          <p className="relative mt-6 pl-12 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint md:pl-0 md:text-center">
            Line closed · {formatDateTime(call.ended_at)}
          </p>
        </div>
      )}
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
