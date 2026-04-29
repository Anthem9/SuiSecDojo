export type DonationAsset = "SUI" | "WAL";

export type DonationConfig = {
  asset: DonationAsset;
  address?: string;
  enabled: boolean;
};

export function donationConfigFromEnv(env: Record<string, string | undefined>): DonationConfig[] {
  return [
    makeDonationConfig("SUI", env.VITE_DONATION_SUI_ADDRESS),
    makeDonationConfig("WAL", env.VITE_DONATION_WAL_ADDRESS),
  ];
}

function makeDonationConfig(asset: DonationAsset, address: string | undefined): DonationConfig {
  const normalized = address?.trim();
  return {
    asset,
    address: normalized || undefined,
    enabled: Boolean(normalized),
  };
}
