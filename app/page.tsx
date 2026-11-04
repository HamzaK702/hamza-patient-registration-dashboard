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
import { IntakeLineCard } from "@/components/intake-line-card";
import { getPatients } from "@/lib/db";
import { formatDate, formatPhone } from "@/lib/format";

export default async function PatientsPage() {
  const patients = await getPatients();
  const booked = patients.filter((p) => p.appointment_doctor).length;

  return (
    <AppShell current="patients">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageHeading
          title="Patients"
          lede="Everyone Maya has registered over the phone, newest first."
        />
        <IntakeLineCard />
      </div>

      <Figures>
        <Figure label="Patients on file" value={patients.length} accent />
        <Figure label="Appointments booked" value={booked} />
        <Figure label="Awaiting a booking" value={patients.length - booked} />
      </Figures>

      {patients.length === 0 ? (
        <EmptyState>
          No patients yet. The first person to call the intake line will show up here.
        </EmptyState>
      ) : (
        <TableCard>
          <table className={TABLE}>
            <thead>
              <tr>
                <th scope="col" className={TH}>Patient</th>
                <th scope="col" className={TH}>Date of birth</th>
                <th scope="col" className={TH}>Contact</th>
                <th scope="col" className={TH}>Address</th>
                <th scope="col" className={TH}>Appointment</th>
                <th scope="col" className={TH}>Registered</th>
                <th scope="col" className={`${TH} text-right`}>Call</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.patient_id} className={TR}>
                  <td className={`${TD} whitespace-nowrap`}>
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-xs font-bold text-brand-strong"
                        aria-hidden="true"
                      >
                        {patient.first_name[0]}
                        {patient.last_name[0]}
                      </span>
                      <span>
                        <span className="block font-semibold">
                          {patient.first_name} {patient.last_name}
                        </span>
                        <span className="block text-xs text-ink-faint">{patient.sex}</span>
                      </span>
                    </span>
                  </td>
                  <td className={`${TD} tabular whitespace-nowrap font-mono text-xs text-ink-soft`}>
                    {formatDate(patient.date_of_birth)}
                  </td>
                  <td className={`${TD} tabular whitespace-nowrap font-mono text-xs`}>
                    {formatPhone(patient.phone_number)}
                    {/* Only worth the extra line when they rang in from elsewhere. */}
                    {patient.caller_phone_number &&
                    patient.caller_phone_number !== patient.phone_number ? (
                      <span className="mt-0.5 block text-[11px] text-ink-faint">
                        called from {formatPhone(patient.caller_phone_number)}
                      </span>
                    ) : null}
                  </td>
                  <td className={`${TD} text-ink-soft`}>
                    {patient.address_line_1}
                    {patient.address_line_2 ? `, ${patient.address_line_2}` : ""},{" "}
                    {patient.city}, {patient.state} {patient.zip_code}
                  </td>
                  <td className={`${TD} whitespace-nowrap`}>
                    {patient.appointment_doctor && patient.appointment_date ? (
                      <span className="inline-block rounded-xl bg-brand-soft px-3 py-1.5 text-xs leading-snug">
                        <span className="block font-semibold text-brand-strong">
                          {patient.appointment_doctor}
                        </span>
                        <span className="tabular block font-mono text-[11px] text-ink-soft">
                          {formatDate(patient.appointment_date)}{" "}
                          {patient.appointment_time?.slice(0, 5)}
                        </span>
                      </span>
                    ) : (
                      <span className="text-ink-faint">Not booked</span>
                    )}
                  </td>
                  <td className={`${TD} tabular whitespace-nowrap font-mono text-xs text-ink-faint`}>
                    {formatDate(patient.created_at)}
                  </td>
                  <td className={`${TD} whitespace-nowrap text-right`}>
                    {patient.latest_call_id ? (
                      <Link href={`/calls/${patient.latest_call_id}`} className={LINK}>
                        Transcript →
                      </Link>
                    ) : (
                      <span className="text-xs text-ink-faint">None</span>
                    )}
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
