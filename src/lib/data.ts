import { demoMetrics, demoQuotes, demoShipments } from "@/lib/demo-data";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type QuoteCard = {
  carrierName: string;
  mode: string;
  transitTime: string;
  price: string;
  reliability: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  trend: string;
};

export type ShipmentPreview = {
  id: string;
  bookingReference: string;
  status: string;
  vessel: string;
  etaLabel: string;
  locationLabel: string;
};

export async function getMarketplaceQuotes(): Promise<QuoteCard[]> {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("quotes")
      .select("carrier_name, mode, container_type, transit_time_days, total_price, currency, reliability_score")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data?.length) {
      return data.map((quote) => ({
        carrierName: quote.carrier_name,
        mode: `${quote.mode} ${quote.container_type}`,
        transitTime: `${quote.transit_time_days} days`,
        price: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: quote.currency ?? "USD",
          maximumFractionDigits: 0,
        }).format(Number(quote.total_price)),
        reliability: `${Math.round(Number(quote.reliability_score ?? 0))}%`,
      }));
    }
  }

  return demoQuotes.map((quote) => ({
    carrierName: quote.carrier_name,
    mode: `${quote.mode} ${quote.container_type}`,
    transitTime: `${quote.transit_time_days} days`,
    price: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: quote.currency,
      maximumFractionDigits: 0,
    }).format(quote.total_price),
    reliability: `${quote.reliability_score}%`,
  }));
}

export async function getDashboardMetrics(): Promise<DashboardMetric[]> {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const [{ count: bookingCount }, { count: shipmentCount }] = await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("shipments").select("*", { count: "exact", head: true }),
    ]);

    if (typeof bookingCount === "number" && typeof shipmentCount === "number") {
      return [
        { label: "Monthly bookings", value: String(bookingCount), trend: "Live from Supabase" },
        { label: "Open shipments", value: String(shipmentCount), trend: "Live from Supabase" },
        { label: "Average savings", value: "$418", trend: "Demo benchmark retained" },
      ];
    }
  }

  return demoMetrics;
}

export async function getShipmentPreviews(): Promise<ShipmentPreview[]> {
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("shipments")
      .select("id, current_status, vessel_name, eta, bookings(booking_reference)")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data?.length) {
      const shipmentIds = (data as Array<{ id: string }>).map((shipment) => shipment.id);
      const { data: events } = await supabase
        .from("tracking_events")
        .select("shipment_id, location, event_time")
        .in("shipment_id", shipmentIds)
        .order("event_time", { ascending: false });

      const latestLocations = new Map<string, string>();

      (events ?? []).forEach((event) => {
        if (!latestLocations.has(event.shipment_id)) {
          latestLocations.set(event.shipment_id, event.location ?? "Location pending");
        }
      });

      return (data as Array<{
        id: string;
        current_status: string;
        vessel_name: string | null;
        eta: string | null;
        bookings:
          | { booking_reference?: string | null }
          | Array<{ booking_reference?: string | null }>
          | null;
      }>).map((shipment) => ({
        id: shipment.id,
        bookingReference:
          (Array.isArray(shipment.bookings) ? shipment.bookings[0]?.booking_reference : shipment.bookings?.booking_reference) ??
          "Pending",
        status: shipment.current_status,
        vessel: shipment.vessel_name ?? "Unassigned vessel",
        etaLabel: shipment.eta ? `ETA ${new Date(shipment.eta).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "ETA pending",
        locationLabel: latestLocations.get(shipment.id) ?? "Location pending",
      }));
    }
  }

  return demoShipments.map((shipment) => ({
    id: shipment.booking_reference,
    bookingReference: shipment.booking_reference,
    status: shipment.current_status,
    vessel: shipment.vessel_name,
    etaLabel: shipment.eta_label,
    locationLabel: shipment.location_label,
  }));
}
