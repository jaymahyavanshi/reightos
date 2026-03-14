import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const payloadSchema = z.object({
  paymentRequestId: z.string().uuid(),
  receiptNumber: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in to update your order history." }, { status: 401 });
    }

    const payload = payloadSchema.parse(await request.json());
    const paidAt = new Date().toISOString();

    const { error } = await supabase
      .from("payment_requests")
      .update({
        status: "paid",
        receipt_number: payload.receiptNumber,
        paid_at: paidAt,
        updated_at: paidAt,
      })
      .eq("id", payload.paymentRequestId)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, paidAt });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update payment status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
