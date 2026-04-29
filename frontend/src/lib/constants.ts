export type SuiNetworkName = "testnet" | "mainnet" | "devnet";

export const SUI_NETWORK = (import.meta.env.VITE_SUI_NETWORK || "testnet") as SuiNetworkName;

export const SUI_RPC_URL =
  import.meta.env.VITE_SUI_RPC_URL || "https://fullnode.testnet.sui.io:443";

export const CONTRACTS = {
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || "",
  CHALLENGE_REGISTRY_ID: import.meta.env.VITE_CHALLENGE_REGISTRY_ID || "",
};

export const PAID_ACCESS = {
  NETWORK: import.meta.env.VITE_PAID_ACCESS_NETWORK || "testnet",
  PACKAGE_ID: import.meta.env.VITE_PAID_ACCESS_PACKAGE_ID || "",
  CONFIG_ID: import.meta.env.VITE_PAID_ACCESS_CONFIG_ID || "",
  ANSWER_PRICE_MIST: import.meta.env.VITE_PAID_ANSWER_PRICE_MIST || "",
  BADGE_PRICE_MIST: import.meta.env.VITE_PAID_BADGE_PRICE_MIST || "",
};
