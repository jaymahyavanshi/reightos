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
