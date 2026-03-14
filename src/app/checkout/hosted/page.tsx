import { Suspense } from "react";
import { HostedCheckoutClient } from "./hosted-checkout-client";

export default function HostedCheckoutPage() {
  return (
    <Suspense fallback={<main className="page-shell page-shell--inner" />}>
      <HostedCheckoutClient />
    </Suspense>
  );
}
