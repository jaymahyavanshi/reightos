"use client";

import { useMemo, useState } from "react";
import { freightLocations } from "@/lib/quote-data";

type Mode = "Ocean freight" | "Air freight";
type Container = "1 x 40HC" | "1 x 20GP" | "LCL 8 CBM";
type AddressSide = "origin" | "destination";

type DeliveryOption = {
  service: "Normal delivery" | "Express delivery" | "Superfast delivery";
  amount: number;
  price: string;
  transit: string;
  coverage: string;
  note: string;
};

type PostalLookupResponse = {
  city: string;
  state: string;
  addressLine: string;
};

const deliveryProfiles = [
  {
    service: "Normal delivery" as const,
    multiplier: 1,
    dayDelta: 4,
    coverage: "Balanced price with standard fulfillment handling",
    note: "Designed for routine freight moves where cost control matters most.",
  },
  {
    service: "Express delivery" as const,
    multiplier: 1.22,
    dayDelta: 1,
    coverage: "Priority processing and faster cargo handoff",
    note: "Best for urgent replenishment and tighter delivery commitments.",
  },
  {
    service: "Superfast delivery" as const,
    multiplier: 1.48,
    dayDelta: -2,
    coverage: "Shortest ETA with highest routing priority",
    note: "Optimized for critical cargo and premium time-sensitive moves.",
  },
];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPincodeFactor(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return digits.split("").reduce((sum, digit) => sum + Number(digit), 0);
}

function normalizeCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16);
}

function formatCardNumber(value: string) {
  return normalizeCardNumber(value)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function normalizeCardExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length < 3) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function getMaskedPaymentInstrumentLabel(
  paymentMethod: "credit_card" | "debit_card" | "upi",
  details: {
    cardNumber: string;
    upiId: string;
  },
) {
  if (paymentMethod === "upi") {
    const [handle, domain] = details.upiId.split("@");
    if (!handle || !domain) {
      return "UPI";
    }

    const visible = handle.slice(0, 2);
    return `UPI ${visible}${"*".repeat(Math.max(handle.length - 2, 1))}@${domain}`;
  }

  const digits = normalizeCardNumber(details.cardNumber);
  const last4 = digits.slice(-4) || "0000";
  return `${paymentMethod === "debit_card" ? "Debit card" : "Credit card"} ending ${last4}`;
}

export function QuoteCalculator() {
  const [originCountry, setOriginCountry] = useState("IN");
  const [originState, setOriginState] = useState("MH");
  const [originCity, setOriginCity] = useState("");
  const [originPincode, setOriginPincode] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [originRoom, setOriginRoom] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("US");
  const [destinationState, setDestinationState] = useState("CA");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationPincode, setDestinationPincode] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [destinationRoom, setDestinationRoom] = useState("");
  const [mode, setMode] = useState<Mode>("Ocean freight");
  const [container, setContainer] = useState<Container>("1 x 40HC");
  const [weightKg, setWeightKg] = useState(6800);
  const [lengthCm, setLengthCm] = useState(590);
  const [widthCm, setWidthCm] = useState(230);
  const [heightCm, setHeightCm] = useState(240);
  const [selectedService, setSelectedService] = useState<DeliveryOption["service"]>("Normal delivery");
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "debit_card" | "upi">("credit_card");
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentPending, setPaymentPending] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [lookupState, setLookupState] = useState<{
    originLoading: boolean;
    destinationLoading: boolean;
    originError: string | null;
    destinationError: string | null;
  }>({
    originLoading: false,
    destinationLoading: false,
    originError: null,
    destinationError: null,
  });

  const origin = useMemo(
    () => freightLocations.find((country) => country.code === originCountry),
    [originCountry],
  );
  const destination = useMemo(
    () => freightLocations.find((country) => country.code === destinationCountry),
    [destinationCountry],
  );

  const safeOriginState =
    origin?.states.find((state) => state.code === originState)?.code ?? origin?.states[0]?.code ?? "";
  const safeDestinationState =
    destination?.states.find((state) => state.code === destinationState)?.code ??
    destination?.states[0]?.code ??
    "";

  async function autofillPostalDetails(side: AddressSide) {
    const countryCode = side === "origin" ? originCountry : destinationCountry;
    const postalCode = side === "origin" ? originPincode : destinationPincode;
    const stateList = side === "origin" ? origin?.states ?? [] : destination?.states ?? [];
    const normalized = countryCode === "IN" ? postalCode.replace(/\D/g, "").slice(0, 6) : postalCode.trim();

    if (normalized.length < 4) {
      return;
    }

    setLookupState((current) => ({
      ...current,
      [`${side}Loading`]: true,
      [`${side}Error`]: null,
    }));

    try {
      const response = await fetch(
        `/api/postal-lookup?country=${encodeURIComponent(countryCode)}&postalCode=${encodeURIComponent(normalized)}`,
      );
      const result = (await response.json()) as PostalLookupResponse & { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Postal lookup failed.");
      }

      const matchingState = stateList.find(
        (state) => state.name.toLowerCase() === result.state.toLowerCase(),
      );

      if (side === "origin") {
        setOriginCity(result.city);
        setOriginAddress((current) => current || result.addressLine);
        if (matchingState) {
          setOriginState(matchingState.code);
        }
      } else {
        setDestinationCity(result.city);
        setDestinationAddress((current) => current || result.addressLine);
        if (matchingState) {
          setDestinationState(matchingState.code);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to auto-fill this postal code.";
      setLookupState((current) => ({
        ...current,
        [`${side}Error`]: message,
      }));
    } finally {
      setLookupState((current) => ({
        ...current,
        [`${side}Loading`]: false,
      }));
    }
  }

  const calculation = useMemo(() => {
    const originPoint = origin?.states.find((state) => state.code === safeOriginState);
    const destinationPoint = destination?.states.find((state) => state.code === safeDestinationState);

    if (!originPoint || !destinationPoint) {
      return null;
    }

    const distanceKm = haversineDistance(
      originPoint.lat,
      originPoint.lng,
      destinationPoint.lat,
      destinationPoint.lng,
    );

    const volumeCbm = (lengthCm / 100) * (widthCm / 100) * (heightCm / 100);
    const distanceFactor = mode === "Ocean freight" ? 0.19 : 0.54;
    const weightFactor = mode === "Ocean freight" ? 0.08 : 0.22;
    const sizeFactor = mode === "Ocean freight" ? 52 : 88;
    const containerMultiplier =
      container === "1 x 40HC" ? 1.26 : container === "1 x 20GP" ? 1.04 : 0.86;
    const laneMultiplier = originCountry === destinationCountry ? 0.68 : 1;
    const originAccessorial =
      getPincodeFactor(originPincode) * 3.5 +
      Math.max(originAddress.trim().length, 8) * 1.8 +
      (originRoom.trim() ? 28 : 0);
    const destinationAccessorial =
      getPincodeFactor(destinationPincode) * 3.5 +
      Math.max(destinationAddress.trim().length, 8) * 1.8 +
      (destinationRoom.trim() ? 32 : 0);

    const baseRate =
      380 +
      distanceKm * distanceFactor +
      weightKg * weightFactor +
      volumeCbm * sizeFactor +
      originAccessorial +
      destinationAccessorial;

    const estimatedBase = baseRate * containerMultiplier * laneMultiplier;
    const transitBaseDays = Math.max(
      mode === "Ocean freight" ? 12 : 3,
      Math.round(distanceKm / (mode === "Ocean freight" ? 520 : 1800)),
    );

    const results: DeliveryOption[] = deliveryProfiles.map((profile) => {
      const transitDays = Math.max(mode === "Ocean freight" ? 8 : 1, transitBaseDays + profile.dayDelta);

      return {
        service: profile.service,
        amount: estimatedBase * profile.multiplier,
        price: formatCurrency(estimatedBase * profile.multiplier),
        transit: `${transitDays} days`,
        coverage: profile.coverage,
        note: profile.note,
      };
    });

    return {
      distanceKm: Math.round(distanceKm),
      volumeCbm: Number(volumeCbm.toFixed(2)),
      accessorials: Math.round(originAccessorial + destinationAccessorial),
      results,
    };
  }, [
    container,
    destination,
    destinationAddress,
    destinationCountry,
    destinationPincode,
    destinationRoom,
    heightCm,
    lengthCm,
    mode,
    origin,
    originAddress,
    originCountry,
    originPincode,
    originRoom,
    safeDestinationState,
    safeOriginState,
    weightKg,
    widthCm,
  ]);

  const selectedQuote = calculation?.results.find((quote) => quote.service === selectedService) ?? null;

  async function handlePaymentStart() {
    if (!selectedQuote) {
      setPaymentError("Select a delivery option before continuing to payment.");
      return;
    }

    if (!billingName.trim() || !billingEmail.trim()) {
      setPaymentError("Enter billing name and billing email to continue.");
      return;
    }

    if (paymentMethod === "upi") {
      const normalizedUpiId = upiId.trim().toLowerCase();

      if (!/^[a-z0-9.\-_]{2,}@[a-z]{2,}$/i.test(normalizedUpiId)) {
        setPaymentError("Enter a valid UPI ID to continue.");
        return;
      }
    } else {
      const normalizedCardNumber = normalizeCardNumber(cardNumber);
      const normalizedExpiry = cardExpiry.replace(/\D/g, "");
      const normalizedCvv = cardCvv.replace(/\D/g, "");

      if (!cardHolderName.trim()) {
        setPaymentError("Enter the card holder name to continue.");
        return;
      }

      if (normalizedCardNumber.length < 13 || normalizedCardNumber.length > 16) {
        setPaymentError("Enter a valid card number to continue.");
        return;
      }

      if (normalizedExpiry.length !== 4) {
        setPaymentError("Enter a valid card expiry in MM/YY format.");
        return;
      }

      if (normalizedCvv.length < 3 || normalizedCvv.length > 4) {
        setPaymentError("Enter a valid CVV to continue.");
        return;
      }
    }

    setPaymentPending(true);
    setPaymentError(null);

    try {
      const paymentInstrumentLabel = getMaskedPaymentInstrumentLabel(paymentMethod, {
        cardNumber,
        upiId,
      });

      const response = await fetch("/api/payment-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billingName,
          billingEmail,
          paymentMethod,
          paymentInstrumentLabel,
          serviceLevel: selectedQuote.service,
          amount: Number(selectedQuote.amount.toFixed(2)),
          currency: "USD",
          quoteSnapshot: {
            originCountry: origin?.name ?? "",
            originState: origin?.states.find((state) => state.code === safeOriginState)?.name ?? "",
            destinationCountry: destination?.name ?? "",
            destinationState:
              destination?.states.find((state) => state.code === safeDestinationState)?.name ?? "",
            mode,
            container,
            weightKg,
            volumeCbm: calculation?.volumeCbm ?? 0,
            distanceKm: calculation?.distanceKm ?? 0,
          },
        }),
      });

      const result = (await response.json()) as { error?: string; paymentUrl?: string };

      if (!response.ok || !result.paymentUrl) {
        setPaymentError(result.error ?? "Unable to initialize payment.");
        return;
      }

      window.location.assign(result.paymentUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to initialize payment.");
    } finally {
      setPaymentPending(false);
    }
  }

  return (
    <div className="quote-booking">
      <aside className="quote-sidebar">
        <form className="quote-console">
          <div className="quote-console__header">
            <span className="priority priority--must-have">Shipment planner</span>
            <h2>Build your route</h2>
            <p>Auto-fill city and state from pincode where postal lookup data is available, then refine the address manually.</p>
          </div>

          <section className="quote-section quote-section--origin">
            <div className="quote-section__title">
              <span>01</span>
              <div>
                <h3>Origin</h3>
                <p>Pickup side configuration</p>
              </div>
            </div>
            <div className="quote-form__row">
              <label>
                Country
                <select
                  onChange={(event) => {
                    const nextCountry = freightLocations.find((country) => country.code === event.target.value);
                    setOriginCountry(event.target.value);
                    setOriginState(nextCountry?.states[0]?.code ?? "");
                    setOriginCity("");
                    setOriginAddress("");
                  }}
                  value={originCountry}
                >
                  {freightLocations.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                State
                <select onChange={(event) => setOriginState(event.target.value)} value={safeOriginState}>
                  {origin?.states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="quote-form__row quote-form__row--quad">
              <label>
                Pincode / ZIP
                <input
                  onBlur={() => void autofillPostalDetails("origin")}
                  onChange={(event) => setOriginPincode(event.target.value)}
                  type="text"
                  value={originPincode}
                />
              </label>
              <label>
                City
                <input onChange={(event) => setOriginCity(event.target.value)} type="text" value={originCity} />
              </label>
              <label>
                Address
                <input onChange={(event) => setOriginAddress(event.target.value)} type="text" value={originAddress} />
              </label>
              <label>
                Flat/Area
                <input onChange={(event) => setOriginRoom(event.target.value)} type="text" value={originRoom} />
              </label>
            </div>
            <div className="quote-hint">
              {lookupState.originLoading ? "Looking up origin postal code..." : lookupState.originError ?? "Enter pincode and tab out to auto-fill city/state."}
            </div>
          </section>

          <section className="quote-section quote-section--destination">
            <div className="quote-section__title">
              <span>02</span>
              <div>
                <h3>Destination</h3>
                <p>Delivery side configuration</p>
              </div>
            </div>
            <div className="quote-form__row">
              <label>
                Country
                <select
                  onChange={(event) => {
                    const nextCountry = freightLocations.find((country) => country.code === event.target.value);
                    setDestinationCountry(event.target.value);
                    setDestinationState(nextCountry?.states[0]?.code ?? "");
                    setDestinationCity("");
                    setDestinationAddress("");
                  }}
                  value={destinationCountry}
                >
                  {freightLocations.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                State
                <select onChange={(event) => setDestinationState(event.target.value)} value={safeDestinationState}>
                  {destination?.states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="quote-form__row quote-form__row--quad">
              <label>
                Pincode / ZIP
                <input
                  onBlur={() => void autofillPostalDetails("destination")}
                  onChange={(event) => setDestinationPincode(event.target.value)}
                  type="text"
                  value={destinationPincode}
                />
              </label>
              <label>
                City
                <input onChange={(event) => setDestinationCity(event.target.value)} type="text" value={destinationCity} />
              </label>
              <label>
                Address
                <input onChange={(event) => setDestinationAddress(event.target.value)} type="text" value={destinationAddress} />
              </label>
              <label>
                Flat/Area
                <input onChange={(event) => setDestinationRoom(event.target.value)} type="text" value={destinationRoom} />
              </label>
            </div>
            <div className="quote-hint">
              {lookupState.destinationLoading
                ? "Looking up destination postal code..."
                : lookupState.destinationError ?? "Postal lookup will set city/state automatically when supported."}
            </div>
          </section>

          <section className="quote-section quote-section--cargo">
            <div className="quote-section__title">
              <span>03</span>
              <div>
                <h3>Cargo profile</h3>
                <p>Shipment mode and dimensional data</p>
              </div>
            </div>
            <div className="quote-form__row">
              <label>
                Mode
                <select onChange={(event) => setMode(event.target.value as Mode)} value={mode}>
                  <option>Ocean freight</option>
                  <option>Air freight</option>
                </select>
              </label>
              <label>
                Shipment type
                <select onChange={(event) => setContainer(event.target.value as Container)} value={container}>
                  <option>1 x 40HC</option>
                  <option>1 x 20GP</option>
                  <option>LCL 8 CBM</option>
                </select>
              </label>
            </div>
            <div className="quote-form__row quote-form__row--quad">
              <label>
                Weight (kg)
                <input min="100" onChange={(event) => setWeightKg(Number(event.target.value))} type="number" value={weightKg} />
              </label>
              <label>
                Length (cm)
                <input min="50" onChange={(event) => setLengthCm(Number(event.target.value))} type="number" value={lengthCm} />
              </label>
              <label>
                Width (cm)
                <input min="50" onChange={(event) => setWidthCm(Number(event.target.value))} type="number" value={widthCm} />
              </label>
              <label>
                Height (cm)
                <input min="50" onChange={(event) => setHeightCm(Number(event.target.value))} type="number" value={heightCm} />
              </label>
            </div>
          </section>
        </form>
      </aside>

      <section className="quote-main">
        <article className="quote-overview">
          <div>
            <p className="eyebrow">Live route estimate</p>
            <h3>
              {origin?.name} / {origin?.states.find((state) => state.code === safeOriginState)?.name} to{" "}
              {destination?.name} / {destination?.states.find((state) => state.code === safeDestinationState)?.name}
            </h3>
          </div>
          <div className="quote-overview__stats">
            <div className="quote-mini-stat">
              <span>Distance</span>
              <strong>{calculation?.distanceKm ?? 0} km</strong>
            </div>
            <div className="quote-mini-stat">
              <span>Volume</span>
              <strong>{calculation?.volumeCbm ?? 0} CBM</strong>
            </div>
            <div className="quote-mini-stat">
              <span>Accessorials</span>
              <strong>{formatCurrency(calculation?.accessorials ?? 0)}</strong>
            </div>
          </div>
        </article>

        <div className="service-tier-grid">
          {calculation?.results.map((quote) => (
            <article
              className={`service-tier ${selectedService === quote.service ? "service-tier--active" : ""}`}
              key={quote.service}
            >
              <div className="service-tier__top">
                <span className="priority priority--must-have">{quote.service}</span>
                <p className="quote-price">{quote.price}</p>
              </div>
              <h3>{quote.coverage}</h3>
              <p>{quote.note}</p>
              <div className="service-tier__meta">
                <span>Transit: {quote.transit}</span>
                <span>{mode}</span>
              </div>
              <button
                className={`button ${selectedService === quote.service ? "button--primary" : "button--secondary"}`}
                onClick={() => setSelectedService(quote.service)}
                type="button"
              >
                {selectedService === quote.service ? "Selected" : "Choose service"}
              </button>
            </article>
          ))}
        </div>

        <article className="checkout-shell">
          <div className="checkout-shell__copy">
            <p className="eyebrow">Checkout</p>
            <h3>Complete payment for the selected freight service.</h3>
            <p>
              Continue with hosted checkout through Stripe or Razorpay. The quote snapshot can be
              recorded in Supabase before redirect.
            </p>
          </div>

          <div className="payment-card__summary">
            <div className="quote-summary">
              <span>Selected service</span>
              <strong>{selectedQuote?.service ?? "Normal delivery"}</strong>
              <p>{selectedQuote?.transit ?? "Add shipment details"}</p>
            </div>
            <div className="quote-summary">
              <span>Estimated amount</span>
              <strong>{selectedQuote?.price ?? "$0"}</strong>
              <p>{container}</p>
            </div>
          </div>

          <div className="quote-form payment-form">
            <div className="quote-form__row">
              <label>
                Billing full name
                <input
                  onChange={(event) => setBillingName(event.target.value)}
                  placeholder="Ayush Patel"
                  type="text"
                  value={billingName}
                />
              </label>
              <label>
                Billing email
                <input
                  onChange={(event) => setBillingEmail(event.target.value)}
                  placeholder="you@company.com"
                  type="email"
                  value={billingEmail}
                />
              </label>
            </div>

            <label>
              Payment method
              <select
                onChange={(event) => {
                  const nextMethod = event.target.value as "credit_card" | "debit_card" | "upi";
                  setPaymentMethod(nextMethod);
                  setPaymentError(null);
                }}
                value={paymentMethod}
              >
                <option value="credit_card">Credit card</option>
                <option value="debit_card">Debit card</option>
                <option value="upi">UPI</option>
              </select>
            </label>

            {paymentMethod === "upi" ? (
              <label>
                UPI ID
                <input
                  onChange={(event) => setUpiId(event.target.value)}
                  placeholder="name@upi"
                  type="text"
                  value={upiId}
                />
              </label>
            ) : (
              <>
                <div className="quote-form__row">
                  <label>
                    Card holder name
                    <input
                      onChange={(event) => setCardHolderName(event.target.value)}
                      placeholder="Ayush Patel"
                      type="text"
                      value={cardHolderName}
                    />
                  </label>
                  <label>
                    Card number
                    <input
                      inputMode="numeric"
                      onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                      placeholder="4242 4242 4242 4242"
                      type="text"
                      value={cardNumber}
                    />
                  </label>
                </div>

                <div className="quote-form__row">
                  <label>
                    Card expiry
                    <input
                      inputMode="numeric"
                      onChange={(event) => setCardExpiry(normalizeCardExpiry(event.target.value))}
                      placeholder="MM/YY"
                      type="text"
                      value={cardExpiry}
                    />
                  </label>
                  <label>
                    CVV
                    <input
                      inputMode="numeric"
                      onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      type="password"
                      value={cardCvv}
                    />
                  </label>
                </div>
              </>
            )}

            {paymentError ? <p className="form-feedback form-feedback--error">{paymentError}</p> : null}

            <button className="button button--primary" disabled={paymentPending} onClick={handlePaymentStart} type="button">
              {paymentPending ? "Redirecting..." : "Proceed to payment"}
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}
