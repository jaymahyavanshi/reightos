"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPaymentMethod(paymentMethod: string) {
  switch (paymentMethod) {
    case "debit_card":
      return "Debit card";
    case "upi":
      return "UPI";
    default:
      return "Credit card";
  }
}

export function HostedCheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceLevel = searchParams.get("serviceLevel") ?? "Normal delivery";
  const currency = searchParams.get("currency") ?? "USD";
  const amount = Number(searchParams.get("amount") ?? "0");
  const billingName = searchParams.get("billingName") ?? "";
  const billingEmail = searchParams.get("billingEmail") ?? "";
  const paymentMethod = searchParams.get("paymentMethod") ?? "credit_card";
  const paymentInstrumentLabel = searchParams.get("paymentInstrumentLabel") ?? formatPaymentMethod(paymentMethod);
  const paymentRequestId = searchParams.get("paymentRequestId") ?? "";
  const [paymentPending, setPaymentPending] = useState(false);

  function handlePaymentComplete() {
    setPaymentPending(true);

    const nextUrl = `/checkout/success?${new URLSearchParams({
      serviceLevel,
      amount: amount.toFixed(2),
      currency,
      billingName,
      billingEmail,
      paymentMethod,
      paymentInstrumentLabel,
      paymentRequestId,
    }).toString()}`;

    router.push(nextUrl);
  }

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Secure checkout</p>
          <h1>Review your payment details and complete the booking.</h1>
          <p className="hero__lead">
            Confirm the payment summary below and continue to finish this shipment order.
          </p>
        </div>
      </section>

      <section className="section section--compact container">
        <div className="split-grid split-grid--equal">
          <article className="feature-card">
            <div className="section-heading section-heading--compact section-heading--small">
              <p className="eyebrow">Payment summary</p>
              <h2>{serviceLevel}</h2>
            </div>
            <p>
              Amount: <strong>{formatCurrency(Number.isFinite(amount) ? amount : 0, currency)}</strong>
            </p>
            <p>
              Billing contact: <strong>{billingName || "Not provided"}</strong>
            </p>
            <p>
              Billing email: <strong>{billingEmail || "Not provided"}</strong>
            </p>
            <p>
              Payment method: <strong>{formatPaymentMethod(paymentMethod)}</strong>
            </p>
            <p>
              Payment details: <strong>{paymentInstrumentLabel}</strong>
            </p>
            {paymentRequestId ? (
              <p>
                Request id: <strong>{paymentRequestId}</strong>
              </p>
            ) : null}
          </article>

          <article className="feature-card">
            <div className="section-heading section-heading--compact section-heading--small">
              <p className="eyebrow">Complete payment</p>
              <h2>Pay now to confirm this shipment order.</h2>
            </div>
            <p>Your booking will be confirmed after the payment step is completed.</p>
            <div className="section-cta-inline">
              <button className="button button--primary" disabled={paymentPending} onClick={handlePaymentComplete} type="button">
                {paymentPending ? "Completing payment..." : `Pay with ${formatPaymentMethod(paymentMethod)}`}
              </button>
            </div>
            <div className="section-cta-inline">
              <Link className="button button--primary" href="/quote">
                Back to quote flow
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
