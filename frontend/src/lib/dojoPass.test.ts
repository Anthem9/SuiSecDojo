import { describe, expect, it } from "vitest";
import { dojoPassConfigFromEnv, hasUnlockedAnswer, mistPriceLabel, requiredNetworkMessage } from "./dojoPass";

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
    expect(requiredNetworkMessage("testnet", "mainnet", "zh")).toContain("切换到 mainnet");
    expect(requiredNetworkMessage("mainnet", "mainnet", "en")).toBeUndefined();
  });
});
