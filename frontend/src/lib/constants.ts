export const SUI_NETWORK = import.meta.env.VITE_SUI_NETWORK || "testnet";

export const SUI_RPC_URL =
  import.meta.env.VITE_SUI_RPC_URL || "https://fullnode.testnet.sui.io:443";

export const CONTRACTS = {
  PACKAGE_ID: import.meta.env.VITE_PACKAGE_ID || "",
  CHALLENGE_REGISTRY_ID: import.meta.env.VITE_CHALLENGE_REGISTRY_ID || "",
};

