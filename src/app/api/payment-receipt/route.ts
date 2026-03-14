import { NextResponse } from "next/server";

function escapePdfText(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function formatPaymentMethod(paymentMethod: string) {
  switch (paymentMethod) {
    case "debit_card":
      return "Debit card";
    case "upi":
      return "UPI";
    default:
      return "Credit card";
  }
}

function buildPdf(lines: string[]) {
  const content = [
    "BT",
    "/F1 18 Tf",
    "50 760 Td",
    `(${escapePdfText(lines[0] ?? "Freightos Payment Receipt")}) Tj`,
    "/F1 12 Tf",
    ...lines.slice(1).flatMap((line, index) => [
      index === 0 ? "0 -28 Td" : "0 -18 Td",
      `(${escapePdfText(line)}) Tj`,
    ]),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf-8");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const serviceLevel = url.searchParams.get("serviceLevel") ?? "Normal delivery";
  const amount = url.searchParams.get("amount") ?? "0.00";
  const currency = url.searchParams.get("currency") ?? "USD";
  const billingName = url.searchParams.get("billingName") ?? "Not provided";
  const billingEmail = url.searchParams.get("billingEmail") ?? "Not provided";
  const paymentMethod = url.searchParams.get("paymentMethod") ?? "credit_card";
  const paymentInstrumentLabel = url.searchParams.get("paymentInstrumentLabel") ?? formatPaymentMethod(paymentMethod);
  const paymentRequestId = url.searchParams.get("paymentRequestId") ?? "N/A";
  const receiptNumber = url.searchParams.get("receiptNumber") ?? `RCT-${Date.now().toString(36).toUpperCase()}`;
  const paidAt = new Date().toISOString();

  const pdf = buildPdf([
    "Freightos Payment Receipt",
    `Receipt number: ${receiptNumber}`,
    `Payment date: ${paidAt}`,
    `Payment method: ${formatPaymentMethod(paymentMethod)}`,
    `Payment details: ${paymentInstrumentLabel}`,
    `Service level: ${serviceLevel}`,
    `Amount paid: ${currency} ${amount}`,
    `Billing name: ${billingName}`,
    `Billing email: ${billingEmail}`,
    `Payment request id: ${paymentRequestId}`,
  ]);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${receiptNumber}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
