import nodemailer from "nodemailer";

export function getAdminEmail(kind: "support" | "demo") {
  if (kind === "support") {
    return process.env.SUPPORT_ADMIN_EMAIL?.trim() || process.env.DEMO_REQUEST_ADMIN_EMAIL?.trim() || null;
  }

  return process.env.DEMO_REQUEST_ADMIN_EMAIL?.trim() || process.env.SUPPORT_ADMIN_EMAIL?.trim() || null;
}

export function getMailerConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim();
  const fromName = process.env.SMTP_FROM_NAME?.trim() || "Freightos Demo";
  const portValue = process.env.SMTP_PORT?.trim();
  const secureValue = process.env.SMTP_SECURE?.trim().toLowerCase();

  if (!host || !user || !pass || !fromEmail) {
    return null;
  }

  const port = portValue ? Number(portValue) : 587;
  if (!Number.isFinite(port)) {
    return null;
  }

  return {
    host,
    port,
    secure: secureValue ? secureValue === "true" : port === 465,
    user,
    pass,
    fromEmail,
    fromName,
  };
}

export async function sendServerEmail({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  const mailer = getMailerConfig();
  if (!mailer) {
    throw new Error(
      "Email delivery is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_EMAIL, and SUPPORT_ADMIN_EMAIL.",
    );
  }

  const transporter = nodemailer.createTransport({
    host: mailer.host,
    port: mailer.port,
    secure: mailer.secure,
    auth: {
      user: mailer.user,
      pass: mailer.pass,
    },
  });

  await transporter.sendMail({
    from: {
      address: mailer.fromEmail,
      name: mailer.fromName,
    },
    to,
    subject,
    html,
  });
}
