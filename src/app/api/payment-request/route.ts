import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentLink, type DeliveryServiceLevel, type PaymentProvider } from "@/lib/payment-links";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function getProviderFromPaymentMethod(paymentMethod: "credit_card" | "debit_card" | "upi"): PaymentProvider {
  return paymentMethod === "upi" ? "razorpay" : "stripe";
}

const payloadSchema = z.object({
  billingName: z.string().min(1),
  billingEmail: z.string().email(),
  paymentMethod: z.enum(["credit_card", "debit_card", "upi"]),
  paymentInstrumentLabel: z.string().min(1).max(80),
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
    const provider = getProviderFromPaymentMethod(payload.paymentMethod);
    const paymentLink = getPaymentLink(
      provider,
      payload.serviceLevel as DeliveryServiceLevel,
    );

    const supabase = await getSupabaseServerClient();
    let paymentRequestId: string | null = null;

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("payment_requests")
        .insert({
          user_id: user?.id ?? null,
          billing_name: payload.billingName,
          billing_email: payload.billingEmail,
          provider,
          service_level: payload.serviceLevel,
          amount_estimate: payload.amount,
          currency: payload.currency,
          status: "initiated",
          quote_snapshot: {
            ...payload.quoteSnapshot,
            paymentMethod: payload.paymentMethod,
            paymentInstrumentLabel: payload.paymentInstrumentLabel,
          },
        })
        .select("id")
        .single();

      if (error) {
        console.error("payment request insert failed", error.message);
      } else {
        paymentRequestId = data.id;
      }
    }

    const paymentUrl =
      paymentLink.paymentUrl ??
      `/checkout/hosted?${new URLSearchParams({
        serviceLevel: payload.serviceLevel,
        amount: payload.amount.toFixed(2),
        currency: payload.currency,
        billingName: payload.billingName,
        billingEmail: payload.billingEmail,
        paymentMethod: payload.paymentMethod,
        paymentInstrumentLabel: payload.paymentInstrumentLabel,
        paymentRequestId: paymentRequestId ?? "",
      }).toString()}`;

    return NextResponse.json({
      ok: true,
      paymentUrl,
      paymentMode: paymentLink.paymentUrl ? "hosted" : "sandbox",
      resolvedEnvKey: paymentLink.resolvedEnvKey,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to initialize payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
