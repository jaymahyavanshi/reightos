import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Contact us</p>
          <h1>Reach the team for freight support, product help, and implementation questions.</h1>
          <p className="hero__lead">
            Use the support queue for operational issues and the contact page for office details and
            escalation paths.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="capability-grid capability-grid--three">
          <article className="surface-card surface-card--tall">
            <h2>Ahmedabad office</h2>
            <p>Bacancy Technology, 15-16, Times Corporate Park, Thaltej, Ahmedabad, Gujarat 380059.</p>
          </article>
          <article className="surface-card surface-card--tall">
            <h2>Support workflow</h2>
            <p>
              Create a support ticket with issue details, screenshot evidence, contact number, and
              email so the admin can review it in the queue and via email.
            </p>
            <Link className="text-link" href="/support">
              Create support ticket
            </Link>
          </article>
          <article className="surface-card surface-card--tall">
            <h2>Track resolution</h2>
            <p>
              Follow each ticket through open, pending, and closed states. Ticket owners and admins
              can close tickets directly from the tracking page.
            </p>
            <Link className="text-link" href="/support/track">
              Track support ticket
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}
