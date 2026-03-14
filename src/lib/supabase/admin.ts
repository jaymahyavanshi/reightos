import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export function getSupabaseAdminClient() {
  const env = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!env || !serviceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
