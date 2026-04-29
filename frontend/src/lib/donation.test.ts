import { describe, expect, it } from "vitest";
import { contactConfigFromEnv, donationConfigFromEnv } from "./donation";

describe("donation config", () => {
  it("should disable donation assets when addresses are missing", () => {
    expect(donationConfigFromEnv({})).toEqual({ label: "Sui Address", address: undefined, enabled: false });
  });

  it("should enable configured addresses", () => {
    expect(donationConfigFromEnv({ VITE_DONATION_ADDRESS: " 0xabc " })).toEqual({
      label: "Sui Address",
      address: "0xabc",
      enabled: true,
    });
  });

  it("should expose optional contact channels", () => {
    expect(contactConfigFromEnv({ VITE_CONTACT_EMAIL: " hello@example.com " })[0]).toEqual({
      label: "Email",
      value: "hello@example.com",
      href: "mailto:hello@example.com",
      enabled: true,
    });
  });

  it("should turn a Telegram handle into a public t.me link", () => {
    expect(contactConfigFromEnv({ VITE_CONTACT_TELEGRAM: " @Anitya_9527 " })[2]).toEqual({
      label: "Telegram",
      value: "@Anitya_9527",
      href: "https://t.me/Anitya_9527",
      enabled: true,
    });
  });
});
