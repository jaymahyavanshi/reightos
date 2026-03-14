import Link from "next/link";
import { QuoteCalculator } from "@/components/quote-calculator";
import { getCurrentUser } from "@/lib/current-user";
import { quoteBenefits } from "@/lib/marketing-data";

export default async function QuotePage() {
  const user = await getCurrentUser();

  return (
    <main className="page-shell page-shell--inner quote-page">
      <section className="inner-hero inner-hero--plain quote-page__hero">
        <div className="container">
          <p className="eyebrow">Get quote</p>
          <h1>Plan the shipment, compare delivery speeds, and move into payment from one booking console.</h1>
          <p className="hero__lead">
            Configure origin, destination, cargo profile, and checkout details in a responsive workflow
            designed for quote-to-book conversion.
          </p>
        </div>
      </section>

      <section className="section section--compact container">
        <QuoteCalculator isAuthenticated={Boolean(user)} />
      </section>

      <section className="section section--compact container">
        <div className="capability-grid capability-grid--three">
          {quoteBenefits.map((benefit) => (
            <article className="surface-card" key={benefit.title}>
              <h3>{benefit.title}</h3>
              <p>{benefit.detail}</p>
            </article>
          ))}
        </div>
        <div className="section-cta-inline">
          <Link className="text-link" href="/enterprise/demo">
            Need a guided enterprise walkthrough instead?
          </Link>
        </div>
      </section>
    </main>
  );
}
