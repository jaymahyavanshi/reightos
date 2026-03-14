import {
  formatPaymentMethod,
  formatPaymentRequestCurrency,
  formatPaymentRequestStatus,
  getPaymentRequestRoute,
  getPaymentRequestSnapshot,
} from "@/lib/payment-requests";
import type { PaymentRequestRecord } from "@/lib/types";

type Props = {
  emptyMessage: string;
  requests: PaymentRequestRecord[];
  scope: "admin" | "user";
};

export function PaymentRequestHistory({ emptyMessage, requests, scope }: Props) {
  if (requests.length === 0) {
    return (
      <article className="feature-card">
        <h3>No order history yet.</h3>
        <p>{emptyMessage}</p>
      </article>
    );
  }

  return (
    <div className="admin-request-grid">
      {requests.map((request) => {
        const snapshot = getPaymentRequestSnapshot(request.quote_snapshot);

        return (
          <article className="surface-card admin-request-card" key={request.id}>
            <div className="admin-request-card__top">
              <div>
                <span className="priority priority--must-have">{request.service_level}</span>
                <h3>{request.billing_name}</h3>
              </div>
              <div className="admin-request-card__meta">
                <strong>{formatPaymentRequestCurrency(request.amount_estimate, request.currency)}</strong>
                <span>{new Date(request.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className={`order-status order-status--${request.status}`}>
                {formatPaymentRequestStatus(request.status)}
              </span>
            </div>

            <ul className="bullet-list admin-request-list">
              <li>Request ID: {request.id}</li>
              <li>Billing email: {request.billing_email}</li>
              {scope === "admin" ? <li>User ID: {request.user_id ?? "Guest checkout"}</li> : null}
              <li>Route: {getPaymentRequestRoute(request.quote_snapshot)}</li>
              <li>Mode: {snapshot.mode ?? "N/A"}</li>
              <li>Container: {snapshot.container ?? "N/A"}</li>
              <li>Payment method: {formatPaymentMethod(snapshot.paymentMethod)}</li>
              <li>Payment details: {snapshot.paymentInstrumentLabel ?? "Not stored"}</li>
              <li>Receipt number: {request.receipt_number ?? "Pending"}</li>
              <li>Paid at: {request.paid_at ? new Date(request.paid_at).toLocaleString() : "Pending"}</li>
            </ul>
          </article>
        );
      })}
    </div>
  );
}
