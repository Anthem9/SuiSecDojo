import { describe, expect, it } from "vitest";
import { mistPriceLabel, paidAccessConfigFromEnv } from "./paidAccess";

describe("paid access config", () => {
  it("should default to testnet and stay disabled without package config", () => {
    expect(paidAccessConfigFromEnv({})).toMatchObject({
      network: "testnet",
      enabled: false,
    });
  });

  it("should enable paid access when package and config ids are present", () => {
    expect(
      paidAccessConfigFromEnv({
        VITE_PAID_ACCESS_NETWORK: " mainnet ",
        VITE_PAID_ACCESS_PACKAGE_ID: " 0xpaid ",
        VITE_PAID_ACCESS_CONFIG_ID: " 0xconfig ",
      }),
    ).toMatchObject({
      network: "mainnet",
      packageId: "0xpaid",
      configId: "0xconfig",
      enabled: true,
    });
  });

  it("should format MIST prices as SUI", () => {
    expect(mistPriceLabel("1000000000")).toBe("1 SUI");
    expect(mistPriceLabel(undefined)).toBe("not configured");
  });
});
