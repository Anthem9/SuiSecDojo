import { describe, expect, it } from "vitest";
import { donationConfigFromEnv } from "./donation";

describe("donation config", () => {
  it("should disable donation assets when addresses are missing", () => {
    expect(donationConfigFromEnv({})).toEqual([
      { asset: "SUI", address: undefined, enabled: false },
      { asset: "WAL", address: undefined, enabled: false },
    ]);
  });

  it("should enable configured addresses", () => {
    expect(donationConfigFromEnv({ VITE_DONATION_SUI_ADDRESS: " 0xabc " })[0]).toEqual({
      asset: "SUI",
      address: "0xabc",
      enabled: true,
    });
  });
});
