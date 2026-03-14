import Link from "next/link";

const valuePillars = [
  {
    title: "Production-Aligned Visibility",
    description:
      "Track every shipment in one end-to-end operating layer with ERP, MES, and TMS connectivity so production teams see risk before it becomes a line stoppage.",
  },
  {
    title: "Supply Chain Resilience",
    description:
      "Identify vulnerabilities with disruption alerts, capacity forecasting, and contingency routing that protect critical component flows and finished-goods delivery.",
  },
  {
    title: "Strategic Cost Management",
    description:
      "Automate tenders, benchmark market rates, and balance cost against service reliability so procurement teams can protect margins without sacrificing continuity.",
  },
  {
    title: "Manufacturing-Optimized Logistics",
    description:
      "Select carriers and routes using verified shipment history and performance data designed around manufacturing precision and just-in-time execution.",
  },
];

const enterpriseProducts = [
  {
    name: "Terminal™",
    subtitle: "Freight Market Intelligence & Benchmarking",
    bullets: [
      "Real-time spot and contract rate visibility",
      "Dynamic benchmarking for strategic decisions",
      "Key event tracking across weather, geopolitics, and port disruptions",
    ],
    href: "/developers/freight-tools",
  },
  {
    name: "Procure™",
    subtitle: "Automated Freight Tendering & Procurement",
    bullets: [
      "Automate RFQs and reduce procurement time by up to 90%",
      "AI-assisted supplier selection and performance tracking",
      "Multi-modal rate management and cost optimization",
    ],
    href: "/enterprise/demo",
  },
  {
    name: "Rate, Book, & Manage™",
    subtitle: "End-to-End Freight Booking & Operations",
    bullets: [
      "Live pricing and instant booking across modes",
      "Shipment tracking, compliance, and document workflows",
      "ERP/TMS integration paths for operational automation",
    ],
    href: "/quote",
  },
];

const faqs = [
  {
    question: "How does Freightos Enterprise help keep production lines running?",
    answer:
      "By combining market intelligence, predictive alerts, and procurement automation so teams can secure capacity early, reroute critical components, and prioritize continuity over lowest cost.",
  },
  {
    question: "Which freight modes and datasets are supported for manufacturing?",
    answer:
      "The platform supports ocean and air spot and contract rates, lane-level benchmarking, transit-time intelligence, and disruption/event monitoring across major trade corridors.",
  },
  {
    question: "How quickly can teams see savings and workflow impact?",
    answer:
      "Automated procurement can cut RFQ time dramatically, while benchmarking and supplier-performance visibility typically expose quick renegotiation and execution wins in the first quarter.",
  },
];

export default function ManufacturingEnterprisePage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--enterprise">
        <div className="container split-hero">
          <div>
            <p className="eyebrow">Freightos Enterprise</p>
            <h1>In Manufactured Goods Shipping, Freight Delays Halt Production Lines</h1>
            <p className="hero__lead">
              While competitors struggle with supply chain bottlenecks, keep production lines running.
              Gain real-time freight intelligence, automate procurement, and maintain visibility while
              protecting both output and margins.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/enterprise/demo">
                Request a Demo
              </Link>
              <Link className="button button--secondary" href="/enterprise">
                Back to Enterprise
              </Link>
            </div>
          </div>

          <div className="info-stack">
            <article className="metric-card metric-card--light">
              <span>Procurement speed</span>
              <strong>Up to 90%</strong>
              <p>RFQ and tendering time reduction for manufacturing teams.</p>
            </article>
            <article className="metric-card metric-card--light">
              <span>Operational goal</span>
              <strong>Zero line stops</strong>
              <p>Design freight decisions around continuity, not only lowest cost.</p>
            </article>
            <article className="metric-card metric-card--light">
              <span>Visibility model</span>
              <strong>End-to-end</strong>
              <p>Production, procurement, and logistics stakeholders aligned in one flow.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading section-heading--wide">
          <p className="eyebrow">Why manufacturing leaders choose Freightos</p>
          <h2>Replace spreadsheets and manual procurement with a freight workflow aligned to production cycles.</h2>
          <p className="hero__lead">
            When logistics disruptions threaten production, outdated procurement methods lead to line stoppages,
            excess inventory, and missed commitments. Modern teams need freight decisions tied directly to manufacturing outcomes.
          </p>
        </div>
        <div className="capability-grid capability-grid--three">
          <article className="surface-card">
            <h3>Optimized freight intelligence</h3>
            <p>Use real-time benchmarking and market visibility to keep rates as optimized as your manufacturing process.</p>
          </article>
          <article className="surface-card">
            <h3>Supplier selection by continuity</h3>
            <p>Choose carriers and suppliers based on service reliability and resilience, not only lowest-price procurement.</p>
          </article>
          <article className="surface-card">
            <h3>Predictive disruption insight</h3>
            <p>Adapt to supply chain disruptions before they affect production schedules, inventory, or customer commitments.</p>
          </article>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container feature-layout">
          <div className="section-heading section-heading--narrow">
            <p className="eyebrow">End-to-end freight procurement</p>
            <h2>Manufacturing-specific workflows from sourcing through execution.</h2>
          </div>
          <div className="feature-stack">
            {valuePillars.map((pillar) => (
              <article className="feature-card" key={pillar.title}>
                <span className="priority priority--must-have">Manufacturing</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="feature-stack feature-stack--two">
          <article className="feature-card">
            <span className="priority priority--innovative">Customer voice</span>
            <h3>Timely, credible data changes negotiations</h3>
            <p>
              Timely, credible data has been essential in educating leadership and negotiating with carriers.
              Teams avoid millions in unnecessary surcharges simply by validating claims with fresh market data.
            </p>
            <p className="feature-card__meta">Representative enterprise manufacturing outcome</p>
          </article>
          <article className="feature-card">
            <span className="priority priority--important">Operational result</span>
            <h3>Protect margins and output</h3>
            <p>
              Manufacturing organizations can align freight buying with production needs, reduce procurement admin,
              and maintain continuity across critical material and finished-goods movements.
            </p>
            <p className="feature-card__meta">Procurement, logistics, and operations working from one system</p>
          </article>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow--light">Discover Freightos Enterprise Solutions</p>
            <h2>Three product modules for manufacturing freight teams.</h2>
          </div>
          <div className="capability-grid capability-grid--three">
            {enterpriseProducts.map((product) => (
              <article className="metric-card" key={product.name}>
                <span>{product.name}</span>
                <strong>{product.subtitle}</strong>
                <div className="bullet-list bullet-list--light">
                  {product.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </div>
                <Link className="text-link text-link--light" href={product.href}>
                  Explore
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <p className="eyebrow">Frequently asked questions</p>
          <h2>Manufacturing teams usually ask these first.</h2>
        </div>
        <div className="feature-stack">
          {faqs.map((faq) => (
            <article className="feature-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--accent">
        <div className="container cta-panel">
          <div>
            <p className="eyebrow">Explore other verticals</p>
            <h2>Expand beyond manufacturing with the same enterprise platform.</h2>
            <p>Chemical, oil & gas, pharmaceutical, and FMCG workflows can be layered onto the same freight operating model.</p>
          </div>
          <div className="cta-actions">
            <Link className="button button--primary" href="/enterprise/demo">
              Request Demo
            </Link>
            <Link className="button button--secondary button--light" href="/enterprise">
              Enterprise overview
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
