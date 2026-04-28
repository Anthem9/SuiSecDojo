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
    expect(state.canExploit).toBe(false);
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

  it("should enable Challenge 02 exploit after claim and before drain", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "2",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["2"],
          completedChallengeIds: [],
        },
        challenge02Instance: {
          objectId: "0xinstance2",
          challengeId: "2",
          vaultId: "0xvault",
          solved: false,
        },
        challenge02Vault: {
          objectId: "0xvault",
          owner: "0xalice",
          balance: "100",
        },
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canExploit).toBe(true);
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Drain the shared vault before solving.");
  });

  it("should enable Challenge 02 solve after vault is drained", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "2",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["2"],
          completedChallengeIds: [],
        },
        challenge02Instance: {
          objectId: "0xinstance2",
          challengeId: "2",
          vaultId: "0xvault",
          solved: false,
        },
        challenge02Vault: {
          objectId: "0xvault",
          owner: "0xalice",
          balance: "0",
        },
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canExploit).toBe(false);
    expect(state.canSolve).toBe(true);
  });
});
