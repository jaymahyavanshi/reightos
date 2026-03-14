import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/current-user";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email")?.trim().toLowerCase() ?? "";
    const ticketNumber = url.searchParams.get("ticketNumber")?.trim() ?? "";
    const currentUser = await getCurrentUser();
    const supabase = await getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    if (currentUser?.isAdmin) {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: "Unable to load support tickets." }, { status: 500 });
      }

      return NextResponse.json({ ok: true, tickets: data, admin: true });
    }

    let query = supabase
      .from("support_tickets")
      .select("*")
      .order("updated_at", { ascending: false });

    if (currentUser?.email) {
      query = query.eq("email", currentUser.email.toLowerCase());
    } else {
      if (!email || !ticketNumber) {
        return NextResponse.json(
          { error: "Ticket number and email are required to track a support ticket." },
          { status: 400 },
        );
      }

      query = query.eq("email", email).eq("ticket_number", ticketNumber);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Unable to load support tickets." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, tickets: data, admin: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load support tickets.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
