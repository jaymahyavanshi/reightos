import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFlagEmoji,
  getModeledCountryByCode,
  getShippingLaneCountry,
  getShippingLaneHref,
  shippingLaneCountries,
} from "@/lib/shipping-lanes";

type ShippingLaneCountryPageProps = {
  params: Promise<{
    country: string;
  }>;
};

export function generateStaticParams() {
  return shippingLaneCountries.map((country) => ({
    country: country.slug,
  }));
}

export default async function ShippingLaneCountryPage({ params }: ShippingLaneCountryPageProps) {
  const { country: countrySlug } = await params;
  const country = getShippingLaneCountry(countrySlug);

  if (!country) {
    notFound();
  }

  const modeledCountry = getModeledCountryByCode(country.code);
  const flag = getFlagEmoji(country.code);
  const visibleStates = modeledCountry?.states.slice(0, 12) ?? [];
  const linkedMarkets = country.demandMarkets
    .map((marketName) => shippingLaneCountries.find((entry) => entry.name === marketName))
    .filter((market): market is NonNullable<typeof market> => Boolean(market));

  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Shipping Lanes Directory</p>
          <h1>
            <span className="country-label country-label--hero">
              <span className="country-flag" aria-hidden="true">
                {flag}
              </span>
              Shipping from {country.name}
            </span>
          </h1>
          <p className="hero__lead">{country.overview}</p>
        </div>
      </section>

      <section className="section container">
        <div className="split-grid split-grid--equal">
          <article className="feature-card">
            <span className="priority priority--must-have">{country.heroLabel}</span>
            <h2>Origin profile</h2>
            <p>
              Start planning from <strong>{country.primaryOrigin}</strong>, then continue into quote
              comparison for route-level pricing, booking, and shipment execution.
            </p>
            <div className="feature-stack">
              <article className="surface-card">
                <h3>Top destination markets</h3>
                <div className="link-cluster">
                  {linkedMarkets.map((market) => (
                    <Link key={market.slug} className="text-link" href={getShippingLaneHref(market.slug)}>
                      <span className="country-label">
                        <span className="country-flag" aria-hidden="true">
                          {getFlagEmoji(market.code)}
                        </span>
                        {market.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </article>
              <article className="surface-card">
                <h3>Next step</h3>
                <p>Continue to the quote engine to calculate shipment cost by mode, size, weight, and distance.</p>
                <Link className="button button--primary" href="/quote">
                  Get a quote
                </Link>
              </article>
            </div>
          </article>

          <article className="feature-card">
            <span className="priority priority--important">Routing coverage</span>
            <h2>Country-level routing detail</h2>
            {modeledCountry ? (
              <>
                <p>
                  {flag} {country.name} currently includes {modeledCountry.states.length} states or provinces
                  in the quote engine. Popular planning points are shown below.
                </p>
                <div className="state-chip-grid">
                  {visibleStates.map((state) => (
                    <article className="state-chip" key={state.code}>
                      <strong>{state.name}</strong>
                      <span>{state.code}</span>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p>
                  Detailed state or province coverage for {country.name} is not in the live quote dataset yet.
                  Use the directory page to browse lanes and continue to the quote flow for supported geographies.
                </p>
                <div className="link-cluster">
                  <Link className="button button--secondary" href="/shipping-lanes">
                    Back to directory
                  </Link>
                  <Link className="button button--primary" href="/quote">
                    Open quote tool
                  </Link>
                </div>
              </>
            )}
          </article>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-heading section-heading--wide">
            <p className="eyebrow">Explore more origins</p>
            <h2>Keep browsing the lane directory by country.</h2>
          </div>
          <div className="capability-grid capability-grid--three">
            {shippingLaneCountries
              .filter((entry) => entry.slug !== country.slug)
              .slice(0, 6)
              .map((entry) => (
                <article className="surface-card" key={entry.slug}>
                  <h3>
                    <span className="country-label">
                      <span className="country-flag" aria-hidden="true">
                        {getFlagEmoji(entry.code)}
                      </span>
                      {entry.name}
                    </span>
                  </h3>
                  <p>{entry.overview}</p>
                  <Link className="text-link" href={getShippingLaneHref(entry.slug)}>
                    Explore routes
                  </Link>
                </article>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
