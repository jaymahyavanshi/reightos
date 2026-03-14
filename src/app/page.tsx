import Link from "next/link";
import { HeroSection } from "@/components/hero-section";
import { VideoShowcase } from "@/components/video-showcase";
import {
  capabilities,
  enterpriseModules,
  companyHighlights,
  metrics,
  quoteBenefits,
  solutionCards,
  testimonials,
} from "@/lib/marketing-data";

export default function Home() {
  return (
    <main className="page-shell">
      <HeroSection />

      <section className="logo-strip container" aria-label="trusted partners">
        <span>Connected to modern freight teams</span>
        <div>
          <p>MAERSK</p>
          <p>MSC</p>
          <p>HAPAG-LLOYD</p>
          <p>DHL GLOBAL</p>
          <p>KUEHNE+NAGEL</p>
        </div>
      </section>

      <section className="section container" id="capabilities">
        <div className="section-heading section-heading--wide section-heading--xwide">
          <p className="eyebrow">What you can do</p>
          <h2>Marketplace search and enterprise freight execution in one product family.</h2>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article className="surface-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-heading section-heading--wide section-heading--xwide">
            <p className="eyebrow">Enterprise modules</p>
            <h2>Modeled on Freightos enterprise positioning: procurement, visibility, and connectivity.</h2>
          </div>
          <div className="capability-grid capability-grid--three">
            {enterpriseModules.map((feature) => (
              <article className="surface-card" key={feature.title}>
                <span className="priority priority--must-have">Enterprise</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link className="text-link" href={feature.href}>
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <VideoShowcase />
      </section>

      <section className="section container">
        <div className="section-heading section-heading--xwide">
          <p className="eyebrow">Quote experience</p>
          <h2>Inspired by the live Freightos search flow.</h2>
        </div>
        <div className="capability-grid capability-grid--three">
          {quoteBenefits.map((item) => (
            <article className="surface-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <Link className="text-link" href="/quote">
                Open quote flow
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--xwide">
          <p className="eyebrow">Audience pathways</p>
          <h2>Separate paths for shippers, logistics teams, and carrier-side partners.</h2>
        </div>
        <div className="capability-grid capability-grid--three">
          {solutionCards.map((card) => (
            <article className="surface-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <ul className="bullet-list">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link className="text-link" href={card.href}>
                Explore solution
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--dark" id="contact">
        <div className="container analytics-grid">
          <div className="analytics-copy">
            <p className="eyebrow eyebrow--light">Enterprise value</p>
            <h2>Benchmark costs, monitor execution, and expose the metrics freight teams care about.</h2>
            <p>
              Conversion, on-time delivery, response SLAs, carrier performance, and route pricing are
              surfaced in a pattern that mirrors the enterprise product narrative.
            </p>
          </div>
          <div className="metric-column">
            {metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.trend}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split-grid split-grid--equal">
          <div>
            <div className="section-heading section-heading--compact section-heading--loose">
              <p className="eyebrow">Platform direction</p>
              <h2>Marketplace, enterprise workflow, and API connectivity from the same system.</h2>
            </div>
            <div className="lane-list">
              {companyHighlights.map((item) => (
                <article className="lane-card" key={item}>
                  <h3>{item}</h3>
                  <p>
                    Aligned to the PDF’s ocean-first MVP, role-based access model,
                    and analytics-first platform direction.
                  </p>
                  <div>
                    <span>Strategic fit</span>
                    <strong>High</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="section-heading section-heading--compact">
              <p className="eyebrow">Customer proof</p>
              <h2>Social proof and operational outcomes, styled like a modern FreightTech site.</h2>
            </div>
            <div className="feature-stack">
              {testimonials.map((item) => (
                <article className="feature-card" key={item.name}>
                  <span className="priority priority--innovative">Customer signal</span>
                  <h3>{item.name}</h3>
                  <p>{item.quote}</p>
                  <p className="feature-card__meta">{item.role}</p>
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
            <h2>Use the marketplace, request an enterprise walkthrough, or integrate the APIs.</h2>
            <p>
              The route structure now follows the analyzed surfaces more closely: public marketing,
              enterprise, demo, quote search, and developer entry points.
            </p>
          </div>
          <div className="cta-actions">
            <Link className="button button--primary" href="/enterprise/demo">
              Request demo
            </Link>
            <Link className="button button--secondary button--light" href="/developers/freight-tools">
              View docs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
