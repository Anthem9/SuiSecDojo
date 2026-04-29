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

export type NetworkRequirementPurpose = "challenge" | "dojo-pass" | "generic";

export function walletNetworkFromChains(chains: readonly string[] | undefined, fallbackNetwork: string): string {
  const known = chains
    ?.map((chain) => chain.split(":")[1])
    .find((network) => network === "testnet" || network === "mainnet" || network === "devnet");
  return known ?? fallbackNetwork;
}

export function requiredNetworkMessage(
  currentNetwork: string,
  requiredNetwork: string,
  locale: "en" | "zh",
  purpose: NetworkRequirementPurpose = "generic",
): string | undefined {
  if (currentNetwork === requiredNetwork) return undefined;
  if (locale === "zh") {
    if (purpose === "challenge") {
      return `训练挑战只在 ${requiredNetwork} 运行。请在钱包插件中切换到 ${requiredNetwork} 后再继续。当前钱包网络：${currentNetwork}。`;
    }
    if (purpose === "dojo-pass") {
      return `答案解锁和徽章铸造使用 ${requiredNetwork}。请在钱包插件中切换到 ${requiredNetwork} 后再继续。当前钱包网络：${currentNetwork}。`;
    }
    return `请在钱包插件中切换到 ${requiredNetwork} 后再继续。当前网络：${currentNetwork}。`;
  }
  if (purpose === "challenge") {
    return `Training challenges run on ${requiredNetwork}. Switch your wallet to ${requiredNetwork} before continuing. Current wallet network: ${currentNetwork}.`;
  }
  if (purpose === "dojo-pass") {
    return `Answer unlocks and badge minting use ${requiredNetwork}. Switch your wallet to ${requiredNetwork} before continuing. Current wallet network: ${currentNetwork}.`;
  }
  return `Switch your wallet to ${requiredNetwork} before continuing. Current network: ${currentNetwork}.`;
}

export function testnetGasWarning(balanceMist: string | undefined, hasAccount: boolean, locale: "en" | "zh"): string | undefined {
  if (!hasAccount || balanceMist !== "0") return undefined;
  if (locale === "zh") {
    return "当前地址在 testnet 没有 SUI，无法领取或提交挑战。请点击导航栏“水龙头”领取测试水：https://faucet.sui.io/";
  }
  return "This address has no SUI on testnet, so it cannot claim or submit challenges. Use the Faucet link in the navigation: https://faucet.sui.io/";
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
