import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";
import { Logo } from "@/components/app-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Sign in — Lakeside Family Medicine" };

export default async function LoginPage() {
  if (await getSession()) redirect("/");

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-8 shadow-card">
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Sign in to see patient records and call transcripts. Ask the practice
            manager if you need the details.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
