/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUI_NETWORK?: string;
  readonly VITE_SUI_RPC_URL?: string;
  readonly VITE_DONATION_ADDRESS?: string;
  readonly VITE_DONATION_SUI_ADDRESS?: string;
  readonly VITE_DONATION_WAL_ADDRESS?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_X?: string;
  readonly VITE_CONTACT_TELEGRAM?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_PAID_ACCESS_NETWORK?: string;
  readonly VITE_PAID_ACCESS_PACKAGE_ID?: string;
  readonly VITE_PAID_ACCESS_CONFIG_ID?: string;
  readonly VITE_PAID_ANSWER_PRICE_MIST?: string;
  readonly VITE_PAID_BADGE_PRICE_MIST?: string;
}
