import { AdminLoginForm } from "@/components/admin-login-form";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { PaymentRequestHistory } from "@/components/payment-request-history";
import { getQuoteAdminPassword, isQuoteAdminAuthenticated } from "@/lib/admin-session";
import { getPaymentRequestSetupMessage } from "@/lib/payment-request-errors";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { PaymentRequestRecord } from "@/lib/types";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    requestId?: string;
    email?: string;
    name?: string;
    service?: string;
  }>;
}) {
  const adminPasswordConfigured = Boolean(getQuoteAdminPassword());
  const isAuthenticated = await isQuoteAdminAuthenticated();
  const params = await searchParams;

  if (!isAuthenticated) {
    return (
      <main className="page-shell page-shell--inner">
        <section className="inner-hero inner-hero--plain">
          <div className="container">
            <p className="eyebrow">Admin</p>
            <h1>Admin access for all user order history.</h1>
            <p className="hero__lead">
              Admin can review every stored order and payment request across all users from this page.
            </p>
          </div>
        </section>

        <section className="section container">
          <div className="auth-shell">
            <div className="auth-card">
              {adminPasswordConfigured ? (
                <>
                  <p className="eyebrow">Admin login</p>
                  <h1>Open the order tracker.</h1>
                  <AdminLoginForm />
                </>
              ) : (
                <>
                  <p className="eyebrow">Admin setup</p>
                  <h1>Set the admin password first.</h1>
                  <p className="auth-card__lead">
                    Add `QUOTE_ADMIN_PASSWORD=your-new-password` to `.env.local`, restart the app,
                    then sign in here.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const adminClient = getSupabaseAdminClient();

  if (!adminClient) {
    return (
      <main className="page-shell page-shell--inner">
        <section className="inner-hero inner-hero--plain">
          <div className="container">
            <p className="eyebrow">Admin</p>
            <h1>Order tracker configuration is incomplete.</h1>
            <p className="hero__lead">
              Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`, then restart the app so the admin page
              can read all rows from `payment_requests` securely.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const requestId = params.requestId?.trim() ?? "";
  const email = params.email?.trim().toLowerCase() ?? "";
  const name = params.name?.trim() ?? "";
  const service = params.service?.trim() ?? "";

  let query = adminClient
    .from("payment_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (requestId) {
    query = query.eq("id", requestId);
  }

  if (email) {
    query = query.ilike("billing_email", `%${email}%`);
  }

  if (name) {
    query = query.ilike("billing_name", `%${name}%`);
  }

  if (service) {
    query = query.ilike("service_level", `%${service}%`);
  }

  const { data: requests, error } = await query;
  const paymentRequests = (requests ?? []) as PaymentRequestRecord[];

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container admin-toolbar">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Track all user order history and payment requests.</h1>
            <p className="hero__lead">
              This page shows every stored order across all users, including payment state, receipt
              details, and route snapshots.
            </p>
          </div>
          <AdminLogoutButton />
        </div>
      </section>

      <section className="section container">
        <div className="quote-console admin-console">
          <div className="quote-console__header">
            <span className="priority priority--must-have">Order tracker</span>
            <h2>Filter requests by request ID, email, name, or service.</h2>
            <p>Results are pulled from the `payment_requests` table and sorted by newest first.</p>
          </div>

          <form className="quote-form" method="GET">
            <div className="quote-form__row">
              <label>
                Request ID
                <input defaultValue={requestId} name="requestId" placeholder="UUID request id" type="text" />
              </label>
              <label>
                Billing email
                <input defaultValue={email} name="email" placeholder="customer@company.com" type="email" />
              </label>
            </div>

            <div className="quote-form__row">
              <label>
                Billing name
                <input defaultValue={name} name="name" placeholder="Ayush Patel" type="text" />
              </label>
              <label>
                Service level
                <input defaultValue={service} name="service" placeholder="Normal delivery" type="text" />
              </label>
            </div>

            <div className="admin-actions">
              <button className="button button--primary" type="submit">
                Search submissions
              </button>
              <a className="button button--secondary" href="/admin">
                Clear filters
              </a>
            </div>
          </form>
        </div>
      </section>

      <section className="section container">
        {error ? (
          <article className="feature-card">
            <h3>Unable to load order history.</h3>
            <p>{getPaymentRequestSetupMessage(error.message)}</p>
          </article>
        ) : (
          <PaymentRequestHistory
            emptyMessage="No quote submissions matched the current filters."
            requests={paymentRequests}
            scope="admin"
          />
        )}
      </section>
    </main>
  );
}
