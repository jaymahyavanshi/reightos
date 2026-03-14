export type PaymentProvider = "stripe" | "razorpay";
export type DeliveryServiceLevel = "Normal delivery" | "Express delivery" | "Superfast delivery";

const providerPrefixMap: Record<PaymentProvider, "STRIPE" | "RAZORPAY"> = {
  stripe: "STRIPE",
  razorpay: "RAZORPAY",
};

const serviceSuffixMap: Record<DeliveryServiceLevel, "NORMAL" | "EXPRESS" | "SUPERFAST"> = {
  "Normal delivery": "NORMAL",
  "Express delivery": "EXPRESS",
  "Superfast delivery": "SUPERFAST",
};

function getEnvValue(key: string) {
  const value = process.env[key]?.trim();

  return value ? value : null;
}

export function getPaymentLinkEnvKeys(provider: PaymentProvider, service: DeliveryServiceLevel) {
  const providerPrefix = providerPrefixMap[provider];
  const serviceSuffix = serviceSuffixMap[service];

  return [`${providerPrefix}_PAYMENT_LINK_${serviceSuffix}`, `${providerPrefix}_PAYMENT_LINK_DEFAULT`];
}

export function getPaymentLink(provider: PaymentProvider, service: DeliveryServiceLevel) {
  const envKeys = getPaymentLinkEnvKeys(provider, service);

  for (const key of envKeys) {
    const value = getEnvValue(key);

    if (value) {
      return {
        envKeys,
        paymentUrl: value,
        resolvedEnvKey: key,
      };
    }
  }

  return {
    envKeys,
    paymentUrl: null,
    resolvedEnvKey: null,
  };
}
