"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { getSupabaseBrowserSsrClient } from "@/lib/supabase/browser";

type AuthMode = "login" | "signup";

type Props = {
  mode: AuthMode;
};

export function AuthForm({ mode }: Props) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const payload = Object.fromEntries(formData.entries());
      const supabase = getSupabaseBrowserSsrClient();

      if (!supabase) {
        setError("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
        router.refresh();
        return;
      }

      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: String(payload.email),
          password: String(payload.password),
          options: {
            data: {
              full_name: String(payload.fullName ?? ""),
              company: String(payload.company ?? ""),
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: String(payload.email),
          password: String(payload.password),
        });

        if (loginError) {
          setError(loginError.message);
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">{isSignup ? "Create account" : "Member login"}</p>
        <h1>{isSignup ? "Start managing freight digitally." : "Access your freight workspace."}</h1>
        <p className="auth-card__lead">
          {isSignup
            ? "Create an account with Supabase email/password auth."
            : "Log in with your Supabase email/password account."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup ? (
            <>
              <label>
                Full name
                <input name="fullName" placeholder="Aarav Mehta" required type="text" />
              </label>
              <label>
                Company
                <input name="company" placeholder="Oceanic Imports" required type="text" />
              </label>
            </>
          ) : null}

          <label>
            Email
            <input name="email" placeholder="ops@company.com" required type="email" />
          </label>
          <label>
            Password
            <input
              minLength={8}
              name="password"
              placeholder="At least 8 characters"
              required
              type="password"
            />
          </label>

          {error ? <p className="auth-form__error">{error}</p> : null}

          <button className="button button--primary auth-form__submit" disabled={pending} type="submit">
            {pending
              ? "Processing..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <p className="auth-form__switch">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Log in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
}
