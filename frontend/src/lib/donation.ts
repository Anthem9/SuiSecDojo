export type DonationConfig = {
  label: string;
  address?: string;
  enabled: boolean;
};

export type ContactConfig = {
  label: string;
  value?: string;
  href?: string;
  enabled: boolean;
};

export function donationConfigFromEnv(env: Record<string, string | undefined>): DonationConfig {
  return makeDonationConfig("SUI / WAL", env.VITE_DONATION_ADDRESS ?? env.VITE_DONATION_SUI_ADDRESS ?? env.VITE_DONATION_WAL_ADDRESS);
}

export function contactConfigFromEnv(env: Record<string, string | undefined>): ContactConfig[] {
  return [
    makeContactConfig("Email", env.VITE_CONTACT_EMAIL, (value) => `mailto:${value}`),
    makeContactConfig("X / Twitter", env.VITE_CONTACT_X, (value) => value),
    makeContactConfig("Telegram", env.VITE_CONTACT_TELEGRAM, (value) => value),
  ];
}

function makeDonationConfig(label: string, address: string | undefined): DonationConfig {
  const normalized = address?.trim();
  return {
    label,
    address: normalized || undefined,
    enabled: Boolean(normalized),
  };
}

function makeContactConfig(label: string, value: string | undefined, hrefFor: (value: string) => string): ContactConfig {
  const normalized = value?.trim();
  return {
    label,
    value: normalized || undefined,
    href: normalized ? hrefFor(normalized) : undefined,
    enabled: Boolean(normalized),
  };
}
