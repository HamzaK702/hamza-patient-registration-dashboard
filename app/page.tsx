import { getPatients } from "@/lib/db";

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPhone(value: string): string {
  return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
}

function formatAppointment(
  patient: Awaited<ReturnType<typeof getPatients>>[number]
): string {
  if (!patient.appointment_doctor || !patient.appointment_date) return "—";
  const time = patient.appointment_time?.slice(0, 5) ?? "";
  return `${patient.appointment_doctor} · ${formatDate(patient.appointment_date)} ${time}`;
}

export default async function Page() {
  const patients = await getPatients();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Patient Registrations
        </h1>
        <span className="text-sm text-neutral-500">
          {patients.length} {patients.length === 1 ? "patient" : "patients"}
        </span>
      </div>

      {patients.length === 0 ? (
        <p className="text-neutral-500">
          No patients registered yet. Call the voice agent to register one.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">DOB</th>
                <th className="px-4 py-3 font-medium">Sex</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Insurance</th>
                <th className="px-4 py-3 font-medium">Appointment</th>
                <th className="px-4 py-3 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {patients.map((patient) => (
                <tr key={patient.patient_id}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatDate(patient.date_of_birth)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{patient.sex}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatPhone(patient.phone_number)}
                  </td>
                  <td className="px-4 py-3">
                    {patient.address_line_1}
                    {patient.address_line_2 ? `, ${patient.address_line_2}` : ""}
                    , {patient.city}, {patient.state} {patient.zip_code}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {patient.insurance_provider ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatAppointment(patient)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {formatDate(patient.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
