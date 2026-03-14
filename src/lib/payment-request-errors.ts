export function getPaymentRequestSetupMessage(errorMessage: string) {
  if (errorMessage.includes("Could not find the table 'public.payment_requests'")) {
    return "The payment_requests table does not exist in your Supabase database yet. Run supabase/schema.sql in the Supabase SQL Editor, then refresh this page.";
  }

  return errorMessage;
}
