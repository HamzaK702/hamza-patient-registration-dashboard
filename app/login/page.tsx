import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Sign in — Lakeside Family Medicine" };

export default async function LoginPage() {
  if (await getSession()) redirect("/");

  return (
    <div className="flex min-h-full flex-col">
      <div className="h-[3px] bg-signal-lamp" aria-hidden="true" />

      <div className="flex justify-end px-6 pt-4">
        <ThemeToggle className="border-rule text-ink-soft hover:border-ink-faint hover:text-ink" />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Intake line
          </p>
          <h1 className="mt-2 font-condensed text-4xl font-bold uppercase leading-none tracking-[0.03em]">
            Lakeside
            <br />
            Family Medicine
          </h1>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Patient records and call transcripts are behind this login. Ask the
            practice manager if you need the details.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
