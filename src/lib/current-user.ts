import { getSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentUser = {
  fullName: string;
  email: string;
  company?: string;
};

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

  return {
    fullName:
      (user.user_metadata.full_name as string | undefined) ??
      (user.email ? user.email.split("@")[0] : "Member"),
    email: user.email ?? "unknown@example.com",
    company: user.user_metadata.company as string | undefined,
  } satisfies CurrentUser;
}
