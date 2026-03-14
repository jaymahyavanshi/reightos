import Link from "next/link";
import { SupportTicketTracker } from "@/components/support-ticket-tracker";
import { getCurrentUser } from "@/lib/current-user";

export default async function SupportTrackPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; ticketNumber?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Support tracking</p>
          <h1>Review support ticket status, screenshots, and closure ownership.</h1>
          <p className="hero__lead">
            Signed-in users see their own tickets automatically. Admins see the full queue. Guests
            can track a specific ticket with the submission email and ticket number.
          </p>
          <div className="link-cluster">
            <Link className="text-link" href="/support">
              Create support ticket
            </Link>
            <Link className="text-link" href="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <SupportTicketTracker
          initialEmail={user?.email ?? params.email ?? ""}
          initialTicketNumber={params.ticketNumber ?? ""}
          isAdmin={user?.isAdmin}
          signedIn={Boolean(user)}
        />
      </section>
    </main>
  );
}
