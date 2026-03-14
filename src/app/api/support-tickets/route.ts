import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getAdminEmail, getMailerConfig, sendServerEmail } from "@/lib/server-mail";
import { escapeHtml, formatSupportStatus, generateTicketNumber } from "@/lib/support-tickets";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const MAX_SCREENSHOT_SIZE_BYTES = 2 * 1024 * 1024;

async function fileToDataUrl(file: File) {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  return `data:${file.type};base64,${base64}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const contactNumber = String(formData.get("contactNumber") ?? "").trim();
    const issueSummary = String(formData.get("issueSummary") ?? "").trim();
    const issueDetails = String(formData.get("issueDetails") ?? "").trim();
    const screenshot = formData.get("screenshot");

    if (!fullName || !email || !contactNumber || !issueSummary || !issueDetails) {
      return NextResponse.json(
        { error: "Full name, email, contact number, issue summary, and issue details are required." },
        { status: 400 },
      );
    }

    let screenshotName: string | null = null;
    let screenshotType: string | null = null;
    let screenshotDataUrl: string | null = null;

    if (screenshot instanceof File && screenshot.size > 0) {
      if (screenshot.size > MAX_SCREENSHOT_SIZE_BYTES) {
        return NextResponse.json(
          { error: "Screenshot must be 2 MB or smaller." },
          { status: 400 },
        );
      }

      if (!screenshot.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Screenshot must be an image file." },
          { status: 400 },
        );
      }

      screenshotName = screenshot.name;
      screenshotType = screenshot.type;
      screenshotDataUrl = await fileToDataUrl(screenshot);
    }

    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const currentUser = await getCurrentUser();
    const ticketNumber = generateTicketNumber();

    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        ticket_number: ticketNumber,
        user_id: currentUser?.id ?? null,
        full_name: fullName,
        email,
        contact_number: contactNumber,
        issue_summary: issueSummary,
        issue_details: issueDetails,
        screenshot_name: screenshotName,
        screenshot_type: screenshotType,
        screenshot_data_url: screenshotDataUrl,
        status: "open",
      })
      .select("*")
      .single();

    if (error) {
      console.error("support ticket insert failed", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      const detail =
        process.env.NODE_ENV === "production"
          ? ""
          : ` Supabase error: ${error.message}`;

      return NextResponse.json(
        { error: `Unable to create the support ticket right now.${detail}` },
        { status: 500 },
      );
    }

    const adminEmail = getAdminEmail("support");
    const mailerConfigured = Boolean(getMailerConfig() && adminEmail);
    let message = `Support ticket ${ticketNumber} was created successfully.`;
    let emailDelivery: "sent" | "failed" | "not_configured" = "not_configured";
    let emailError: string | null = null;

    if (mailerConfigured) {
      try {
        await sendServerEmail({
          to: [adminEmail!],
          subject: `New support ticket ${ticketNumber} from ${fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #10233b; line-height: 1.6;">
              <h2>New support ticket</h2>
              <p><strong>Ticket:</strong> ${escapeHtml(ticketNumber)}</p>
              <p><strong>Status:</strong> ${escapeHtml(formatSupportStatus(data.status))}</p>
              <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Contact number:</strong> ${escapeHtml(contactNumber)}</p>
              <p><strong>Issue summary:</strong> ${escapeHtml(issueSummary)}</p>
              <p><strong>Issue details:</strong> ${escapeHtml(issueDetails)}</p>
              <p><strong>Screenshot attached:</strong> ${screenshotName ? "Yes" : "No"}</p>
            </div>
          `,
        });
        emailDelivery = "sent";
      } catch (notificationError) {
        emailDelivery = "failed";
        emailError =
          notificationError instanceof Error ? notificationError.message : "Unable to notify the admin.";
        message = `${message} Admin email failed: ${emailError}`;
      }
    }

    return NextResponse.json({
      ok: true,
      ticket: data,
      ticketNumber,
      emailDelivery,
      emailError,
      message,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the support ticket.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
