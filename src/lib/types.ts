export type HeroStat = {
  label: string;
  value: string;
  detail: string;
};

export type Carrier = {
  name: string;
  mode: string;
  transitTime: string;
  price: string;
  reliability: string;
};

export type Capability = {
  title: string;
  description: string;
};

export type PlatformFeature = {
  title: string;
  description: string;
  priority: "Must-have" | "Important" | "Innovative";
};

export type Metric = {
  label: string;
  value: string;
  trend: string;
};

export type ApiGroup = {
  name: string;
  description: string;
};

export type TradeLane = {
  route: string;
  mode: string;
  weeklySailings: string;
  marketRate: string;
};

export type DatabaseTable = {
  name: string;
  purpose: string;
};

export type SupportTicketStatus = "open" | "pending" | "closed";

export type PaymentRequestStatus = "initiated" | "paid" | "failed";

export type PaymentRequestSnapshot = {
  originCountry?: string;
  originState?: string;
  destinationCountry?: string;
  destinationState?: string;
  mode?: string;
  container?: string;
  paymentMethod?: string;
  paymentInstrumentLabel?: string;
  weightKg?: number;
  volumeCbm?: number;
  distanceKm?: number;
};

export type PaymentRequestRecord = {
  id: string;
  user_id: string | null;
  billing_name: string;
  billing_email: string;
  provider: string;
  service_level: string;
  amount_estimate: number | string;
  currency: string;
  status: PaymentRequestStatus;
  quote_snapshot: PaymentRequestSnapshot | null;
  receipt_number: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SupportTicketRecord = {
  id: string;
  ticket_number: string;
  user_id: string | null;
  full_name: string;
  email: string;
  contact_number: string;
  issue_summary: string;
  issue_details: string;
  screenshot_name: string | null;
  screenshot_type: string | null;
  screenshot_data_url: string | null;
  status: SupportTicketStatus;
  closed_by_email: string | null;
  created_at: string;
  updated_at: string;
};
