import { companyHighlights, testimonials } from "@/lib/marketing-data";

export default function CompanyPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Company</p>
          <h1>Why this platform exists and where the roadmap goes next.</h1>
          <p className="hero__lead">
            The blueprint positions this as a digital ocean freight marketplace with
            room for AI, analytics, and enterprise growth. This page packages that
            story in a reference-site style format.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="feature-stack">
          {companyHighlights.map((item) => (
            <article className="feature-card" key={item}>
              <span className="priority priority--must-have">Blueprint fit</span>
              <h3>{item}</h3>
              <p>
                A practical implementation direction for the first release, with room
                for future AI prediction, customs, insurance, and benchmarking.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt">
        <div className="container feature-stack">
          {testimonials.map((item) => (
            <article className="feature-card" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.quote}</p>
              <p className="feature-card__meta">{item.role}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
