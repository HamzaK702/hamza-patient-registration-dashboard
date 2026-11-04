/**
 * Single shared staff login for the dashboard.
 *
 * The credentials are fixed so the dashboard works with no configuration, and
 * can be overridden with DASHBOARD_USERNAME / DASHBOARD_PASSWORD where that
 * matters. Being fixed, they are not a secret: treat this as a lock on the
 * front door of a demo, not as protection for real patient data.
 *
 * A "session" is just a signed, expiring cookie asserting that whoever holds
 * it typed the credentials, signed so it can't be forged by hand-setting a
 * cookie in the browser.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

const COOKIE_NAME = "dashboard_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

const USERNAME = process.env.DASHBOARD_USERNAME ?? "hamza";
const PASSWORD = process.env.DASHBOARD_PASSWORD ?? "hamza123";

/**
 * Deriving the signing key from the credentials means changing them
 * invalidates every session already handed out.
 */
function secret(): string {
  return process.env.DASHBOARD_SESSION_SECRET ?? `${USERNAME}:${PASSWORD}`;
}

/**
 * Constant-time comparison. Both sides are hashed first so that inputs of
 * different lengths can be compared without timingSafeEqual throwing, and so
 * the comparison never leaks the expected length.
 */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest()
  );
}

/** Both halves are always compared, so a wrong username costs the same time as a wrong password. */
export function areCredentialsCorrect(username: string, password: string): boolean {
  const userOk = safeEqual(username.trim().toLowerCase(), USERNAME.toLowerCase());
  const passOk = safeEqual(password, PASSWORD);
  return userOk && passOk;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("hex");
}

function createToken(key: string): string {
  const payload = `${Date.now() + SESSION_TTL_SECONDS * 1000}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload, key)}`;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const key = secret();

  const [expiresAt, nonce, signature] = token.split(".");
  if (!expiresAt || !nonce || !signature) return false;
  if (!safeEqual(signature, sign(`${expiresAt}.${nonce}`, key))) return false;

  return Number(expiresAt) > Date.now();
}

export type Session = { authenticated: true };

/** Memoized per render pass so several data calls don't re-read the cookie. */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  return isValidToken(token) ? { authenticated: true } : null;
});

/** Every data-access function calls this, so no page can leak rows by forgetting to. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function startSession(): Promise<void> {
  (await cookies()).set(COOKIE_NAME, createToken(secret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
