/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUI_NETWORK?: string;
  readonly VITE_SUI_RPC_URL?: string;
  readonly VITE_SUI_TESTNET_RPC_URL?: string;
  readonly VITE_SUI_MAINNET_RPC_URL?: string;
  readonly VITE_SUI_DEVNET_RPC_URL?: string;
  readonly VITE_DONATION_ADDRESS?: string;
  readonly VITE_DONATION_SUI_ADDRESS?: string;
  readonly VITE_DONATION_WAL_ADDRESS?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_CONTACT_X?: string;
  readonly VITE_CONTACT_TELEGRAM?: string;
  readonly VITE_PUBLIC_SITE_URL?: string;
  readonly VITE_SUINS_NAME?: string;
  readonly VITE_DOJO_PASS_NETWORK?: string;
  readonly VITE_DOJO_PASS_PACKAGE_ID?: string;
  readonly VITE_DOJO_PASS_CONFIG_ID?: string;
  readonly VITE_ANSWER_UNLOCK_PRICE_MIST?: string;
  readonly VITE_BADGE_MINT_PRICE_MIST?: string;
  readonly VITE_SEAL_KEY_SERVERS?: string;
  readonly VITE_ENCRYPTED_ANSWER_BASE_URL?: string;
  readonly VITE_BADGE_PROOF_API_URL?: string;
}
