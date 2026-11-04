"use server";

import { redirect } from "next/navigation";

import { areCredentialsCorrect, endSession, startSession } from "@/lib/auth";

export type LoginState = { error: string | null };

export async function login(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!areCredentialsCorrect(username, password)) {
    // A small delay blunts guessing against a single shared login. The message
    // deliberately doesn't say which half was wrong.
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: "That username and password don't match." };
  }

  await startSession();
  redirect("/");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}
