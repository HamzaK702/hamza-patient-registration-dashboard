import { Pool } from "pg";

import { requireSession } from "@/lib/auth";

export interface Patient {
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sex: string;
  phone_number: string;
  /** The number the call came from, which can differ from phone_number. */
  caller_phone_number: string | null;
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

export interface PatientRow extends Patient {
  /** Most recent call for this patient, for the "View transcript" link. */
  latest_call_id: string | null;
}

export type CallOutcome = "registered" | "updated" | "confirmed" | "incomplete";

export interface TranscriptTurn {
  role: "agent" | "caller";
  text: string;
  at: string;
}

export interface CallSummary {
  call_id: string;
  room_name: string;
  patient_id: string | null;
  caller_phone_number: string | null;
  outcome: CallOutcome;
  started_at: string | null;
  ended_at: string;
  turn_count: number;
  first_name: string | null;
  last_name: string | null;
}

export interface CallDetail extends Omit<CallSummary, "turn_count"> {
  turns: TranscriptTurn[];
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

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPatients(): Promise<PatientRow[]> {
  await requireSession();

  const { rows } = await pool.query<PatientRow>(
    `SELECT p.*, c.call_id AS latest_call_id
       FROM patients p
       LEFT JOIN LATERAL (
         SELECT call_id
           FROM calls
          WHERE calls.patient_id = p.patient_id
          ORDER BY ended_at DESC
          LIMIT 1
       ) c ON TRUE
      WHERE p.deleted_at IS NULL
      ORDER BY p.created_at DESC`
  );
  return rows;
}

export async function getCalls(): Promise<CallSummary[]> {
  await requireSession();

  const { rows } = await pool.query<CallSummary>(
    `SELECT c.call_id,
            c.room_name,
            c.patient_id,
            c.caller_phone_number,
            c.outcome,
            c.started_at,
            c.ended_at,
            jsonb_array_length(c.turns) AS turn_count,
            p.first_name,
            p.last_name
       FROM calls c
       LEFT JOIN patients p ON p.patient_id = c.patient_id
      ORDER BY c.ended_at DESC
      LIMIT 200`
  );
  return rows;
}

export async function getCall(callId: string): Promise<CallDetail | null> {
  await requireSession();

  // Postgres raises on a malformed uuid literal, which would surface as a 500
  // rather than the 404 a bad URL deserves.
  if (!UUID_RE.test(callId)) return null;

  const { rows } = await pool.query<CallDetail>(
    `SELECT c.call_id,
            c.room_name,
            c.patient_id,
            c.caller_phone_number,
            c.outcome,
            c.started_at,
            c.ended_at,
            c.turns,
            p.first_name,
            p.last_name
       FROM calls c
       LEFT JOIN patients p ON p.patient_id = c.patient_id
      WHERE c.call_id = $1`,
    [callId]
  );
  return rows[0] ?? null;
}
