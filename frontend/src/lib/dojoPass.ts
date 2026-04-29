export type DojoPassConfig = {
  network: string;
  packageId?: string;
  configId?: string;
  answerPriceMist?: string;
  badgePriceMist?: string;
  sealKeyServers?: string;
  encryptedAnswerBaseUrl?: string;
  badgeProofApiUrl?: string;
  enabled: boolean;
};

export function dojoPassConfigFromEnv(env: Record<string, string | undefined>): DojoPassConfig {
  const packageId = normalize(env.VITE_DOJO_PASS_PACKAGE_ID);
  const configId = normalize(env.VITE_DOJO_PASS_CONFIG_ID);
  return {
    network: normalize(env.VITE_DOJO_PASS_NETWORK) ?? "testnet",
    packageId,
    configId,
    answerPriceMist: normalize(env.VITE_ANSWER_UNLOCK_PRICE_MIST),
    badgePriceMist: normalize(env.VITE_BADGE_MINT_PRICE_MIST),
    sealKeyServers: normalize(env.VITE_SEAL_KEY_SERVERS),
    encryptedAnswerBaseUrl: normalize(env.VITE_ENCRYPTED_ANSWER_BASE_URL),
    badgeProofApiUrl: normalize(env.VITE_BADGE_PROOF_API_URL),
    enabled: Boolean(packageId && configId),
  };
}

export function mistPriceLabel(value: string | undefined): string {
  if (!value) return "not configured";
  const mist = Number(value);
  if (!Number.isFinite(mist)) return `${value} MIST`;
  return `${mist / 1_000_000_000} SUI`;
}

export function hasUnlockedAnswer(unlockedChallengeIds: string[] | undefined, challengeId: string): boolean {
  return unlockedChallengeIds?.includes(challengeId) === true;
}

export function requiredNetworkMessage(currentNetwork: string, requiredNetwork: string, locale: "en" | "zh"): string | undefined {
  if (currentNetwork === requiredNetwork) return undefined;
  if (locale === "zh") {
    return `请在钱包插件中切换到 ${requiredNetwork} 后再继续。当前网络：${currentNetwork}。`;
  }
  return `Switch your wallet to ${requiredNetwork} before continuing. Current network: ${currentNetwork}.`;
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
