import Link from "next/link";
import { developerFeatures } from "@/lib/marketing-data";

const implementationSteps = [
  {
    step: "01",
    title: "Get API access",
    detail:
      "Create a developer account, receive sandbox credentials, and define which quote, booking, and tracking workflows you want to expose first.",
  },
  {
    step: "02",
    title: "Authenticate requests",
    detail:
      "Store your API key securely on the server and attach it to every request before exposing results to internal users or customers.",
  },
  {
    step: "03",
    title: "Search and compare rates",
    detail:
      "Submit shipment details, lane, and cargo profile to the quote endpoint. Persist results so your teams can benchmark and compare options.",
  },
  {
    step: "04",
    title: "Create bookings and sync milestones",
    detail:
      "Turn approved quotes into bookings, then subscribe to milestone and ETA updates through webhook-driven tracking flows.",
  },
];

const endpointGroups = [
  {
    name: "Quote search",
    path: "POST /api/v1/quotes/search",
    detail: "Request live freight options by lane, mode, container type, cargo size, and delivery preferences.",
  },
  {
    name: "Bookings",
    path: "POST /api/v1/bookings",
    detail: "Create a booking from an approved quote and persist commercial details in your TMS or ERP.",
  },
  {
    name: "Shipment tracking",
    path: "GET /api/v1/shipments/{id}",
    detail: "Retrieve shipment milestones, ETAs, event history, and exception information for downstream visibility surfaces.",
  },
  {
    name: "Webhooks",
    path: "POST /api/v1/webhooks/tracking",
    detail: "Push status changes into your internal stack whenever carriers or logistics partners update shipment state.",
  },
];

const implementationNotes = [
  "Run server-side requests only. Do not expose Freight API credentials directly in the browser.",
  "Map quote results to your internal shipment, vendor, and procurement models before rollout.",
  "Use sandbox test lanes first, then promote approved workflows into production after webhook validation.",
];

export default function FreightToolsDeveloperPage() {
  return (
    <main className="page-shell page-shell--inner">
      <section className="inner-hero inner-hero--developer">
        <div className="container split-hero split-hero--docs">
          <div>
            <p className="eyebrow">Freight tools API</p>
            <h1>Integrate freight search, booking, and visibility into your own product stack.</h1>
            <p className="hero__lead">
              Modeled on Freightos API positioning: search rates, select carriers and transport modes,
              automate shipment management, and connect freight execution into your internal systems.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/signup">
                Create developer account
              </Link>
              <Link className="button button--secondary" href="/enterprise/demo">
                Talk to sales
              </Link>
            </div>
          </div>

          <article className="api-panel">
            <p className="eyebrow">Sample endpoints</p>
            <code>POST /quotes/search</code>
            <code>POST /bookings</code>
            <code>GET /shipments/:id</code>
            <code>POST /webhooks/tracking</code>
          </article>
        </div>
      </section>

      <section className="section section--compact container">
        <div className="capability-grid capability-grid--three">
          {developerFeatures.map((feature) => (
            <article className="surface-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt section--compact">
        <div className="container split-grid split-grid--equal split-grid--docs">
          <div>
            <div className="section-heading section-heading--wide section-heading--small section-heading--spaced">
              <p className="eyebrow">How to implement</p>
              <h2>Typical FreightTech integration flow from sandbox to production.</h2>
            </div>
            <div className="feature-stack">
              {implementationSteps.map((item) => (
                <article className="feature-card" key={item.step}>
                  <span className="priority priority--must-have">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="section-heading section-heading--compact section-heading--small section-heading--spaced">
              <p className="eyebrow">Authentication and request shape</p>
              <h2>Implement server-side auth, request signing, and quote ingestion.</h2>
            </div>
            <article className="api-panel">
              <p className="eyebrow">Example request</p>
              <pre className="docs-code">
{`curl -X POST https://api.freight-platform.local/api/v1/quotes/search \\
  -H "Authorization: Bearer YOUR_SERVER_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "originCountry": "IN",
    "originState": "MH",
    "destinationCountry": "US",
    "destinationState": "CA",
    "mode": "ocean",
    "containerType": "40HC",
    "weightKg": 6800
  }'`}
              </pre>
            </article>
            <ul className="bullet-list">
              {implementationNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--compact container">
        <div className="section-heading section-heading--wide section-heading--docs section-heading--endpoint">
          <p className="eyebrow">Endpoint groups</p>
          <h2>Core developer surfaces for quotes, bookings, tracking, and connectivity.</h2>
        </div>
        <div className="capability-grid capability-grid--three">
          {endpointGroups.map((group) => (
            <article className="surface-card" key={group.path}>
              <span className="priority priority--important">{group.name}</span>
              <h3>{group.path}</h3>
              <p>{group.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--alt section--compact">
        <div className="container split-grid split-grid--equal split-grid--docs">
          <article className="feature-card">
            <div className="section-heading section-heading--compact section-heading--small">
              <p className="eyebrow">Webhook pattern</p>
              <h2>Push shipment events into your own systems.</h2>
            </div>
            <p>
              Use webhook delivery for milestone changes, ETA shifts, documentation updates, and
              shipment exceptions. Route those events into your ERP, TMS, WMS, or analytics layer
              to keep procurement and operations aligned.
            </p>
            <pre className="docs-code docs-code--light">
{`{
  "shipmentId": "SHP_102938",
  "status": "in_transit",
  "milestone": "Vessel departed",
  "eta": "2026-03-28T09:00:00Z"
}`}
            </pre>
          </article>

          <article className="feature-card">
            <div className="section-heading section-heading--compact section-heading--small">
              <p className="eyebrow">Where teams use it</p>
              <h2>Common implementation targets across enterprise logistics stacks.</h2>
            </div>
            <ul className="bullet-list">
              <li>Embed instant rate comparison inside an internal procurement workspace.</li>
              <li>Write booked shipment data back into ERP, TMS, and finance approval systems.</li>
              <li>Feed ETA and exception signals into operations dashboards and customer portals.</li>
              <li>Centralize quote, booking, and visibility data for reporting and cost analytics.</li>
            </ul>
            <div className="section-cta-inline">
              <Link className="text-link" href="/enterprise/demo">
                Need implementation guidance from the team?
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
