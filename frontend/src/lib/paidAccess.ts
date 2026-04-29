export type PaidAccessConfig = {
  network: string;
  packageId?: string;
  configId?: string;
  answerPriceMist?: string;
  badgePriceMist?: string;
  enabled: boolean;
};

export function paidAccessConfigFromEnv(env: Record<string, string | undefined>): PaidAccessConfig {
  const packageId = normalize(env.VITE_PAID_ACCESS_PACKAGE_ID);
  const configId = normalize(env.VITE_PAID_ACCESS_CONFIG_ID);
  return {
    network: normalize(env.VITE_PAID_ACCESS_NETWORK) ?? "testnet",
    packageId,
    configId,
    answerPriceMist: normalize(env.VITE_PAID_ANSWER_PRICE_MIST),
    badgePriceMist: normalize(env.VITE_PAID_BADGE_PRICE_MIST),
    enabled: Boolean(packageId && configId),
  };
}

export function mistPriceLabel(value: string | undefined): string {
  if (!value) return "not configured";
  const mist = Number(value);
  if (!Number.isFinite(mist)) return `${value} MIST`;
  return `${mist / 1_000_000_000} SUI`;
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
