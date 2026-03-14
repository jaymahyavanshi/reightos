"use client";

import { useRouter } from "next/navigation";
import { getSupabaseBrowserSsrClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseBrowserSsrClient();
    if (!supabase) {
      router.push("/");
      router.refresh();
      return;
    }
    await supabase.auth.signOut();

    router.push("/");
    router.refresh();
  }

  return (
    <button className="nav-pill nav-pill--brand" onClick={handleLogout} type="button">
      Logout
    </button>
  );
}
