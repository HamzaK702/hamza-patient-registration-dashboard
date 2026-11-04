import Link from "next/link";

import { AppShell, Figure, Figures } from "@/components/app-shell";
import { OutcomeTag } from "@/components/outcome-tag";
import { getCalls } from "@/lib/db";
import { formatDateTime, formatDuration, formatPhone } from "@/lib/format";

const TH =
  "px-4 py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-ink-faint";

export default async function CallsPage() {
  const calls = await getCalls();
  const registered = calls.filter((c) => c.outcome === "registered").length;
  const unfinished = calls.filter((c) => c.outcome === "incomplete").length;

  return (
    <AppShell current="calls">
      <h1 className="font-condensed text-4xl font-bold uppercase tracking-[0.03em]">
        Call log
      </h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
        Every call the intake line has taken, including the ones that ended before
        a registration was finished.
      </p>

      <Figures>
        <Figure label="Calls logged" value={calls.length} accent />
        <Figure label="Ended in a registration" value={registered} />
        <Figure label="Didn't finish" value={unfinished} />
      </Figures>

      {calls.length === 0 ? (
        <p className="mt-12 border border-dashed border-rule px-6 py-14 text-center text-sm text-ink-soft">
          No calls yet. Transcripts are written when a call ends, so the first one
          will appear here a moment after the caller hangs up.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className={TH}>
                  Caller
                </th>
                <th scope="col" className={TH}>
                  From
                </th>
                <th scope="col" className={TH}>
                  When
                </th>
                <th scope="col" className={TH}>
                  Length
                </th>
                <th scope="col" className={TH}>
                  Turns
                </th>
                <th scope="col" className={TH}>
                  Outcome
                </th>
                <th scope="col" className={`${TH} text-right`}>
                  Transcript
                </th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr
                  key={call.call_id}
                  className="border-b border-rule transition-colors hover:bg-signal-wash/60"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-condensed text-base font-semibold">
                    {call.first_name
                      ? `${call.first_name} ${call.last_name}`
                      : "Unknown caller"}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs">
                    {formatPhone(call.caller_phone_number)}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {formatDateTime(call.ended_at)}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {formatDuration(call.started_at, call.ended_at)}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs text-ink-faint">
                    {call.turn_count}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <OutcomeTag outcome={call.outcome} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <Link
                      href={`/calls/${call.call_id}`}
                      className="font-mono text-[11px] uppercase tracking-[0.12em] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                    >
                      View transcript
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
