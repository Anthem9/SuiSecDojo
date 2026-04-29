import { describe, expect, it } from "vitest";
import { summarizePassport } from "./passport";
import type { ProfileSummary } from "./profile";

describe("passport summary", () => {
  it("should summarize progress certificate state", () => {
    const profile = {
      walletLabel: "0xabc...1234",
      network: "testnet",
      completed: 3,
      total: 10,
      badgeCount: 2,
      totalScore: 250,
      nextChallenge: { title: "Leaky Capability" },
    } as ProfileSummary;

    expect(summarizePassport(profile)).toMatchObject({
      holder: "0xabc...1234",
      completedLabel: "3/10 challenges completed",
      scoreLabel: "250 testnet learning points",
      certificateTitle: "SuiSec Dojo Progress Passport",
      nextStep: "Next: Leaky Capability",
    });
  });
});
