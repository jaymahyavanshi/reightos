import { resources } from "@/lib/marketing-data";

export default function ResourcesPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Resources</p>
          <h1>Guides, reports, and developer references for digital freight teams.</h1>
          <p className="hero__lead">
            Inspired by the reference domain’s educational content pattern, with
            topics focused on the blueprint’s freight marketplace scope.
          </p>
        </div>
      </section>

      <section className="section section--compact section--compact-top container">
        <div className="capability-grid capability-grid--three">
          {resources.map((resource) => (
            <article className="surface-card" key={resource.title}>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <a className="text-link" href={resource.href}>
                Open section
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt section--compact">
        <div className="container">
          <div className="feature-stack">
            <article className="surface-card" id="guides">
              <div className="section-heading section-heading--wide section-heading--small">
                <p className="eyebrow">Freight guides</p>
                <h2>Core shipping concepts for procurement and operations teams.</h2>
              </div>
              <ul className="bullet-list">
                <li>Container types, CBM sizing, and cargo planning across FCL, LCL, and air shipments.</li>
                <li>Incoterms, booking windows, customs readiness, and documentation checkpoints.</li>
                <li>Trade-lane behavior, carrier scheduling, rollover risk, and delay planning patterns.</li>
              </ul>
            </article>

            <article className="surface-card" id="reports">
              <div className="section-heading section-heading--wide section-heading--small">
                <p className="eyebrow">Benchmark reports</p>
                <h2>Operational benchmarks for price, ETA, and carrier performance.</h2>
              </div>
              <ul className="bullet-list">
                <li>Lane-level pricing snapshots for high-volume procurement markets.</li>
                <li>Transit reliability and ETA variance patterns by mode and route profile.</li>
                <li>Carrier responsiveness, on-time performance, and service comparison signals.</li>
              </ul>
            </article>

            <article className="surface-card" id="developer">
              <div className="section-heading section-heading--wide section-heading--small">
                <p className="eyebrow">API resources</p>
                <h2>Developer references for quote, booking, tracking, and analytics workflows.</h2>
              </div>
              <ul className="bullet-list">
                <li>Authentication patterns, endpoint groups, and payload structures for integration teams.</li>
                <li>Quote, booking, shipment, and tracking flows aligned to the FreightTech product model.</li>
                <li>Operational data connectivity into ERP, TMS, WMS, and internal analytics platforms.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
