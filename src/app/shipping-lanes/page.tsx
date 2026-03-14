import Link from "next/link";
import { freightLocations } from "@/lib/quote-data";
import { getFlagEmoji, getShippingLaneHref, shippingLaneCountries } from "@/lib/shipping-lanes";

const popularLane = {
  originCity: "Bangkok, Thailand",
  destinationCity: "London, United Kingdom",
  options: [
    { mode: "FCL 20' Container", transit: "47-61 days", rate: "$3,624" },
    { mode: "LCL 1 CBM", transit: "49-66 days", rate: "$511" },
    { mode: "Air 100 kg", transit: "6-10 days", rate: "$895" },
    { mode: "Express 10 kg", transit: "3-6 days", rate: "$315" },
  ],
};

export default function ShippingLanesPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Global Shipping Routes</p>
          <h1>Discover Global Shipping Routes</h1>
          <p className="hero__lead">
            Select the country and city of origin to view shipping routes. For more live pricing and
            booking options, continue into the freight quote flow.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--wide">
          <p className="eyebrow">Select origin country</p>
          <h2>Explore popular shipping hubs and worldwide route options.</h2>
        </div>
        <div className="capability-grid capability-grid--three">
          {shippingLaneCountries.map((country) => (
            <article className="surface-card" key={country.slug}>
              <h3>
                <span className="country-label">
                  <span className="country-flag" aria-hidden="true">
                    {getFlagEmoji(country.code)}
                  </span>
                  Shipping from {country.name}
                </span>
              </h3>
              <p>
                Explore detailed routes, destination demand, and continue to live quote
                comparison from this origin market.
              </p>
              <Link className="text-link" href={getShippingLaneHref(country.slug)}>
                Explore routes
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container split-grid split-grid--equal">
          <div>
            <div className="section-heading section-heading--compact">
              <p className="eyebrow">Shipping rates near you</p>
              <h2>Recent lane spotlight</h2>
            </div>
            <article className="feature-card">
              <span className="priority priority--must-have">Popular lane</span>
              <h3>
                {popularLane.originCity} to {popularLane.destinationCity}
              </h3>
              <p>
                Here are recent shipping rates and transit times. For more up-to-date options and
                live booking details, continue into the quote flow.
              </p>
              <div className="feature-stack">
                {popularLane.options.map((option) => (
                  <article className="surface-card" key={option.mode}>
                    <h3>{option.mode}</h3>
                    <p>Transit time: {option.transit}</p>
                    <p className="quote-price">{option.rate}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <div>
            <div className="section-heading section-heading--compact">
              <p className="eyebrow">Connected locations</p>
              <h2>Origin countries currently modeled in the quote engine.</h2>
            </div>
            <div className="feature-stack">
              {freightLocations.map((country) => (
                <article className="feature-card" key={country.code}>
                  <h3>
                    <span className="country-label">
                      <span className="country-flag" aria-hidden="true">
                        {getFlagEmoji(country.code)}
                      </span>
                      {country.name}
                    </span>
                  </h3>
                  <p>{country.states.length} states or provinces available for routing calculations.</p>
                  <Link
                    className="text-link"
                    href={getShippingLaneHref(
                      shippingLaneCountries.find((entry) => entry.code === country.code)?.slug ?? "india",
                    )}
                  >
                    Open country page
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container cta-panel">
          <div>
            <p className="eyebrow">Next step</p>
            <h2>Move from lane discovery to live freight rate comparison.</h2>
            <p>
              Use the shipping lanes directory to browse routes, then continue into the quote flow
              for state-aware pricing and shipment estimation.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="button button--primary" href="/quote">
              Compare live rates
            </Link>
            <Link className="button button--secondary button--light" href="/enterprise/demo">
              Request demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
