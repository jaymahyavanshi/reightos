import { freightLocations } from "@/lib/quote-data";

export type ShippingLaneCountry = {
  name: string;
  code: string;
  slug: string;
  heroLabel: string;
  overview: string;
  primaryOrigin: string;
  demandMarkets: string[];
};

export const shippingLaneCountries: ShippingLaneCountry[] = [
  {
    name: "Canada",
    code: "CA",
    slug: "canada",
    heroLabel: "North American export gateway",
    overview:
      "Compare routes from major Canadian production and distribution hubs into Europe, Asia, and the United States.",
    primaryOrigin: "Toronto, Ontario",
    demandMarkets: ["Germany", "United Kingdom", "United States"],
  },
  {
    name: "France",
    code: "FR",
    slug: "france",
    heroLabel: "European multimodal shipping base",
    overview:
      "Review routes from France into global demand centers with lane planning for retail, industrial, and e-commerce cargo.",
    primaryOrigin: "Paris, Ile-de-France",
    demandMarkets: ["India", "Singapore", "United States"],
  },
  {
    name: "India",
    code: "IN",
    slug: "india",
    heroLabel: "High-volume manufacturing origin",
    overview:
      "Explore Indian shipping lanes for ocean, air, and expedited cargo with state-level routing support already modeled in the quote engine.",
    primaryOrigin: "Mumbai, Maharashtra",
    demandMarkets: ["Germany", "Singapore", "United States"],
  },
  {
    name: "China",
    code: "CN",
    slug: "china",
    heroLabel: "Global export powerhouse",
    overview:
      "View China-origin route planning for electronics, industrial, and consumer goods moving into high-demand import markets.",
    primaryOrigin: "Shanghai, Shanghai",
    demandMarkets: ["Germany", "United Kingdom", "United States"],
  },
  {
    name: "Germany",
    code: "DE",
    slug: "germany",
    heroLabel: "Central Europe fulfillment hub",
    overview:
      "Assess export and cross-border routes from Germany for automotive, industrial, and enterprise distribution flows.",
    primaryOrigin: "Hamburg, Hamburg",
    demandMarkets: ["India", "Singapore", "United States"],
  },
  {
    name: "Hong Kong",
    code: "HK",
    slug: "hong-kong",
    heroLabel: "Asia trade and finance gateway",
    overview:
      "Use Hong Kong as a fast-moving regional origin for premium cargo, re-exports, and Asia-Pacific fulfillment operations.",
    primaryOrigin: "Hong Kong",
    demandMarkets: ["Germany", "United Kingdom", "United States"],
  },
  {
    name: "Indonesia",
    code: "ID",
    slug: "indonesia",
    heroLabel: "Southeast Asia archipelago origin",
    overview:
      "Model lane planning from Indonesia into North America, Europe, and intra-Asia trade corridors.",
    primaryOrigin: "Jakarta, Jakarta",
    demandMarkets: ["India", "Singapore", "United States"],
  },
  {
    name: "Malaysia",
    code: "MY",
    slug: "malaysia",
    heroLabel: "Regional manufacturing connector",
    overview:
      "Analyze Malaysia origin routes for electronics, semiconductors, and industrial freight moving across global buyer markets.",
    primaryOrigin: "Kuala Lumpur, Selangor",
    demandMarkets: ["Germany", "Singapore", "United States"],
  },
  {
    name: "Republic of Korea",
    code: "KR",
    slug: "republic-of-korea",
    heroLabel: "High-value export network",
    overview:
      "Review Korea-origin lanes for automotive, electronics, and high-value industrial shipments across key import regions.",
    primaryOrigin: "Seoul, Gyeonggi",
    demandMarkets: ["Germany", "India", "United States"],
  },
  {
    name: "Singapore",
    code: "SG",
    slug: "singapore",
    heroLabel: "Transshipment and logistics command center",
    overview:
      "Plan routes from Singapore for regional consolidation, re-export, and premium logistics orchestration.",
    primaryOrigin: "Singapore",
    demandMarkets: ["Germany", "India", "United States"],
  },
  {
    name: "Taiwan",
    code: "TW",
    slug: "taiwan",
    heroLabel: "Electronics and semiconductor shipping hub",
    overview:
      "Browse lanes from Taiwan into high-demand industrial and retail destinations with fast planning for air and ocean freight.",
    primaryOrigin: "Taipei, New Taipei",
    demandMarkets: ["Germany", "Singapore", "United States"],
  },
  {
    name: "Thailand",
    code: "TH",
    slug: "thailand",
    heroLabel: "Regional export and sourcing market",
    overview:
      "Compare Thailand origin lanes used for industrial, consumer, and regional sourcing freight strategies.",
    primaryOrigin: "Bangkok, Bangkok",
    demandMarkets: ["Germany", "United Kingdom", "United States"],
  },
  {
    name: "United Kingdom",
    code: "GB",
    slug: "united-kingdom",
    heroLabel: "Western Europe distribution origin",
    overview:
      "Explore United Kingdom shipping lanes for retail replenishment, pharma, and cross-border freight execution.",
    primaryOrigin: "London, England",
    demandMarkets: ["Germany", "India", "United States"],
  },
  {
    name: "United States",
    code: "US",
    slug: "united-states",
    heroLabel: "Domestic scale with global reach",
    overview:
      "Review state-level routing and global lane planning from the United States into Europe, Asia, and the Middle East.",
    primaryOrigin: "Los Angeles, California",
    demandMarkets: ["China", "Germany", "Singapore"],
  },
  {
    name: "Vietnam",
    code: "VN",
    slug: "vietnam",
    heroLabel: "Fast-growth sourcing origin",
    overview:
      "Analyze shipping routes from Vietnam for furniture, apparel, electronics, and diversified sourcing strategies.",
    primaryOrigin: "Ho Chi Minh City, Ho Chi Minh",
    demandMarkets: ["Germany", "United Kingdom", "United States"],
  },
];

export function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getShippingLaneCountry(slug: string) {
  return shippingLaneCountries.find((country) => country.slug === slug);
}

export function getShippingLaneHref(slug: string) {
  return `/shipping-lanes/${slug}`;
}

export function getModeledCountryByCode(code: string) {
  return freightLocations.find((country) => country.code === code);
}
