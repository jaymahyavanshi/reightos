import type {
  ApiGroup,
  Capability,
  Carrier,
  DatabaseTable,
  HeroStat,
  Metric,
  PlatformFeature,
  TradeLane,
} from "@/lib/types";

export type NavigationItem = {
  href: string;
  label: string;
};

export type HeaderGroup = {
  label: string;
  href: string;
};

export type ResourceCard = {
  title: string;
  description: string;
  href: string;
};

export type SolutionCard = {
  title: string;
  description: string;
  bullets: string[];
  href: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export type EnterpriseModule = {
  title: string;
  description: string;
  href: string;
};

export type DeveloperFeature = {
  title: string;
  description: string;
};

export type DemoPoint = {
  title: string;
  detail: string;
};

export type QuoteBenefit = {
  title: string;
  detail: string;
};

export const headerGroups: HeaderGroup[] = [
  { label: "Platform", href: "/platform" },
  { label: "Get Quote", href: "/quote" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Developers", href: "/developers/freight-tools" },
  { label: "Shipping Lanes", href: "/shipping-lanes" },
];

export const heroStats: HeroStat[] = [
  {
    label: "Annualized GMV surfaced",
    value: "$42.8M",
    detail: "Freight marketplace demand across ocean and air",
  },
  {
    label: "Average search speed",
    value: "47 sec",
    detail: "From lane selection to live carrier comparison",
  },
  {
    label: "Integrated logistics partners",
    value: "128",
    detail: "Forwarders, carriers, customs and insurance providers",
  },
];

export const carrierSnapshot: Carrier[] = [
  {
    name: "Maersk Digital",
    mode: "FCL 40HC",
    transitTime: "24 days",
    price: "$2,940",
    reliability: "94%",
  },
  {
    name: "MSC Marketplace",
    mode: "FCL 40HC",
    transitTime: "26 days",
    price: "$2,815",
    reliability: "91%",
  },
  {
    name: "Hapag FastLane",
    mode: "LCL 8 CBM",
    transitTime: "29 days",
    price: "$1,420",
    reliability: "96%",
  },
];

export const capabilities: Capability[] = [
  {
    title: "Instant freight search",
    description:
      "Compare live market rates across carriers and forwarders with transparent all-in pricing and service levels.",
  },
  {
    title: "Digital booking workflow",
    description:
      "Move from quote to confirmed shipment with a streamlined digital booking and approvals experience.",
  },
  {
    title: "Shipment visibility",
    description:
      "Track containers, milestones, delays, and ETAs through one operating layer for shippers and teams.",
  },
  {
    title: "Procurement intelligence",
    description:
      "Benchmark rates, compare vendors, and expose savings opportunities with structured freight analytics.",
  },
];

export const platformFeatures: PlatformFeature[] = [
  {
    title: "Marketplace quote engine",
    description:
      "Core MVP scope from the blueprint: live quote generation for major ocean trade lanes with side-by-side carrier comparison.",
    priority: "Must-have",
  },
  {
    title: "Rate benchmarking analytics",
    description:
      "Historical pricing insights, utilization trends, and carrier performance summaries for procurement teams.",
    priority: "Must-have",
  },
  {
    title: "Notifications and exceptions",
    description:
      "Automated alerts for bookings, documentation deadlines, shipment updates, and delay scenarios.",
    priority: "Important",
  },
  {
    title: "AI-powered rate signals",
    description:
      "A forward-looking layer for rate prediction, delay analytics, and risk scoring across routes and carriers.",
    priority: "Innovative",
  },
];

export const metrics: Metric[] = [
  {
    label: "Quote-to-book conversion",
    value: "31.4%",
    trend: "+6.2% MoM",
  },
  {
    label: "On-time delivery rate",
    value: "92.7%",
    trend: "+1.8% QoQ",
  },
  {
    label: "Carrier response SLA",
    value: "12 min",
    trend: "-4 min vs. baseline",
  },
];

export const apiGroups: ApiGroup[] = [
  {
    name: "/quotes",
    description: "Generate, compare, and store marketplace rate responses.",
  },
  {
    name: "/bookings",
    description: "Create bookings, reserve capacity, and manage commercial confirmation.",
  },
  {
    name: "/shipments",
    description: "Maintain shipment records, milestones, and linked cargo metadata.",
  },
  {
    name: "/tracking",
    description: "Ingest real-time events and expose ETA, status, and exception histories.",
  },
  {
    name: "/analytics",
    description: "Power benchmarking, KPI dashboards, and predictive marketplace insights.",
  },
  {
    name: "/admin",
    description: "Support role-based access, tenant controls, and platform operations.",
  },
];

export const tradeLanes: TradeLane[] = [
  {
    route: "Nhava Sheva -> Los Angeles",
    mode: "FCL 40HC",
    weeklySailings: "19",
    marketRate: "$2,815 - $3,220",
  },
  {
    route: "Shanghai -> New York",
    mode: "FCL 40HC",
    weeklySailings: "24",
    marketRate: "$3,180 - $3,760",
  },
  {
    route: "Rotterdam -> Savannah",
    mode: "LCL 8 CBM",
    weeklySailings: "11",
    marketRate: "$1,190 - $1,540",
  },
];

export const databaseTables: DatabaseTable[] = [
  {
    name: "companies",
    purpose: "Tenant-level shipper, carrier, and forwarder records.",
  },
  {
    name: "quotes",
    purpose: "Rate requests, returned offers, and benchmark snapshots.",
  },
  {
    name: "bookings",
    purpose: "Confirmed shipments, commercial terms, and workflow status.",
  },
  {
    name: "tracking_events",
    purpose: "Milestones, ETA changes, port updates, and operational exceptions.",
  },
  {
    name: "documents",
    purpose: "Commercial invoices, bills of lading, and customs attachments.",
  },
  {
    name: "notifications",
    purpose: "User alerts, channel preferences, and delivery history.",
  },
];

export const solutionCards: SolutionCard[] = [
  {
    title: "Importers & exporters",
    description:
      "Search, compare and manage international freight with a self-serve marketplace experience.",
    bullets: ["Live rate discovery", "Book online", "Track every shipment"],
    href: "/solutions#importers",
  },
  {
    title: "Forwarders & logistics teams",
    description:
      "Extend digital quoting and visibility to customers while keeping operational control in one workspace.",
    bullets: ["Customer quoting", "Rate management", "Operational workflow"],
    href: "/solutions#forwarders",
  },
  {
    title: "Carriers & partners",
    description:
      "Distribute capacity to digital demand channels and surface service quality to freight buyers.",
    bullets: ["Capacity exposure", "Performance analytics", "Marketplace distribution"],
    href: "/solutions#carriers",
  },
];

export const resources: ResourceCard[] = [
  {
    title: "Freight guides",
    description: "Understand containers, incoterms, booking cycles, and trade-lane behavior.",
    href: "/resources#guides",
  },
  {
    title: "Benchmark reports",
    description: "Pricing, ETA, and carrier performance insights for procurement and operations teams.",
    href: "/resources#reports",
  },
  {
    title: "API resources",
    description: "Reference endpoint groups, authentication, and payload patterns for FreightTech integrations.",
    href: "/resources#developer",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "We cut quote turnaround from half a day to minutes and finally got a single lane-level view of cost and delay risk.",
    name: "Priya S.",
    role: "Head of Logistics, consumer electronics importer",
  },
  {
    quote:
      "The workflow mirrors the marketplace experience our operations team expects, but gives us better control of documents and exceptions.",
    name: "Daniel M.",
    role: "Regional forwarding manager",
  },
];

export const companyHighlights = [
  "Marketplace-led freight procurement with enterprise workflow depth",
  "Ocean-first MVP focused on Asia-US and Europe-US trade corridors",
  "Prepared for Supabase auth, storage, Postgres, and future API integrations",
];

export const enterpriseModules: EnterpriseModule[] = [
  {
    title: "Procurement automation",
    description: "Bring search, benchmarking, approvals, and procurement controls into one enterprise freight workflow.",
    href: "/enterprise",
  },
  {
    title: "Team visibility",
    description: "Centralize shipment milestones, vendor performance, and exception monitoring for distributed logistics teams.",
    href: "/enterprise",
  },
  {
    title: "Data connectivity",
    description: "Connect freight search and booking data to ERP, TMS, WMS, and internal analytics surfaces.",
    href: "/developers/freight-tools",
  },
];

export const developerFeatures: DeveloperFeature[] = [
  {
    title: "Quote APIs",
    description: "Search rates, evaluate service options, and ingest dynamic freight data into external systems.",
  },
  {
    title: "Booking workflows",
    description: "Trigger booking creation and synchronize commercial data with downstream platforms.",
  },
  {
    title: "Tracking webhooks",
    description: "Subscribe to shipment events, ETA changes, milestone updates, and exception notifications.",
  },
  {
    title: "Sandbox-first integration",
    description: "Prototype with seeded data and authenticated requests before production rollout.",
  },
];

export const demoPoints: DemoPoint[] = [
  {
    title: "See the enterprise workflow",
    detail: "Walk through quoting, booking, visibility, and analytics in one guided session.",
  },
  {
    title: "Match your operating model",
    detail: "Map the experience to importers, forwarding teams, procurement, and operations stakeholders.",
  },
  {
    title: "Plan your rollout",
    detail: "Use the session to identify integrations, trade lanes, and ownership for launch.",
  },
];

export const quoteBenefits: QuoteBenefit[] = [
  {
    title: "Ocean and air comparisons",
    detail: "Evaluate routes by price, transit time, and service quality side by side.",
  },
  {
    title: "All-in landed pricing",
    detail: "Surface surcharges and commercial assumptions early in the buying journey.",
  },
  {
    title: "Operational follow-through",
    detail: "Move cleanly from search to booking, document collection, and shipment visibility.",
  },
];
