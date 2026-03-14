import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getAdminEmail, getMailerConfig, sendServerEmail } from "@/lib/server-mail";

type DemoPayload = {
  email: string;
  fullName: string;
  phoneNumber: string;
  company: string;
  teamSize: string;
  details: string;
};

type DemoInsertPayload = {
  full_name: string;
  email: string;
  phone_number: string | null;
  company: string;
  team_size: string | null;
  details: string | null;
  admin_email: string | null;
  status: "submitted" | "notified" | "notification_failed";
  email_delivery: "pending" | "sent" | "not_configured" | "failed";
  confirmation_sent_at?: string | null;
  admin_notified_at?: string | null;
  email_error?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  await sendServerEmail({ to, subject, html });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DemoPayload>;
    const payload: DemoPayload = {
      email: String(body.email ?? "").trim(),
      fullName: String(body.fullName ?? "").trim(),
      phoneNumber: String(body.phoneNumber ?? "").trim(),
      company: String(body.company ?? "").trim(),
      teamSize: String(body.teamSize ?? "").trim(),
      details: String(body.details ?? "").trim(),
    };

    if (!payload.email || !payload.fullName || !payload.phoneNumber || !payload.company) {
      return NextResponse.json(
        { error: "Work email, full name, phone number, and company are required." },
        { status: 400 },
      );
    }

    const escapedName = escapeHtml(payload.fullName);
    const escapedCompany = escapeHtml(payload.company);
    const escapedEmail = escapeHtml(payload.email);
    const escapedPhoneNumber = escapeHtml(payload.phoneNumber || "Not provided");
    const escapedTeamSize = escapeHtml(payload.teamSize || "Not provided");
    const escapedDetails = escapeHtml(payload.details || "Not provided");
    const adminEmail = getAdminEmail("demo");
    const mailerConfigured = Boolean(getMailerConfig() && adminEmail);
    const isDevelopment = process.env.NODE_ENV !== "production";
    const supabase = await getSupabaseServerClient();
    let status: DemoInsertPayload["status"] = "submitted";
    let emailDelivery: DemoInsertPayload["email_delivery"] = "not_configured";
    let confirmationSentAt: string | null = null;
    let adminNotifiedAt: string | null = null;
    let emailError: string | null = null;
    let saveError: string | null = null;
    let message =
      "Demo request submitted and saved. Configure SMTP and DEMO_REQUEST_ADMIN_EMAIL to enable confirmation and admin emails.";

    if (mailerConfigured) {
      try {
        if (!isDevelopment) {
          await sendEmail({
            to: [payload.email],
            subject: "Your Freightos demo request has been received",
            html: `
              <div style="font-family: Arial, sans-serif; color: #10233b; line-height: 1.6;">
                <h2>Thanks for booking a demo, ${escapedName}.</h2>
                <p>We received your request and our team will reach out shortly to schedule the walkthrough.</p>
                <p><strong>Company:</strong> ${escapedCompany}</p>
                <p><strong>Phone number:</strong> ${escapedPhoneNumber}</p>
                <p><strong>Team size:</strong> ${escapedTeamSize}</p>
                <p><strong>Topics requested:</strong> ${escapedDetails}</p>
              </div>
            `,
          });

          await wait(800);
        }

        await sendEmail({
          to: [adminEmail!],
          subject: `New enterprise demo request from ${payload.fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #10233b; line-height: 1.6;">
              <h2>New demo request</h2>
              <p><strong>Name:</strong> ${escapedName}</p>
              <p><strong>Email:</strong> ${escapedEmail}</p>
              <p><strong>Phone number:</strong> ${escapedPhoneNumber}</p>
              <p><strong>Company:</strong> ${escapedCompany}</p>
              <p><strong>Team size:</strong> ${escapedTeamSize}</p>
              <p><strong>Details:</strong> ${escapedDetails}</p>
            </div>
          `,
        });

        const timestamp = new Date().toISOString();
        status = "notified";
        emailDelivery = "sent";
        confirmationSentAt = isDevelopment ? null : timestamp;
        adminNotifiedAt = timestamp;
        message = isDevelopment
          ? "Demo request submitted and admin email was sent."
          : "Demo request submitted. Confirmation and admin emails were sent.";
      } catch (emailFailure) {
        status = "notification_failed";
        emailDelivery = "failed";
        emailError =
          emailFailure instanceof Error ? emailFailure.message : "Email delivery failed after saving the request.";
        message = `Demo request submitted and saved, but email delivery failed: ${emailError}`;
      }
    } else if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Demo request storage and email delivery are not configured. Add Supabase env vars or configure SMTP with DEMO_REQUEST_ADMIN_EMAIL.",
        },
        { status: 500 },
      );
    }

    if (supabase) {
      const insertPayload: DemoInsertPayload = {
        full_name: payload.fullName,
        email: payload.email,
        phone_number: payload.phoneNumber || null,
        company: payload.company,
        team_size: payload.teamSize || null,
        details: payload.details || null,
        admin_email: adminEmail,
        status,
        email_delivery: emailDelivery,
        confirmation_sent_at: confirmationSentAt,
        admin_notified_at: adminNotifiedAt,
        email_error: emailError,
      };

      const { error } = await supabase.from("demo_requests").insert(insertPayload);

      if (error) {
        console.error("demo request insert failed", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        saveError = error.message;
      }
    }

    if (saveError && !mailerConfigured) {
      const detail =
        process.env.NODE_ENV === "production" ? "" : ` Supabase error: ${saveError}`;
      return NextResponse.json(
        { error: `Unable to save your demo request right now.${detail}` },
        { status: 500 },
      );
    }

    if (saveError) {
      const detail =
        process.env.NODE_ENV === "production" ? "" : ` Supabase error: ${saveError}`;
      message = `${message} The request could not be written to Supabase.${detail}`;
    }

    return NextResponse.json({ ok: true, message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit demo request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
