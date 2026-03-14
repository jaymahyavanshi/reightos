"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="button button--secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/admin/session", { method: "DELETE" });
          router.refresh();
        })
      }
      type="button"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
