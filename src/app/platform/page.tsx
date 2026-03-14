import {
  apiGroups,
  databaseTables,
  platformFeatures,
  tradeLanes,
} from "@/lib/marketing-data";

export default function PlatformPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Platform architecture</p>
          <h1>Quote engine, booking workflow, tracking, analytics, and data operations.</h1>
          <p className="hero__lead">
            This page maps the blueprint’s features into a practical platform view,
            similar to how Freightos presents marketplace and enterprise capabilities.
          </p>
        </div>
      </section>

      <section className="section container">
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
      </section>

      <section className="section container">
        <div className="split-grid split-grid--equal">
          <article className="architecture-panel">
            <h3>Core endpoint groups</h3>
            <ul>
              {apiGroups.map((group) => (
                <li key={group.name}>
                  <strong>{group.name}</strong>
                  <span>{group.description}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="architecture-panel">
            <h3>Postgres / Supabase schema</h3>
            <ul>
              {databaseTables.map((table) => (
                <li key={table.name}>
                  <strong>{table.name}</strong>
                  <span>{table.purpose}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Launch sequence</p>
            <h2>Ocean-first lanes for the first production rollout.</h2>
          </div>
          <div className="lane-list lane-list--wide">
            {tradeLanes.map((lane) => (
              <article className="lane-card" key={lane.route}>
                <h3>{lane.route}</h3>
                <p>{lane.mode}</p>
                <div>
                  <span>Weekly sailings: {lane.weeklySailings}</span>
                  <strong>{lane.marketRate}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
