import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { escapeHtml, formatSupportStatus, isSupportTicketStatus } from "@/lib/support-tickets";
import { getAdminEmail, getMailerConfig, sendServerEmail } from "@/lib/server-mail";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ticketNumber: string }> },
) {
  try {
    const { ticketNumber } = await params;
    const body = (await request.json()) as {
      status?: string;
      email?: string;
    };
    const status = String(body.status ?? "").trim();
    const requesterEmail = String(body.email ?? "").trim().toLowerCase();

    if (!isSupportTicketStatus(status)) {
      return NextResponse.json({ error: "Invalid support ticket status." }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const currentUser = await getCurrentUser();
    const { data: ticket, error: lookupError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("ticket_number", ticketNumber)
      .single();

    if (lookupError || !ticket) {
      return NextResponse.json({ error: "Support ticket not found." }, { status: 404 });
    }

    const isOwner =
      (currentUser?.email && currentUser.email.toLowerCase() === ticket.email.toLowerCase()) ||
      requesterEmail === ticket.email.toLowerCase();

    if (!currentUser?.isAdmin && !isOwner) {
      return NextResponse.json({ error: "You do not have permission to update this ticket." }, { status: 403 });
    }

    if (!currentUser?.isAdmin && status !== "closed") {
      return NextResponse.json({ error: "Only admins can move a ticket to open or pending." }, { status: 403 });
    }

    const closedByEmail = status === "closed" ? currentUser?.email ?? requesterEmail ?? ticket.email : null;
    const { data: updated, error: updateError } = await supabase
      .from("support_tickets")
      .update({
        status,
        closed_by_email: closedByEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("ticket_number", ticketNumber)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Unable to update the ticket status." }, { status: 500 });
    }

    const adminEmail = getAdminEmail("support");
    const mailerConfigured = Boolean(getMailerConfig() && adminEmail);

    if (mailerConfigured) {
      const recipient = currentUser?.isAdmin ? ticket.email : adminEmail!;

      try {
        await sendServerEmail({
          to: [recipient],
          subject: `Support ticket ${ticketNumber} updated to ${formatSupportStatus(updated.status)}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #10233b; line-height: 1.6;">
              <h2>Support ticket updated</h2>
              <p><strong>Ticket:</strong> ${escapeHtml(ticketNumber)}</p>
              <p><strong>Status:</strong> ${escapeHtml(formatSupportStatus(updated.status))}</p>
              <p><strong>Issue summary:</strong> ${escapeHtml(updated.issue_summary)}</p>
              <p><strong>Updated by:</strong> ${escapeHtml(currentUser?.email ?? requesterEmail ?? ticket.email)}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("support ticket status email failed", emailError);
      }
    }

    return NextResponse.json({
      ok: true,
      ticket: updated,
      message: `Ticket ${ticketNumber} is now ${formatSupportStatus(updated.status)}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update the support ticket.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
