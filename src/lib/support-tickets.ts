import type { SupportTicketRecord, SupportTicketStatus } from "@/lib/types";

export const supportTicketStatuses: SupportTicketStatus[] = ["open", "pending", "closed"];

export function isSupportTicketStatus(value: string): value is SupportTicketStatus {
  return supportTicketStatuses.includes(value as SupportTicketStatus);
}

export function generateTicketNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SUP-${stamp}-${random}`;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatSupportStatus(status: SupportTicketStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function canUserCloseTicket(ticket: SupportTicketRecord, email?: string | null) {
  if (!email) {
    return false;
  }

  return ticket.email.toLowerCase() === email.toLowerCase() && ticket.status !== "closed";
}
