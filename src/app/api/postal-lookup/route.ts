import { NextResponse } from "next/server";

function normalizePostalCode(countryCode: string, postalCode: string) {
  if (countryCode === "IN") {
    return postalCode.replace(/\D/g, "").slice(0, 6);
  }

  return postalCode.trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryCode = String(searchParams.get("country") ?? "").toUpperCase();
  const postalCode = normalizePostalCode(countryCode, String(searchParams.get("postalCode") ?? ""));

  if (!countryCode || !postalCode) {
    return NextResponse.json({ error: "country and postalCode are required." }, { status: 400 });
  }

  try {
    if (countryCode === "IN") {
      const response = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`, {
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error("Unable to look up this Indian pincode right now.");
      }

      const data = (await response.json()) as Array<{
        Status: string;
        PostOffice: Array<{
          Name: string;
          District: string;
          State: string;
        }> | null;
      }>;

      const result = data[0];
      const postOffice = result?.PostOffice?.[0];

      if (!postOffice) {
        return NextResponse.json({ error: "No location found for this pincode." }, { status: 404 });
      }

      return NextResponse.json({
        city: postOffice.District,
        state: postOffice.State,
        addressLine: `${postOffice.Name}, ${postOffice.District}`,
      });
    }

    const response = await fetch(`https://api.zippopotam.us/${countryCode}/${encodeURIComponent(postalCode)}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "No location found for this postal code." }, { status: 404 });
    }

    const data = (await response.json()) as {
      places?: Array<{
        "place name": string;
        state: string;
      }>;
    };

    const place = data.places?.[0];

    if (!place) {
      return NextResponse.json({ error: "No location found for this postal code." }, { status: 404 });
    }

    return NextResponse.json({
      city: place["place name"],
      state: place.state,
      addressLine: `${place["place name"]}, ${place.state}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Postal lookup failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
