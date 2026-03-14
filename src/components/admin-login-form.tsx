"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: String(formData.get("password") ?? ""),
          }),
        });

        const result = (await response.json()) as { error?: string };

        if (!response.ok) {
          setError(result.error ?? "Unable to sign in to the admin page.");
          return;
        }

        router.refresh();
      } catch {
        setError("Unable to sign in to the admin page.");
      }
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        Admin password
        <input name="password" placeholder="Enter admin password" required type="password" />
      </label>

      {error ? <p className="auth-form__error">{error}</p> : null}

      <button className="button button--primary auth-form__submit" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Open admin page"}
      </button>
    </form>
  );
}
