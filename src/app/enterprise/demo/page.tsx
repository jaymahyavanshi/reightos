import { DemoRequestForm } from "@/components/demo-request-form";
import { demoPoints } from "@/lib/marketing-data";

export default function EnterpriseDemoPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--plain">
        <div className="container">
          <p className="eyebrow">Request a demo</p>
          <h1>See the enterprise freight workflow in action.</h1>
          <p className="hero__lead">
            This page mirrors the lead-capture structure of the analyzed demo surface:
            a concise value statement on the left and a form-led conversion panel on the right.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="demo-grid">
          <div className="feature-stack">
            {demoPoints.map((point) => (
              <article className="feature-card" key={point.title}>
                <span className="priority priority--must-have">Demo session</span>
                <h3>{point.title}</h3>
                <p>{point.detail}</p>
              </article>
            ))}
          </div>

          <DemoRequestForm />
        </div>
      </section>
    </main>
  );
}
