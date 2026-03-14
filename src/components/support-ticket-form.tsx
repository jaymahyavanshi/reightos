"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useTransition } from "react";

type Props = {
  initialEmail?: string;
  initialName?: string;
};

export function SupportTicketForm({ initialEmail = "", initialName = "" }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState(initialEmail);
  const [pending, startTransition] = useTransition();
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const supportTrackHref = useMemo(() => {
    if (!ticketNumber || !submittedEmail) {
      return "/support/track";
    }

    return `/support/track?ticketNumber=${encodeURIComponent(ticketNumber)}&email=${encodeURIComponent(submittedEmail)}`;
  }, [submittedEmail, ticketNumber]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setTicketNumber(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    startTransition(async () => {
      try {
        const response = await fetch("/api/support-tickets", {
          method: "POST",
          body: formData,
        });

        const result = (await response.json()) as {
          error?: string;
          message?: string;
          ticketNumber?: string;
        };

        if (!response.ok) {
          setError(result.error ?? "Unable to create the support ticket right now.");
          return;
        }

        setSuccess(result.message ?? "Support ticket created.");
        setTicketNumber(result.ticketNumber ?? null);
        setSubmittedEmail(email);
        setSelectedFileName("");
        form.reset();
      } catch {
        setError("Unable to create the support ticket right now.");
      }
    });
  }

  return (
    <form className="support-form quote-console support-console" onSubmit={handleSubmit}>
      <div className="support-form__header quote-console__header">
        <p className="eyebrow">Create support ticket</p>
        <h2>Report issues with enough context for the admin to act fast.</h2>
        <p>
          Submit the issue summary, detailed description, contact details, and a screenshot when the
          problem is visual. The admin notification uses your current SMTP setup.
        </p>
      </div>

      <section className="quote-section support-section support-section--contact">
        <div className="quote-section__title">
          <span>01</span>
          <div>
            <h3>Contact details</h3>
            <p>Who should the team contact back</p>
          </div>
        </div>
        <div className="quote-form__row">
          <label>
            Full name
            <input defaultValue={initialName} name="fullName" placeholder="Ayush Patel" required type="text" />
          </label>
          <label>
            Email
            <input defaultValue={initialEmail} name="email" placeholder="you@company.com" required type="email" />
          </label>
        </div>
        <div className="quote-form__row">
          <label>
            Contact number
            <input name="contactNumber" placeholder="+91 98765 43210" required type="tel" />
          </label>
          <label>
            Issue summary
            <input name="issueSummary" placeholder="Checkout error on Stripe redirect" required type="text" />
          </label>
        </div>
      </section>

      <section className="quote-section support-section support-section--issue">
        <div className="quote-section__title">
          <span>02</span>
          <div>
            <h3>Issue details</h3>
            <p>Describe the problem and the expected behavior</p>
          </div>
        </div>
        <label>
          Describe the issue
          <textarea
            name="issueDetails"
            placeholder="Explain what happened, which page you were on, the steps you took, and what you expected."
            required
            rows={6}
          />
        </label>
      </section>

      <section className="quote-section support-section support-section--evidence">
        <div className="quote-section__title">
          <span>03</span>
          <div>
            <h3>Evidence</h3>
            <p>Attach a screenshot when the issue is visual or reproducible</p>
          </div>
        </div>
        <label className="support-upload">
          Screenshot
          <input
            accept="image/*"
            name="screenshot"
            onChange={(event) => setSelectedFileName(event.target.files?.[0]?.name ?? "")}
            type="file"
          />
          <span>{selectedFileName || "Optional. Upload a PNG, JPG, or WebP screenshot up to 2 MB."}</span>
        </label>
      </section>

      {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
      {success ? <p className="form-feedback form-feedback--success">{success}</p> : null}

      {ticketNumber ? (
        <article className="support-ticket-confirmation">
          <span>Ticket number</span>
          <strong>{ticketNumber}</strong>
          <Link className="text-link" href={supportTrackHref}>
            Track this ticket
          </Link>
        </article>
      ) : null}

      <button className="button button--primary" disabled={pending} type="submit">
        {pending ? "Creating ticket..." : "Submit support ticket"}
      </button>
    </form>
  );
}
