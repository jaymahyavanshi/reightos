import Link from "next/link";
import { SupportTicketForm } from "@/components/support-ticket-form";
import { getCurrentUser } from "@/lib/current-user";

export default async function SupportPage() {
  const user = await getCurrentUser();

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Support</p>
          <h1>Create a support ticket with issue details, contact info, and screenshots.</h1>
          <p className="hero__lead">
            Route operational blockers and product defects into one support queue, then track each
            ticket by status from open to pending to closed.
          </p>
          <div className="link-cluster">
            <Link className="text-link" href="/support/track">
              Track support ticket
            </Link>
            <Link className="text-link" href="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="support-layout">
          <div className="feature-stack">
            <article className="feature-card">
              <span className="priority priority--must-have">Support flow</span>
              <h3>Capture the incident clearly.</h3>
              <p>
                Include the issue summary, exact steps, screenshots, and a direct callback number so
                the admin can reproduce and respond quickly.
              </p>
            </article>
            <article className="feature-card">
              <span className="priority priority--important">Status tracking</span>
              <h3>Track tickets through open, pending, and closed.</h3>
              <p>
                Admins can move tickets across all three states. Users can close their own tickets
                once the problem is resolved.
              </p>
            </article>
            <article className="feature-card">
              <span className="priority priority--innovative">Admin visibility</span>
              <h3>Send every submission to the configured admin email.</h3>
              <p>
                The app uses the same SMTP setup already used in local testing, so the ticket details
                also land in Mailtrap or your real mail provider.
              </p>
            </article>
          </div>

          <SupportTicketForm initialEmail={user?.email} initialName={user?.fullName} />
        </div>
      </section>
    </main>
  );
}
