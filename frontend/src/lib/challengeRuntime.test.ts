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
    expect(state.canUseCapability).toBe(false);
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

  it("should require a mint before Challenge 01 solve is enabled", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "1",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["1"],
          completedChallengeIds: [],
        },
        challenge01Instance: {
          objectId: "0xinstance",
          challengeId: "1",
          mintedAmount: "0",
          solved: false,
        },
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Run your mint before submitting solve.");
  });

  it("should enable Challenge 01 solve after the mint threshold is reached", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "1",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["1"],
          completedChallengeIds: [],
        },
        challenge01Instance: {
          objectId: "0xinstance",
          challengeId: "1",
          mintedAmount: "1000",
          solved: false,
        },
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to submit Anyone Can Mint solve.");
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

  it("should enable Challenge 03 exploit after claim and before flag is set", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "3",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["3"],
          completedChallengeIds: [],
        },
        challenge03Instance: {
          objectId: "0xinstance3",
          challengeId: "3",
          owner: "0xalice",
          restrictedFlag: false,
          solved: false,
        },
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canExploit).toBe(true);
    expect(state.exploitReason).toBe("Ready to exploit the trusted owner parameter.");
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Set the restricted flag before solving.");
  });

  it("should enable Challenge 03 solve after the restricted flag is set", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "3",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["3"],
          completedChallengeIds: [],
        },
        challenge03Instance: {
          objectId: "0xinstance3",
          challengeId: "3",
          owner: "0xalice",
          restrictedFlag: true,
          solved: false,
        },
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canExploit).toBe(false);
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Fake Owner.");
  });

  it("should enable Challenge 04 exploit before the admin capability is claimed", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "4",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["4"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge04Instance: {
          objectId: "0xinstance4",
          challengeId: "4",
          owner: "0xalice",
          capClaimed: false,
          adminFlag: false,
          solved: false,
        },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canExploit).toBe(true);
    expect(state.exploitReason).toBe("Ready to claim the leaked admin capability.");
    expect(state.canSolve).toBe(false);
  });

  it("should require using the Challenge 04 admin capability before solve", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "4",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["4"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge04Instance: {
          objectId: "0xinstance4",
          challengeId: "4",
          owner: "0xalice",
          capClaimed: true,
          adminFlag: false,
          solved: false,
        },
        challenge04AdminCap: {
          objectId: "0xcap4",
          instanceId: "0xinstance4",
          owner: "0xalice",
        },
        badges: [],
      },
    });

    expect(state.canExploit).toBe(false);
    expect(state.canUseCapability).toBe(true);
    expect(state.useCapabilityReason).toBe("Ready to use the leaked admin capability.");
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Use the admin capability before solving.");
  });

  it("should enable Challenge 04 solve after the admin flag is set", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "4",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["4"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge04Instance: {
          objectId: "0xinstance4",
          challengeId: "4",
          owner: "0xalice",
          capClaimed: true,
          adminFlag: true,
          solved: false,
        },
        challenge04AdminCap: {
          objectId: "0xcap4",
          instanceId: "0xinstance4",
          owner: "0xalice",
        },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Leaky Capability.");
  });

  it("should enable Challenge 05 exploit before the bad init cap is created", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "5",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["5"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge05Instance: {
          objectId: "0xinstance5",
          challengeId: "5",
          owner: "0xalice",
          adminCapCreated: false,
          initialized: false,
          solved: false,
        },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canExploit).toBe(true);
    expect(state.exploitReason).toBe("Ready to create the bad init admin capability.");
    expect(state.canUseCapability).toBe(false);
    expect(state.canSolve).toBe(false);
  });

  it("should require using the Challenge 05 admin cap before solve", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "5",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["5"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge05Instance: {
          objectId: "0xinstance5",
          challengeId: "5",
          owner: "0xalice",
          adminCapCreated: true,
          initialized: false,
          solved: false,
        },
        challenge05AdminCap: {
          objectId: "0xcap5",
          instanceId: "0xinstance5",
          owner: "0xalice",
        },
        badges: [],
      },
    });

    expect(state.canExploit).toBe(false);
    expect(state.canUseCapability).toBe(true);
    expect(state.useCapabilityReason).toBe("Ready to use the bad init admin capability.");
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Initialize protected state before solving.");
  });

  it("should enable Challenge 05 solve after initialized is set", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "5",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["5"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge05Instance: {
          objectId: "0xinstance5",
          challengeId: "5",
          owner: "0xalice",
          adminCapCreated: true,
          initialized: true,
          solved: false,
        },
        challenge05AdminCap: {
          objectId: "0xcap5",
          instanceId: "0xinstance5",
          owner: "0xalice",
        },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Bad Init.");
  });

  it("should enable Challenge 06 exploit before enough credits are accumulated", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "6",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["6"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge06Instance: {
          objectId: "0xinstance6",
          challengeId: "6",
          owner: "0xalice",
          paidAmount: "0",
          credits: "0",
          solved: false,
        },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canExploit).toBe(true);
    expect(state.exploitReason).toBe("Ready to exploit repeated tiny rounded buys.");
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Exploit rounding until credits reach 10.");
  });

  it("should enable Challenge 06 solve once credits reach the threshold", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "6",
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["6"],
          completedChallengeIds: [],
          badgeIds: [],
        },
        challenge06Instance: {
          objectId: "0xinstance6",
          challengeId: "6",
          owner: "0xalice",
          paidAmount: "10",
          credits: "10",
          solved: false,
        },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canExploit).toBe(false);
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Price Rounding.");
  });

  it("should enable Challenge 11 solve after custody is accepted", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "11",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["11"], completedChallengeIds: [], badgeIds: [] },
        challenge11Instance: { objectId: "0xinstance11", challengeId: "11", owner: "0xalice", custodian: "0xalice", solved: false },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Object Transfer Trap.");
  });

  it("should require using Challenge 13 delegated capability before solve", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "13",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["13"], completedChallengeIds: [], badgeIds: [] },
        challenge13Instance: {
          objectId: "0xinstance13",
          challengeId: "13",
          owner: "0xalice",
          privilegedFlag: false,
          solved: false,
        },
        challenge13DelegatedCap: { objectId: "0xcap13", instanceId: "0xinstance13", owner: "0xalice", scope: "0" },
        badges: [],
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canUseCapability).toBe(true);
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Use the delegated capability before solving.");
  });

  it("should enable Challenge 16 solve after signer intent is accepted", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "16",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["16"], completedChallengeIds: [], badgeIds: [] },
        challenge16Instance: {
          objectId: "0xinstance16",
          challengeId: "16",
          owner: "0xalice",
          trustedSigner: "0xalice",
          intentAccepted: true,
          solved: false,
        },
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Signer Confusion.");
  });

  it("should require using Challenge 19 old witness before solve", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "19",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["19"], completedChallengeIds: [], badgeIds: [] },
        challenge19Instance: {
          objectId: "0xinstance19",
          challengeId: "19",
          owner: "0xalice",
          oldWitnessUsed: false,
          solved: false,
        },
        challenge19OldWitness: { objectId: "0xwitness19", instanceId: "0xinstance19", owner: "0xalice" },
      },
    });

    expect(state.runtimeState).toBe("claimed");
    expect(state.canUseCapability).toBe(true);
    expect(state.canSolve).toBe(false);
    expect(state.solveReason).toBe("Use the old witness path before solving.");
  });

  it("should enable Challenge 20 solve after edge liquidation", () => {
    const state = getChallenge01ActionState({
      accountAddress: "0xalice",
      packageId: "0xpackage",
      selectedChallengeId: "20",
      chainState: {
        progress: { objectId: "0xprogress", claimedChallengeIds: ["20"], completedChallengeIds: [], badgeIds: [] },
        challenge20Instance: {
          objectId: "0xinstance20",
          challengeId: "20",
          owner: "0xalice",
          collateral: "100",
          debt: "50",
          health: "48",
          liquidated: true,
          solved: false,
        },
      },
    });

    expect(state.runtimeState).toBe("ready-to-solve");
    expect(state.canExploit).toBe(false);
    expect(state.canSolve).toBe(true);
    expect(state.solveReason).toBe("Ready to solve Liquidation Edge Case.");
  });
});
