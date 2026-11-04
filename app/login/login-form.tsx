"use client";

import { useActionState } from "react";

import { login, type LoginState } from "@/lib/actions";

const INITIAL: LoginState = { error: null };

const LABEL = "font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint";
const INPUT =
  "mt-2 w-full border border-rule bg-paper-raised px-3 py-2.5 font-mono text-sm text-ink outline-none transition-colors focus:border-signal focus:ring-1 focus:ring-signal";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label htmlFor="username" className={LABEL}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          required
          aria-describedby={state.error ? "login-error" : undefined}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="password" className={LABEL}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={state.error ? "login-error" : undefined}
          className={INPUT}
        />
      </div>

      {state.error ? (
        <p
          id="login-error"
          role="alert"
          className="border-l-2 border-alert pl-3 text-sm text-alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink px-4 py-2.5 font-condensed text-sm font-semibold uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-50"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
