import Link from "next/link";
import {
  enterpriseModules,
  metrics,
  platformFeatures,
  testimonials,
} from "@/lib/marketing-data";

export default function EnterprisePage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--enterprise">
        <div className="container split-hero">
          <div>
            <p className="eyebrow">Enterprise logistics</p>
            <h1>Procurement, visibility, and freight execution for larger teams.</h1>
            <p className="hero__lead">
              The live Freightos enterprise surface positions a modular operating layer
              for logistics teams. This page mirrors that structure with product modules,
              operational KPIs, and a stronger conversion path to demo.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/enterprise/demo">
                Request a demo
              </Link>
              <Link className="button button--secondary" href="/developers/freight-tools">
                Explore integrations
              </Link>
            </div>
          </div>
          <div className="info-stack">
            {metrics.map((metric) => (
              <article className="metric-card metric-card--light" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.trend}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="capability-grid capability-grid--three">
          {enterpriseModules.map((module) => (
            <article className="surface-card" key={module.title}>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <Link className="text-link" href={module.href}>
                Explore module
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container feature-layout">
          <div className="section-heading">
            <p className="eyebrow">Platform capabilities</p>
            <h2>Key enterprise building blocks drawn from the blueprint and the live product narrative.</h2>
          </div>
          <div className="feature-stack">
            {platformFeatures.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span className={`priority priority--${feature.priority.toLowerCase()}`}>
                  {feature.priority}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="feature-stack feature-stack--two">
          {testimonials.map((testimonial) => (
            <article className="feature-card" key={testimonial.name}>
              <span className="priority priority--innovative">Customer result</span>
              <h3>{testimonial.name}</h3>
              <p>{testimonial.quote}</p>
              <p className="feature-card__meta">{testimonial.role}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
