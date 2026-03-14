import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export function getSupabaseBrowserClient() {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey);
}

export function getSupabaseBrowserSsrClient() {
  const env = getSupabaseEnv();
  if (!env) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
