"use client";

import { FormEvent, useState, useTransition } from "react";

export function DemoRequestForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("fullName") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();

    if (!email || !name || !company) {
      setError("Please complete your work email, full name, and company.");
      return;
    }

    startTransition(async () => {
      const payload = Object.fromEntries(formData.entries());
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Unable to submit your demo request right now.");
        return;
      }

      setSuccess("Demo request submitted. Confirmation has been sent to your email.");
      form.reset();
    });
  }

  return (
    <form className="demo-form surface-card" onSubmit={handleSubmit}>
      <h2>Book your walkthrough</h2>
      <label>
        Work email
        <input name="email" placeholder="you@company.com" required type="email" />
      </label>
      <label>
        Full name
        <input name="fullName" placeholder="Your name" required type="text" />
      </label>
      <label>
        Company
        <input name="company" placeholder="Company name" required type="text" />
      </label>
      <label>
        Team size
        <select defaultValue="25-100" name="teamSize">
          <option>1-25</option>
          <option>25-100</option>
          <option>100-500</option>
          <option>500+</option>
        </select>
      </label>
      <label>
        What do you want to see?
        <textarea
          name="details"
          placeholder="Search, booking, visibility, analytics, integrations..."
          rows={4}
        />
      </label>

      {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
      {success ? <p className="form-feedback form-feedback--success">{success}</p> : null}

      <button className="button button--primary" disabled={pending} type="submit">
        {pending ? "Submitting..." : "Request demo"}
      </button>
    </form>
  );
}
