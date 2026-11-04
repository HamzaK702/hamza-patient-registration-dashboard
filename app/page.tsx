import Link from "next/link";

import { AppShell, Figure, Figures } from "@/components/app-shell";
import { IntakeLineCard } from "@/components/intake-line-card";
import { getPatients } from "@/lib/db";
import { formatDate, formatPhone } from "@/lib/format";

const TH =
  "px-4 py-3 text-left font-mono text-[10px] font-normal uppercase tracking-[0.14em] text-ink-faint";

export default async function PatientsPage() {
  const patients = await getPatients();
  const booked = patients.filter((p) => p.appointment_doctor).length;

  return (
    <AppShell current="patients">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-condensed text-4xl font-bold uppercase tracking-[0.03em]">
            Patients
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-soft">
            Everyone Maya has registered over the phone, newest first.
          </p>
        </div>

        <IntakeLineCard />
      </div>

      <Figures>
        <Figure label="On file" value={patients.length} accent />
        <Figure label="Appointments booked" value={booked} />
        <Figure label="Awaiting a booking" value={patients.length - booked} />
      </Figures>

      {patients.length === 0 ? (
        <p className="mt-12 border border-dashed border-rule px-6 py-14 text-center text-sm text-ink-soft">
          No patients yet. The first person to call the intake line will show up
          here.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className={TH}>
                  Patient
                </th>
                <th scope="col" className={TH}>
                  Date of birth
                </th>
                <th scope="col" className={TH}>
                  Contact
                </th>
                <th scope="col" className={`${TH} min-w-52`}>
                  Address
                </th>
                <th scope="col" className={TH}>
                  Appointment
                </th>
                <th scope="col" className={TH}>
                  Registered
                </th>
                <th scope="col" className={`${TH} text-right`}>
                  Call
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.patient_id}
                  className="border-b border-rule transition-colors hover:bg-signal-wash/60"
                >
                  <td className="whitespace-nowrap px-4 py-3.5">
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal-wash font-condensed text-xs font-bold uppercase text-signal ring-1 ring-signal/25"
                        aria-hidden="true"
                      >
                        {patient.first_name[0]}
                        {patient.last_name[0]}
                      </span>
                      <span>
                        <span className="font-condensed text-base font-semibold">
                          {patient.first_name} {patient.last_name}
                        </span>
                        <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                          {patient.sex}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs text-ink-soft">
                    {formatDate(patient.date_of_birth)}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs">
                    {formatPhone(patient.phone_number)}
                    {/* Only worth the extra line when they rang in from elsewhere. */}
                    {patient.caller_phone_number &&
                    patient.caller_phone_number !== patient.phone_number ? (
                      <span className="mt-0.5 block text-[10px] text-ink-faint">
                        called from {formatPhone(patient.caller_phone_number)}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 text-ink-soft">
                    {patient.address_line_1}
                    {patient.address_line_2 ? `, ${patient.address_line_2}` : ""},{" "}
                    {patient.city}, {patient.state} {patient.zip_code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-ink-soft">
                    {patient.appointment_doctor && patient.appointment_date ? (
                      <span className="inline-block rounded-md border border-signal/30 bg-signal-wash px-2.5 py-1 text-xs leading-snug">
                        <span className="block font-semibold text-ink">
                          {patient.appointment_doctor}
                        </span>
                        <span className="tabular block font-mono text-[11px] text-ink-soft">
                          {formatDate(patient.appointment_date)}{" "}
                          {patient.appointment_time?.slice(0, 5)}
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="tabular whitespace-nowrap px-4 py-3.5 font-mono text-xs text-ink-faint">
                    {formatDate(patient.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    {patient.latest_call_id ? (
                      <Link
                        href={`/calls/${patient.latest_call_id}`}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                      >
                        Transcript
                      </Link>
                    ) : (
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                        None
                      </span>
                    )}
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
