import type { PaymentRequestRecord, PaymentRequestSnapshot, PaymentRequestStatus } from "@/lib/types";

export function formatPaymentRequestCurrency(amount: number | string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(typeof amount === "number" ? amount : Number(amount));
}

export function formatPaymentMethod(value: unknown) {
  if (value === "upi") {
    return "UPI";
  }

  if (value === "debit_card") {
    return "Debit card";
  }

  return "Credit card";
}

export function formatPaymentRequestStatus(status: PaymentRequestStatus) {
  if (status === "paid") {
    return "Paid";
  }

  if (status === "failed") {
    return "Failed";
  }

  return "Initiated";
}

export function getPaymentRequestSnapshot(snapshot: PaymentRequestRecord["quote_snapshot"]): PaymentRequestSnapshot {
  return (snapshot ?? {}) as PaymentRequestSnapshot;
}

export function getPaymentRequestRoute(snapshot: PaymentRequestRecord["quote_snapshot"]) {
  const details = getPaymentRequestSnapshot(snapshot);

  return `${details.originCountry ?? "N/A"} / ${details.originState ?? "N/A"} to ${details.destinationCountry ?? "N/A"} / ${details.destinationState ?? "N/A"}`;
}
