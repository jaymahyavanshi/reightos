import { solutionCards } from "@/lib/marketing-data";

export default function SolutionsPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Solutions</p>
          <h1>Workflows tailored for shippers, forwarders, and carrier partners.</h1>
          <p className="hero__lead">
            The reference site separates personas clearly. This page does the same,
            while staying grounded in the blueprint’s marketplace and management scope.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="persona-grid">
          {solutionCards.map((card) => (
            <article className="surface-card surface-card--tall" id={card.href.split("#")[1]} key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <ul className="bullet-list">
                {card.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
