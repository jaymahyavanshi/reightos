import { NextResponse } from "next/server";

const ADMIN_EMAIL = "jay.mahyavanshi@bacancy.com";

type DemoPayload = {
  email: string;
  fullName: string;
  company: string;
  teamSize: string;
  details: string;
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
  to: Array<{ email: string }>;
  subject: string;
  html: string;
}) {
  const token = process.env.MAILTRAP_TOKEN;
  const testInboxId = Number(process.env.MAILTRAP_TEST_INBOX_ID ?? "");
  const fromEmail = process.env.MAILTRAP_FROM_EMAIL;
  const fromName = process.env.MAILTRAP_FROM_NAME ?? "Freightos Demo";

  if (!token || !testInboxId || !fromEmail) {
    throw new Error(
      "Email service is not configured. Add MAILTRAP_TOKEN, MAILTRAP_TEST_INBOX_ID, and MAILTRAP_FROM_EMAIL.",
    );
  }

  const response = await fetch(`https://sandbox.api.mailtrap.io/api/send/${testInboxId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: {
        email: fromEmail,
        name: fromName,
      },
      to,
      subject,
      html,
      category: "Enterprise Demo Request",
    }),
  });

  if (!response.ok) {
    const message = await response.text();

    if (message.includes("Too many emails per second")) {
      throw new Error("Too many test emails were sent too quickly. Please wait a few seconds and try again.");
    }

    throw new Error(message);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DemoPayload>;
    const payload: DemoPayload = {
      email: String(body.email ?? "").trim(),
      fullName: String(body.fullName ?? "").trim(),
      company: String(body.company ?? "").trim(),
      teamSize: String(body.teamSize ?? "").trim(),
      details: String(body.details ?? "").trim(),
    };

    if (!payload.email || !payload.fullName || !payload.company) {
      return NextResponse.json(
        { error: "Work email, full name, and company are required." },
        { status: 400 },
      );
    }

    const escapedName = escapeHtml(payload.fullName);
    const escapedCompany = escapeHtml(payload.company);
    const escapedEmail = escapeHtml(payload.email);
    const escapedTeamSize = escapeHtml(payload.teamSize || "Not provided");
    const escapedDetails = escapeHtml(payload.details || "Not provided");

    await sendEmail({
      to: [{ email: payload.email }],
      subject: "Your Freightos demo request has been received",
      html: `
        <div style="font-family: Arial, sans-serif; color: #10233b; line-height: 1.6;">
          <h2>Thanks for booking a demo, ${escapedName}.</h2>
          <p>We received your request and our team will reach out shortly to schedule the walkthrough.</p>
          <p><strong>Company:</strong> ${escapedCompany}</p>
          <p><strong>Team size:</strong> ${escapedTeamSize}</p>
          <p><strong>Topics requested:</strong> ${escapedDetails}</p>
        </div>
      `,
    });

    await wait(1200);

    await sendEmail({
      to: [{ email: ADMIN_EMAIL }],
      subject: `New enterprise demo request from ${payload.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #10233b; line-height: 1.6;">
          <h2>New demo request</h2>
          <p><strong>Name:</strong> ${escapedName}</p>
          <p><strong>Email:</strong> ${escapedEmail}</p>
          <p><strong>Company:</strong> ${escapedCompany}</p>
          <p><strong>Team size:</strong> ${escapedTeamSize}</p>
          <p><strong>Details:</strong> ${escapedDetails}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit demo request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
