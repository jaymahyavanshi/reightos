"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const serviceLevel = searchParams.get("serviceLevel") ?? "Normal delivery";
  const currency = searchParams.get("currency") ?? "USD";
  const amount = Number(searchParams.get("amount") ?? "0");
  const billingName = searchParams.get("billingName") ?? "";
  const billingEmail = searchParams.get("billingEmail") ?? "";
  const paymentMethod = searchParams.get("paymentMethod") ?? "credit_card";
  const paymentInstrumentLabel = searchParams.get("paymentInstrumentLabel") ?? formatPaymentMethod(paymentMethod);
  const paymentRequestId = searchParams.get("paymentRequestId") ?? "";
  const [receiptNumber] = useState(
    () => searchParams.get("receiptNumber") ?? `RCT-${Date.now().toString(36).toUpperCase()}`,
  );

  const receiptUrl = `/api/payment-receipt?${new URLSearchParams({
    serviceLevel,
    amount: amount.toFixed(2),
    currency,
    billingName,
    billingEmail,
    paymentMethod,
    paymentInstrumentLabel,
    paymentRequestId,
    receiptNumber,
  }).toString()}`;

  useEffect(() => {
    let active = true;

    async function completePayment() {
      if (paymentRequestId) {
        try {
          await fetch("/api/payment-request/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentRequestId,
              receiptNumber,
            }),
          });
        } catch {}
      }

      if (active) {
        window.location.assign(receiptUrl);
      }
    }

    const timer = window.setTimeout(() => {
      void completePayment();
    }, 400);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [paymentRequestId, receiptNumber, receiptUrl]);

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Payment complete</p>
          <h1>Your payment was completed successfully.</h1>
          <p className="hero__lead">
            The receipt PDF is being generated now. If the download does not start automatically,
            use the download button below.
          </p>
        </div>
      </section>

      <section className="section section--compact container">
        <div className="split-grid split-grid--equal">
          <article className="feature-card">
            <div className="section-heading section-heading--compact section-heading--small">
              <p className="eyebrow">Receipt summary</p>
              <h2>{receiptNumber || "Receipt pending"}</h2>
            </div>
            <p>
              Payment method: <strong>{formatPaymentMethod(paymentMethod)}</strong>
            </p>
            <p>
              Payment details: <strong>{paymentInstrumentLabel}</strong>
            </p>
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
              Service: <strong>{serviceLevel}</strong>
            </p>
            {paymentRequestId ? (
              <p>
                Request id: <strong>{paymentRequestId}</strong>
              </p>
            ) : null}
          </article>

          <article className="feature-card">
            <div className="section-heading section-heading--compact section-heading--small">
              <p className="eyebrow">Download</p>
              <h2>Receipt PDF</h2>
            </div>
            <p>Keep the receipt as proof of payment for the freight booking.</p>
            <div className="section-cta-inline">
              <a className="button button--primary" href={receiptUrl}>
                Download receipt PDF
              </a>
            </div>
            <div className="section-cta-inline">
              <Link className="button button--secondary" href="/quote">
                Back to quote flow
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
