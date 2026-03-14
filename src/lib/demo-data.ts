export const demoCompanies = [
  { name: "Oceanic Imports", role: "shipper", country_code: "IN" },
  { name: "Atlas Forwarding", role: "forwarder", country_code: "US" },
  { name: "BlueWave Carrier", role: "carrier", country_code: "SG" },
];

export const demoQuotes = [
  {
    origin_port: "Nhava Sheva, INNSA",
    destination_port: "Los Angeles, USLAX",
    mode: "FCL",
    container_type: "40HC",
    cargo_description: "Consumer electronics",
    carrier_name: "Maersk Digital",
    transit_time_days: 24,
    total_price: 2940,
    currency: "USD",
    reliability_score: 94,
  },
  {
    origin_port: "Shanghai, CNSHA",
    destination_port: "New York, USNYC",
    mode: "FCL",
    container_type: "40HC",
    cargo_description: "Home goods",
    carrier_name: "MSC Marketplace",
    transit_time_days: 26,
    total_price: 3180,
    currency: "USD",
    reliability_score: 91,
  },
  {
    origin_port: "Rotterdam, NLRTM",
    destination_port: "Savannah, USSAV",
    mode: "LCL",
    container_type: "8 CBM",
    cargo_description: "Industrial parts",
    carrier_name: "Hapag FastLane",
    transit_time_days: 29,
    total_price: 1420,
    currency: "USD",
    reliability_score: 96,
  },
];

export const demoBookings = [
  {
    booking_reference: "FRT-2026-1042",
    status: "confirmed",
    incoterm: "FOB",
  },
  {
    booking_reference: "FRT-2026-1043",
    status: "in_transit",
    incoterm: "CIF",
  },
];

export const demoShipments = [
  {
    booking_reference: "FRT-2026-1042",
    current_status: "Gate in at origin terminal",
    vessel_name: "MV Pacific Horizon",
    eta_label: "ETA Apr 4",
    location_label: "Nhava Sheva Port",
  },
  {
    booking_reference: "FRT-2026-1043",
    current_status: "Transshipment complete",
    vessel_name: "MV Blue Crest",
    eta_label: "ETA Mar 29",
    location_label: "Colombo Port",
  },
];

export const demoMetrics = [
  { label: "Monthly bookings", value: "184", trend: "+12% vs last month" },
  { label: "Open shipments", value: "42", trend: "7 delayed, 35 on track" },
  { label: "Average savings", value: "$418", trend: "per booking benchmark delta" },
];
