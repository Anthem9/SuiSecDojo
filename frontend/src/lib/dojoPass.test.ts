import { describe, expect, it } from "vitest";
import {
  dojoPassConfigFromEnv,
  hasUnlockedAnswer,
  mistPriceLabel,
  requiredNetworkMessage,
  testnetGasWarning,
  walletNetworkFromChains,
} from "./dojoPass";

describe("dojo pass config", () => {
  it("should disable pass actions when config is missing", () => {
    expect(dojoPassConfigFromEnv({})).toMatchObject({ network: "testnet", enabled: false });
  });

  it("should enable pass actions when package and config ids are present", () => {
    expect(
      dojoPassConfigFromEnv({
        VITE_DOJO_PASS_NETWORK: " testnet ",
        VITE_DOJO_PASS_PACKAGE_ID: " 0xpackage ",
        VITE_DOJO_PASS_CONFIG_ID: " 0xconfig ",
        VITE_ANSWER_UNLOCK_PRICE_MIST: "10000000",
      }),
    ).toMatchObject({
      network: "testnet",
      packageId: "0xpackage",
      configId: "0xconfig",
      answerPriceMist: "10000000",
      enabled: true,
    });
  });

  it("should format prices and answer unlock state", () => {
    expect(mistPriceLabel("50000000")).toBe("0.05 SUI");
    expect(hasUnlockedAnswer(["1", "3"], "3")).toBe(true);
    expect(hasUnlockedAnswer(["1", "3"], "2")).toBe(false);
  });

  it("should explain required wallet network switches", () => {
    expect(requiredNetworkMessage("mainnet", "testnet", "zh", "challenge")).toContain("训练挑战只在 testnet 运行");
    expect(requiredNetworkMessage("testnet", "mainnet", "zh", "dojo-pass")).toContain("答案解锁和徽章铸造使用 mainnet");
    expect(requiredNetworkMessage("mainnet", "mainnet", "en")).toBeUndefined();
  });

  it("should derive wallet network from wallet-standard chains", () => {
    expect(walletNetworkFromChains(["sui:mainnet"], "testnet")).toBe("mainnet");
    expect(walletNetworkFromChains(["sui:unknown"], "testnet")).toBe("testnet");
  });

  it("should warn when the current address has no testnet gas", () => {
    expect(testnetGasWarning("0", true, "zh")).toContain("领取测试水");
    expect(testnetGasWarning("1000", true, "zh")).toBeUndefined();
    expect(testnetGasWarning("0", false, "en")).toBeUndefined();
  });
});
