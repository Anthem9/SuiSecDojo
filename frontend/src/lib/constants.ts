export type SuiNetworkName = "testnet" | "mainnet" | "devnet";

export const SUI_NETWORK = (import.meta.env.VITE_SUI_NETWORK || "testnet") as SuiNetworkName;

export const SUI_RPC_URL =
  import.meta.env.VITE_SUI_RPC_URL || "https://fullnode.testnet.sui.io:443";

export const CONTRACTS = {
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || "",
  CHALLENGE_REGISTRY_ID: import.meta.env.VITE_CHALLENGE_REGISTRY_ID || "",
};

export const DOJO_PASS = {
  NETWORK: import.meta.env.VITE_DOJO_PASS_NETWORK || "testnet",
  PACKAGE_ID: import.meta.env.VITE_DOJO_PASS_PACKAGE_ID || CONTRACTS.PACKAGE_ID,
  CONFIG_ID: import.meta.env.VITE_DOJO_PASS_CONFIG_ID || "",
  ANSWER_PRICE_MIST: import.meta.env.VITE_ANSWER_UNLOCK_PRICE_MIST || "",
  BADGE_PRICE_MIST: import.meta.env.VITE_BADGE_MINT_PRICE_MIST || "",
  SEAL_KEY_SERVERS: import.meta.env.VITE_SEAL_KEY_SERVERS || "",
  ENCRYPTED_ANSWER_BASE_URL: import.meta.env.VITE_ENCRYPTED_ANSWER_BASE_URL || "",
  BADGE_PROOF_API_URL: import.meta.env.VITE_BADGE_PROOF_API_URL || "",
};
