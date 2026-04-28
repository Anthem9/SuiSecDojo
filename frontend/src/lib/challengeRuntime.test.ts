import { describe, expect, it } from "vitest";
import { getChallenge01ActionState } from "./challengeRuntime";

describe("challenge runtime state", () => {
  it("should explain disabled actions before wallet connection", () => {
    const state = getChallenge01ActionState({
      packageId: "0xpackage",
      selectedChallengeId: "1",
      chainState: {},
    });

    expect(state.runtimeState).toBe("not-connected");
    expect(state.canCreateProgress).toBe(false);
    expect(state.createProgressReason).toBe("Connect a wallet first.");
    expect(state.canClaim).toBe(false);
    expect(state.canSolve).toBe(false);
  });

  it("should block all transactions when package config is missing", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "",
      selectedChallengeId: "1",
      chainState: {},
    });

    expect(state.runtimeState).toBe("missing-package");
    expect(state.canCreateProgress).toBe(false);
    expect(state.createProgressReason).toContain("VITE_PACKAGE_ID");
    expect(state.claimReason).toContain("VITE_PACKAGE_ID");
    expect(state.solveReason).toContain("VITE_PACKAGE_ID");
  });

  it("should enable the claim action after progress exists", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "1",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: [],
          completedChallengeIds: [],
        },
      },
    });

    expect(state.runtimeState).toBe("not-claimed");
    expect(state.canCreateProgress).toBe(false);
    expect(state.canClaim).toBe(true);
    expect(state.canSolve).toBe(false);
  });

  it("should disable solve after Challenge 01 is completed", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "1",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["1"],
          completedChallengeIds: ["1"],
        },
        challenge01Instance: {
          objectId: "0xinstance",
          challengeId: "1",
          mintedAmount: "1000",
          solved: true,
        },
      },
    });

    expect(state.runtimeState).toBe("solved");
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Challenge 01 already completed.");
  });
});
