import { describe, expect, it } from "vitest";
import { challenges } from "../data/challenges";
import { isChallengeCompleted, summarizeProgress } from "./progress";

describe("progress summary", () => {
  it("should calculate completion percentage and next challenge", () => {
    const summary = summarizeProgress(challenges, {
      completedChallengeIds: ["1"],
      badgeIds: [],
    });

    expect(summary.completed).toBe(1);
    expect(summary.total).toBe(5);
    expect(summary.percent).toBe(20);
    expect(summary.nextChallenge?.slug).toBe("shared-vault");
  });

  it("should treat unknown completed ids as non-completing", () => {
    const summary = summarizeProgress(challenges, {
      completedChallengeIds: ["999"],
      badgeIds: [],
    });

    expect(summary.completed).toBe(0);
    expect(summary.percent).toBe(0);
  });

  it("should report whether a challenge is completed", () => {
    expect(isChallengeCompleted({ completedChallengeIds: ["1"], badgeIds: [] }, "1")).toBe(true);
    expect(isChallengeCompleted({ completedChallengeIds: ["1"], badgeIds: [] }, "2")).toBe(false);
  });
});
