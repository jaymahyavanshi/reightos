import Link from "next/link";
import { redirect } from "next/navigation";
import { getDashboardMetrics, getShipmentPreviews } from "@/lib/data";
import { getCurrentUser } from "@/lib/current-user";
import { tradeLanes } from "@/lib/marketing-data";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const metrics = await getDashboardMetrics();
  const shipments = await getShipmentPreviews();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user.fullName.split(" ")[0]}.</h1>
          <p className="hero__lead">
            This protected page is live now with local session auth. It is ready to
            be migrated to Supabase Auth and database-backed marketplace data later.
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
          </article>

          <article className="architecture-panel">
            <h3>Active shipment feed</h3>
            <ul>
              {shipments.map((shipment) => (
                <li key={shipment.bookingReference}>
                  <strong>{shipment.bookingReference}</strong>
                  <span>
                    {shipment.status} · {shipment.vessel} · {shipment.etaLabel}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        </div>
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
            <p className="eyebrow">Next integration</p>
            <h2>Connect Supabase auth, storage, and Postgres when you are ready.</h2>
            <p>
              The current local flow lets you test the user journey immediately while
              the real backend credentials are still pending.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="button button--primary" href="/platform">
              Review platform
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
