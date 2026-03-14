import { NextResponse } from "next/server";
import {
  getQuoteAdminPassword,
  getQuoteAdminCookieName,
  getQuoteAdminSessionToken,
  isValidQuoteAdminPassword,
} from "@/lib/admin-session";

export async function POST(request: Request) {
  try {
    const sessionToken = getQuoteAdminSessionToken();

    if (!getQuoteAdminPassword() || !sessionToken) {
      return NextResponse.json(
        { error: "Admin password is not configured. Set QUOTE_ADMIN_PASSWORD in .env.local." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as { password?: string };
    const password = String(body.password ?? "");

    if (!isValidQuoteAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: getQuoteAdminCookieName(),
      value: sessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to create the admin session." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getQuoteAdminCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
