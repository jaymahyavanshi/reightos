import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentLink, type DeliveryServiceLevel, type PaymentProvider } from "@/lib/payment-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const payloadSchema = z.object({
  billingName: z.string().min(1),
  billingEmail: z.string().email(),
  provider: z.enum(["stripe", "razorpay"]),
  serviceLevel: z.enum(["Normal delivery", "Express delivery", "Superfast delivery"]),
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  quoteSnapshot: z.object({
    originCountry: z.string(),
    originState: z.string(),
    destinationCountry: z.string(),
    destinationState: z.string(),
    mode: z.string(),
    container: z.string(),
    weightKg: z.number(),
    volumeCbm: z.number(),
    distanceKm: z.number(),
  }),
});

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const payload = payloadSchema.parse(raw);
    const paymentLink = getPaymentLink(
      payload.provider as PaymentProvider,
      payload.serviceLevel as DeliveryServiceLevel,
    );

    if (!paymentLink.paymentUrl) {
      const envHints = paymentLink.envKeys.map((key) => `\`${key}\``).join(" or ");

      return NextResponse.json(
        {
          error: `Payment link is not configured for ${payload.provider} ${payload.serviceLevel}. Set ${envHints} in your server environment.`,
        },
        { status: 400 },
      );
    }

    const supabase = await getSupabaseServerClient();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("payment_requests").insert({
        user_id: user?.id ?? null,
        billing_name: payload.billingName,
        billing_email: payload.billingEmail,
        provider: payload.provider,
        service_level: payload.serviceLevel,
        amount_estimate: payload.amount,
        currency: payload.currency,
        status: "initiated",
        quote_snapshot: payload.quoteSnapshot,
      });

      if (error) {
        console.error("payment request insert failed", error.message);
      }
    }

    return NextResponse.json({ ok: true, paymentUrl: paymentLink.paymentUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to initialize payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
