import { Suspense } from "react";
import { CheckoutSuccessClient } from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<main className="page-shell page-shell--inner" />}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
