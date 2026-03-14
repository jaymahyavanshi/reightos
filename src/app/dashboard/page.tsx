import Link from "next/link";
import { redirect } from "next/navigation";
import { PaymentRequestHistory } from "@/components/payment-request-history";
import { getDashboardMetrics, getShipmentPreviews } from "@/lib/data";
import { getCurrentUser } from "@/lib/current-user";
import { tradeLanes } from "@/lib/marketing-data";
import { getPaymentRequestSetupMessage } from "@/lib/payment-request-errors";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PaymentRequestRecord } from "@/lib/types";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const metrics = await getDashboardMetrics();
  const shipments = await getShipmentPreviews();
  const supabase = await getSupabaseServerClient();
  let paymentRequests: PaymentRequestRecord[] = [];
  let paymentRequestError: string | null = null;

  if (supabase) {
    const { data, error } = await supabase
      .from("payment_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      paymentRequestError = getPaymentRequestSetupMessage(error.message);
    } else {
      paymentRequests = (data ?? []) as PaymentRequestRecord[];
    }
  } else {
    paymentRequestError = "Supabase is not configured, so order history is unavailable.";
  }

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user.fullName.split(" ")[0]}.</h1>
          <p className="hero__lead">
            Your dashboard now includes account details, shipment previews, and your own order history.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="capability-grid capability-grid--three">
          {metrics.map((metric) => (
            <article className="surface-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong className="surface-card__value">{metric.value}</strong>
              <p>{metric.trend}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="split-grid split-grid--equal">
          <article className="architecture-panel">
            <h3>Account profile</h3>
            <ul>
              <li>
                <strong>Name</strong>
                <span>{user.fullName}</span>
              </li>
              <li>
                <strong>Email</strong>
                <span>{user.email}</span>
              </li>
              <li>
                <strong>Company</strong>
                <span>{user.company}</span>
              </li>
            </ul>
            {user.isAdmin ? (
              <div className="section-cta-inline">
                <Link className="button button--secondary" href="/admin">
                  Open admin order history
                </Link>
              </div>
            ) : null}
          </article>

          <article className="architecture-panel">
            <h3>Active shipment feed</h3>
            <ul>
              {shipments.map((shipment) => (
                <li key={shipment.id}>
                  <strong>{shipment.bookingReference}</strong>
                  <span>
                    {shipment.status} · {shipment.vessel} · {shipment.locationLabel} · {shipment.etaLabel}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section container" id="order-history">
        <div className="quote-console admin-console">
          <div className="quote-console__header">
            <span className="priority priority--must-have">Order history</span>
            <h2>Only your own orders are visible here.</h2>
            <p>
              Signed-in users can review only their own order history. Admin can review all user
              orders from the separate admin page.
            </p>
          </div>
        </div>
      </section>

      <section className="section container">
        {paymentRequestError ? (
          <article className="feature-card">
            <h3>Unable to load your order history.</h3>
            <p>{paymentRequestError}</p>
          </article>
        ) : (
          <PaymentRequestHistory
            emptyMessage="Create a quote and start checkout to populate your order history."
            requests={paymentRequests}
            scope="user"
          />
        )}
      </section>

      <section className="section container">
        <article className="architecture-panel">
          <h3>Suggested launch lanes</h3>
          <ul>
            {tradeLanes.map((lane) => (
              <li key={lane.route}>
                <strong>{lane.route}</strong>
                <span>
                  {lane.mode} · {lane.marketRate}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section section--accent">
        <div className="container cta-panel">
          <div>
            <p className="eyebrow">Booking tools</p>
            <h2>Move from the dashboard back into quote planning whenever you need a new order.</h2>
            <p>
              New quote submissions will appear in your history automatically when they are created
              under your signed-in account.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="button button--primary" href="/quote">
              Create another quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
