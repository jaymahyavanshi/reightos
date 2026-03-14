import { getSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  isAdmin: boolean;
};

function getAdminEmails() {
  return [
    process.env.SUPPORT_ADMIN_EMAIL?.trim(),
    process.env.DEMO_REQUEST_ADMIN_EMAIL?.trim(),
  ].filter((value): value is string => Boolean(value));
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const adminEmails = getAdminEmails();
  const metadataRole = user.user_metadata.role as string | undefined;
  const email = user.email ?? "unknown@example.com";

  return {
    id: user.id,
    fullName:
      (user.user_metadata.full_name as string | undefined) ??
      (user.email ? user.email.split("@")[0] : "Member"),
    email,
    company: user.user_metadata.company as string | undefined,
    isAdmin: metadataRole === "admin" || adminEmails.includes(email),
  } satisfies CurrentUser;
}
