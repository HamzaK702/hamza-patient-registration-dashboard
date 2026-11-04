import Link from "next/link";

import {
  AppShell,
  EmptyState,
  Figure,
  Figures,
  LINK,
  PageHeading,
  TableCard,
  TABLE,
  TD,
  TH,
  TR,
} from "@/components/app-shell";
import { OutcomeTag } from "@/components/outcome-tag";
import { getCalls } from "@/lib/db";
import { formatDateTime, formatDuration, formatPhone } from "@/lib/format";

export default async function CallsPage() {
  const calls = await getCalls();
  const registered = calls.filter((c) => c.outcome === "registered").length;
  const unfinished = calls.filter((c) => c.outcome === "incomplete").length;

  return (
    <AppShell current="calls">
      <PageHeading
        title="Calls"
        lede="Every call the intake line has taken, including the ones that ended before a registration was finished."
      />

      <Figures>
        <Figure label="Calls logged" value={calls.length} accent />
        <Figure label="Ended in a registration" value={registered} />
        <Figure label="Didn't finish" value={unfinished} />
      </Figures>

      {calls.length === 0 ? (
        <EmptyState>
          No calls yet. Transcripts are written when a call ends, so the first one will
          appear here a moment after the caller hangs up.
        </EmptyState>
      ) : (
        <TableCard>
          <table className={TABLE}>
            <thead>
              <tr>
                <th scope="col" className={TH}>Caller</th>
                <th scope="col" className={TH}>From</th>
                <th scope="col" className={TH}>When</th>
                <th scope="col" className={TH}>Length</th>
                <th scope="col" className={TH}>Turns</th>
                <th scope="col" className={TH}>Outcome</th>
                <th scope="col" className={`${TH} text-right`}>Transcript</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call) => (
                <tr key={call.call_id} className={TR}>
                  <td className={`${TD} whitespace-nowrap font-semibold`}>
                    {call.first_name ? `${call.first_name} ${call.last_name}` : "Unknown caller"}
                  </td>
                  <td className={`${TD} whitespace-nowrap tabular font-mono text-xs`}>
                    {formatPhone(call.caller_phone_number)}
                  </td>
                  <td className={`${TD} whitespace-nowrap tabular font-mono text-xs text-ink-soft`}>
                    {formatDateTime(call.ended_at)}
                  </td>
                  <td className={`${TD} whitespace-nowrap tabular font-mono text-xs text-ink-soft`}>
                    {formatDuration(call.started_at, call.ended_at)}
                  </td>
                  <td className={`${TD} whitespace-nowrap tabular font-mono text-xs text-ink-faint`}>
                    {call.turn_count}
                  </td>
                  <td className={`${TD} whitespace-nowrap`}>
                    <OutcomeTag outcome={call.outcome} />
                  </td>
                  <td className={`${TD} whitespace-nowrap text-right`}>
                    <Link href={`/calls/${call.call_id}`} className={LINK}>
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      )}
    </AppShell>
  );
}

export const dynamic = "force-dynamic";
