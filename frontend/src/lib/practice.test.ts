import { describe, expect, it } from "vitest";
import { challenges } from "../data/challenges";
import { cliPracticeTemplate, defaultPracticeInputs } from "./practice";

describe("practice helpers", () => {
  it("should generate a fillable CLI template for Challenge 01", () => {
    const template = cliPracticeTemplate({
      challenge: challenges[0],
      packageId: "0xpackage",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["1"], completedChallengeIds: [], badgeIds: [] },
        challenge01Instance: { objectId: "0xinstance", challengeId: "1", mintedAmount: "0", solved: false },
      },
      values: { ...defaultPracticeInputs, mintAmount: "1234" },
    });

    expect(template).toContain("vulnerable_mint");
    expect(template).toContain("1234");
    expect(template).toContain("<MODE_CODE> <ASSISTANCE_LEVEL>");
  });

  it("should generate a PTB template for Challenge 09", () => {
    const challenge09 = challenges.find((challenge) => challenge.id === "9")!;
    const template = cliPracticeTemplate({
      challenge: challenge09,
      packageId: "0xpackage",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["9"], completedChallengeIds: [], badgeIds: [] },
        challenge09Instance: { objectId: "0xinstance", challengeId: "9", owner: "0xalice", comboReady: false, solved: false },
      },
      values: defaultPracticeInputs,
    });

    expect(template).toContain("sui client ptb");
    expect(template).toContain("prepare_combo");
    expect(template).toContain("finish_combo");
  });

  it("should generate fillable CLI templates for Challenge 16 and 20", () => {
    const challenge16 = challenges.find((challenge) => challenge.id === "16")!;
    const challenge20 = challenges.find((challenge) => challenge.id === "20")!;
    const baseState = {
      progress: { objectId: "0xprogress", claimedChallengeIds: [], completedChallengeIds: [], badgeIds: [] },
    };

    const signerTemplate = cliPracticeTemplate({
      challenge: challenge16,
      packageId: "0xpackage",
      chainState: {
        ...baseState,
        challenge16Instance: {
          objectId: "0xinstance16",
          challengeId: "16",
          owner: "0xalice",
          trustedSigner: "0x0",
          intentAccepted: false,
          solved: false,
        },
      },
      values: { ...defaultPracticeInputs, claimedSigner: "0xalice" },
    });
    const liquidationTemplate = cliPracticeTemplate({
      challenge: challenge20,
      packageId: "0xpackage",
      chainState: {
        ...baseState,
        challenge20Instance: {
          objectId: "0xinstance20",
          challengeId: "20",
          owner: "0xalice",
          collateral: "100",
          debt: "50",
          health: "50",
          liquidated: false,
          solved: false,
        },
      },
      values: { ...defaultPracticeInputs, liquidationPrice: "24", liquidationThreshold: "50" },
    });

    expect(signerTemplate).toContain("vulnerable_accept_intent");
    expect(signerTemplate).toContain("0xalice");
    expect(liquidationTemplate).toContain("vulnerable_liquidate");
    expect(liquidationTemplate).toContain("24 50");
  });
});
