import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "quote_admin_session";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function getQuoteAdminPassword() {
  const password = process.env.QUOTE_ADMIN_PASSWORD?.trim();
  return password ? password : null;
}

export function getQuoteAdminSessionToken() {
  const password = getQuoteAdminPassword();
  return password ? digest(`quote-admin:${password}`) : null;
}

export function isValidQuoteAdminPassword(password: string) {
  const configuredPassword = getQuoteAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  const provided = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);

  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function isQuoteAdminAuthenticated() {
  const cookieStore = await cookies();
  const current = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!current) {
    return false;
  }

  const sessionToken = getQuoteAdminSessionToken();

  if (!sessionToken) {
    return false;
  }

  const expected = Buffer.from(sessionToken);
  const actual = Buffer.from(current);

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function getQuoteAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}
