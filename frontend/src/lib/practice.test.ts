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
});
