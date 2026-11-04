import { Pool } from "pg";

export interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  phone_number: string;
  email: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  zip_code: string;
  insurance_provider: string | null;
  insurance_member_id: string | null;
  preferred_language: string;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  appointment_doctor: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Cache the pool on the global object so Next.js dev-mode hot reloads reuse
// the same pool instead of opening a fresh one (and leaking connections)
// on every edit.
const globalForPg = globalThis as unknown as { pgPool?: Pool };

const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}

export async function getPatients(): Promise<Patient[]> {
  const { rows } = await pool.query<Patient>(
    "SELECT * FROM patients WHERE deleted_at IS NULL ORDER BY created_at DESC"
  );
  return rows;
}
