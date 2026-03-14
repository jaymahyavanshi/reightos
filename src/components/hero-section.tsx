import Link from "next/link";
import { heroStats } from "@/lib/marketing-data";
import { getMarketplaceQuotes } from "@/lib/data";

export async function HeroSection() {
  const carrierSnapshot = await getMarketplaceQuotes();

  return (
    <section className="hero hero--home">
      <div className="hero__glow hero__glow--left" />
      <div className="hero__glow hero__glow--right" />

      <div className="container hero__body" id="top">
        <div className="hero__copy">
          <h1>Cut Freight Procurement from Days to Minutes</h1>
          <p className="hero__lead">
            Drop the spreadsheets and slow negotiations. Benchmark and compare rates instantly,
            automate tenders, and manage bookings in one place. Your solution for total freight control.
          </p>
          <div className="hero__micro-links">
            <Link href="/enterprise">Enterprise logistics teams</Link>
            <Link href="/enterprise/demo">Book a demo</Link>
            <Link href="/developers/freight-tools">Explore APIs</Link>
          </div>
          <div className="hero__actions">
            <Link className="button button--primary" href="/quote">
              Get a quote
            </Link>
            <Link className="button button--secondary" href="/enterprise">
              Explore enterprise
            </Link>
          </div>
          <div className="stat-grid">
            {heroStats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <p>{stat.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="hero__panel">
          <div className="signal-board">
            <div className="signal-board__header">
              <div>
                <p>Live quote snapshot</p>
                <h2>India to North America</h2>
              </div>
              <span className="pill">Marketplace live</span>
            </div>

            <div className="signal-board__search">
              <div>
                <span>Origin</span>
                <strong>Nhava Sheva, INNSA</strong>
              </div>
              <div>
                <span>Destination</span>
                <strong>Los Angeles, USLAX</strong>
              </div>
              <div>
                <span>Cargo</span>
                <strong>1 x 40HC, General</strong>
              </div>
            </div>

            <div className="rate-table">
              {carrierSnapshot.map((carrier) => (
                <article className="rate-row" key={carrier.carrierName}>
                  <div>
                    <strong>{carrier.carrierName}</strong>
                    <span>{carrier.mode}</span>
                  </div>
                  <div>
                    <span>Transit</span>
                    <strong>{carrier.transitTime}</strong>
                  </div>
                  <div>
                    <span>Reliability</span>
                    <strong>{carrier.reliability}</strong>
                  </div>
                  <div>
                    <span>Total landed</span>
                    <strong>{carrier.price}</strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="signal-board__footer">
              <p>Search rates like the marketplace, then continue into booking, documents, and shipment visibility.</p>
              <Link href="/quote">Start search</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
