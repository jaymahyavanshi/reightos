"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import type { SupportTicketRecord } from "@/lib/types";

type Props = {
  initialEmail?: string;
  initialTicketNumber?: string;
  isAdmin?: boolean;
  signedIn?: boolean;
};

function formatStatus(status: SupportTicketRecord["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SupportTicketTracker({
  initialEmail = "",
  initialTicketNumber = "",
  isAdmin = false,
  signedIn = false,
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [ticketNumber, setTicketNumber] = useState(initialTicketNumber);
  const [tickets, setTickets] = useState<SupportTicketRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [updatingTicket, setUpdatingTicket] = useState<string | null>(null);

  const loadTickets = useCallback(async (currentEmail: string, currentTicketNumber: string) => {
    setError(null);
    setSuccess(null);

    const params = new URLSearchParams();
    if (!isAdmin && !signedIn) {
      params.set("email", currentEmail);
      params.set("ticketNumber", currentTicketNumber);
    }

    const response = await fetch(`/api/support-tickets/search?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
    const result = (await response.json()) as {
      error?: string;
      tickets?: SupportTicketRecord[];
    };

    if (!response.ok) {
      setTickets([]);
      setError(result.error ?? "Unable to load support tickets.");
      return;
    }

    setTickets(result.tickets ?? []);
    if ((result.tickets ?? []).length === 0) {
      setSuccess("No support tickets matched the current filters.");
    }
  }, [isAdmin, signedIn]);

  useEffect(() => {
    if (isAdmin || signedIn) {
      void loadTickets(initialEmail, "");
      return;
    }

    if (initialTicketNumber && initialEmail) {
      void loadTickets(initialEmail, initialTicketNumber);
    }
  }, [initialEmail, initialTicketNumber, isAdmin, loadTickets, signedIn]);

  function handleSearch() {
    startTransition(async () => {
      await loadTickets(email.trim().toLowerCase(), ticketNumber.trim());
    });
  }

  async function handleStatusUpdate(ticket: SupportTicketRecord, status: SupportTicketRecord["status"]) {
    setUpdatingTicket(ticket.ticket_number);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/support-tickets/${encodeURIComponent(ticket.ticket_number)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          email,
        }),
      });

      const result = (await response.json()) as {
        error?: string;
        message?: string;
        ticket?: SupportTicketRecord;
      };

      if (!response.ok || !result.ticket) {
        setError(result.error ?? "Unable to update the support ticket.");
        return;
      }

      setTickets((current) =>
        current.map((item) => (item.ticket_number === result.ticket?.ticket_number ? result.ticket : item)),
      );
      setSuccess(result.message ?? `Ticket ${ticket.ticket_number} updated.`);
    } catch {
      setError("Unable to update the support ticket.");
    } finally {
      setUpdatingTicket(null);
    }
  }

  return (
    <section className="support-tracker surface-card">
      <div className="support-form__header">
        <p className="eyebrow">Track support ticket</p>
        <h2>{isAdmin ? "Review all submitted support tickets." : "Track status, screenshot, and ownership."}</h2>
        <p>
          {isAdmin
            ? "Admins can move tickets between open, pending, and closed."
            : signedIn
              ? "Signed-in users can review their own tickets and close them when the issue is resolved."
              : "Enter the ticket number and the email used during submission to fetch the current ticket."}
        </p>
      </div>

      {!isAdmin && !signedIn ? (
        <>
          <div className="quote-form__row">
            <label>
              Ticket number
              <input
                onChange={(event) => setTicketNumber(event.target.value)}
                placeholder="SUP-ABC123"
                type="text"
                value={ticketNumber}
              />
            </label>
            <label>
              Email
              <input
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                type="email"
                value={email}
              />
            </label>
          </div>

          <button className="button button--secondary" disabled={pending} onClick={handleSearch} type="button">
            {pending ? "Loading..." : "Track ticket"}
          </button>
        </>
      ) : null}

      {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
      {success ? <p className="form-feedback form-feedback--success">{success}</p> : null}

      <div className="support-ticket-list">
        {tickets.map((ticket) => (
          <article className="support-ticket-card" key={ticket.ticket_number}>
            <div className="support-ticket-card__header">
              <div>
                <span className={`support-status support-status--${ticket.status}`}>{formatStatus(ticket.status)}</span>
                <h3>{ticket.issue_summary}</h3>
                <p>
                  {ticket.ticket_number} · {ticket.full_name} · {ticket.email}
                </p>
              </div>
              <div className="support-ticket-card__meta">
                <span>Updated {formatDate(ticket.updated_at)}</span>
                <strong>{ticket.contact_number}</strong>
              </div>
            </div>

            <p>{ticket.issue_details}</p>

            {ticket.screenshot_data_url ? (
              <a className="support-ticket-card__image" href={ticket.screenshot_data_url} target="_blank" rel="noreferrer">
                <Image
                  alt={`${ticket.ticket_number} screenshot`}
                  height={900}
                  src={ticket.screenshot_data_url}
                  unoptimized
                  width={1200}
                />
                <span>{ticket.screenshot_name ?? "View screenshot"}</span>
              </a>
            ) : (
              <p className="support-ticket-card__muted">No screenshot attached.</p>
            )}

            <div className="support-ticket-card__actions">
              {isAdmin ? (
                <>
                  <button
                    className={`button ${ticket.status === "open" ? "button--primary" : "button--secondary"}`}
                    disabled={updatingTicket === ticket.ticket_number}
                    onClick={() => void handleStatusUpdate(ticket, "open")}
                    type="button"
                  >
                    Open
                  </button>
                  <button
                    className={`button ${ticket.status === "pending" ? "button--primary" : "button--secondary"}`}
                    disabled={updatingTicket === ticket.ticket_number}
                    onClick={() => void handleStatusUpdate(ticket, "pending")}
                    type="button"
                  >
                    Pending
                  </button>
                  <button
                    className={`button ${ticket.status === "closed" ? "button--primary" : "button--secondary"}`}
                    disabled={updatingTicket === ticket.ticket_number}
                    onClick={() => void handleStatusUpdate(ticket, "closed")}
                    type="button"
                  >
                    Closed
                  </button>
                </>
              ) : ticket.status !== "closed" ? (
                <button
                  className="button button--secondary"
                  disabled={updatingTicket === ticket.ticket_number}
                  onClick={() => void handleStatusUpdate(ticket, "closed")}
                  type="button"
                >
                  {updatingTicket === ticket.ticket_number ? "Closing..." : "Close ticket"}
                </button>
              ) : (
                <span className="support-ticket-card__muted">
                  Closed by {ticket.closed_by_email ?? "ticket owner"}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
