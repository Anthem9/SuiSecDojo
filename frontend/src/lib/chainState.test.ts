import { describe, expect, it } from "vitest";
import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";
import {
  getChallenge01InstanceType,
  getChallenge02InstanceType,
  getChallenge02VaultType,
  getChallenge03InstanceType,
  getChallenge04AdminCapType,
  getChallenge04InstanceType,
  getChallenge05AdminCapType,
  getChallenge05InstanceType,
  getChallenge06InstanceType,
  getChallenge07InstanceType,
  getChallenge08InstanceType,
  getChallenge09InstanceType,
  getChallenge10InstanceType,
  getChallenge11InstanceType,
  getChallenge12InstanceType,
  getChallenge13DelegatedCapType,
  getChallenge13InstanceType,
  getChallenge14InstanceType,
  getChallenge15InstanceType,
  getBadgeType,
  getUserProgressType,
  hasPhase0Deployment,
  parseChallenge02VaultObject,
  parseChainChallengeState,
} from "./chainState";

const packageId = "0xabc";

describe("chain state adapter", () => {
  it("should detect missing deployment config", () => {
    expect(hasPhase0Deployment("")).toBe(false);
    expect(hasPhase0Deployment("  ")).toBe(false);
    expect(hasPhase0Deployment(packageId)).toBe(true);
  });

  it("should parse progress and challenge instance objects", () => {
    const objects: SuiObjectResponse[] = [
      moveObject("0xprogress", getUserProgressType(packageId), {
        claimed_challenges: ["1"],
        completed_challenges: ["1"],
        badges: ["1"],
      }),
      moveObject("0xinstance", getChallenge01InstanceType(packageId), {
        challenge_id: "1",
        minted_amount: "1000",
        solved: true,
      }),
      moveObject("0xinstance2", getChallenge02InstanceType(packageId), {
        challenge_id: "2",
        vault_id: "0xvault",
        solved: false,
      }),
      moveObject("0xinstance3", getChallenge03InstanceType(packageId), {
        challenge_id: "3",
        owner: "0xalice",
        restricted_flag: true,
        solved: false,
      }),
      moveObject("0xinstance4", getChallenge04InstanceType(packageId), {
        challenge_id: "4",
        owner: "0xalice",
        cap_claimed: true,
        admin_flag: true,
        solved: false,
      }),
      moveObject("0xcap4", getChallenge04AdminCapType(packageId), {
        instance_id: "0xinstance4",
        owner: "0xalice",
      }),
      moveObject("0xinstance5", getChallenge05InstanceType(packageId), {
        challenge_id: "5",
        owner: "0xalice",
        admin_cap_created: true,
        initialized: true,
        solved: false,
      }),
      moveObject("0xcap5", getChallenge05AdminCapType(packageId), {
        instance_id: "0xinstance5",
        owner: "0xalice",
      }),
      moveObject("0xinstance6", getChallenge06InstanceType(packageId), {
        challenge_id: "6",
        owner: "0xalice",
        paid_amount: "10",
        credits: "10",
        solved: false,
      }),
      moveObject("0xinstance7", getChallenge07InstanceType(packageId), {
        challenge_id: "7",
        owner: "0xalice",
        guarded_value: "1000",
        solved: false,
      }),
      moveObject("0xinstance8", getChallenge08InstanceType(packageId), {
        challenge_id: "8",
        owner: "0xalice",
        legacy_flag: true,
        solved: false,
      }),
      moveObject("0xinstance9", getChallenge09InstanceType(packageId), {
        challenge_id: "9",
        owner: "0xalice",
        combo_ready: true,
        solved: false,
      }),
      moveObject("0xinstance10", getChallenge10InstanceType(packageId), {
        challenge_id: "10",
        owner: "0xalice",
        reserve_x: "200",
        reserve_y: "0",
        attacker_profit: "100",
        invariant_broken: true,
        solved: false,
      }),
      moveObject("0xinstance11", getChallenge11InstanceType(packageId), {
        challenge_id: "11",
        owner: "0xalice",
        custodian: "0xalice",
        solved: false,
      }),
      moveObject("0xinstance12", getChallenge12InstanceType(packageId), {
        challenge_id: "12",
        owner: "0xalice",
        pollution_count: "1",
        solved: false,
      }),
      moveObject("0xinstance13", getChallenge13InstanceType(packageId), {
        challenge_id: "13",
        owner: "0xalice",
        privileged_flag: true,
        solved: false,
      }),
      moveObject("0xcap13", getChallenge13DelegatedCapType(packageId), {
        instance_id: "0xinstance13",
        owner: "0xalice",
        scope: "0",
      }),
      moveObject("0xinstance14", getChallenge14InstanceType(packageId), {
        challenge_id: "14",
        owner: "0xalice",
        stale_price_used: true,
        observed_epoch: "1",
        solved: false,
      }),
      moveObject("0xinstance15", getChallenge15InstanceType(packageId), {
        challenge_id: "15",
        owner: "0xalice",
        deposits: "0",
        credits: "1",
        solved: false,
      }),
      moveObject("0xbadge", getBadgeType(packageId), {
        owner: "0xalice",
        badge_type: "1",
        issued_at_epoch: "12",
      }),
    ];

    expect(parseChainChallengeState(objects, packageId)).toEqual({
      progress: {
        objectId: "0xprogress",
        claimedChallengeIds: ["1"],
        completedChallengeIds: ["1"],
        badgeIds: ["1"],
      },
      challenge01Instance: {
        objectId: "0xinstance",
        challengeId: "1",
        mintedAmount: "1000",
        solved: true,
      },
      challenge02Instance: {
        objectId: "0xinstance2",
        challengeId: "2",
        vaultId: "0xvault",
        solved: false,
      },
      challenge03Instance: {
        objectId: "0xinstance3",
        challengeId: "3",
        owner: "0xalice",
        restrictedFlag: true,
        solved: false,
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
      challenge06Instance: {
        objectId: "0xinstance6",
        challengeId: "6",
        owner: "0xalice",
        paidAmount: "10",
        credits: "10",
        solved: false,
      },
      challenge07Instance: {
        objectId: "0xinstance7",
        challengeId: "7",
        owner: "0xalice",
        guardedValue: "1000",
        solved: false,
      },
      challenge08Instance: {
        objectId: "0xinstance8",
        challengeId: "8",
        owner: "0xalice",
        legacyFlag: true,
        solved: false,
      },
      challenge09Instance: {
        objectId: "0xinstance9",
        challengeId: "9",
        owner: "0xalice",
        comboReady: true,
        solved: false,
      },
      challenge10Instance: {
        objectId: "0xinstance10",
        challengeId: "10",
        owner: "0xalice",
        reserveX: "200",
        reserveY: "0",
        attackerProfit: "100",
        invariantBroken: true,
        solved: false,
      },
      challenge11Instance: {
        objectId: "0xinstance11",
        challengeId: "11",
        owner: "0xalice",
        custodian: "0xalice",
        solved: false,
      },
      challenge12Instance: {
        objectId: "0xinstance12",
        challengeId: "12",
        owner: "0xalice",
        pollutionCount: "1",
        solved: false,
      },
      challenge13Instance: {
        objectId: "0xinstance13",
        challengeId: "13",
        owner: "0xalice",
        privilegedFlag: true,
        solved: false,
      },
      challenge13DelegatedCap: {
        objectId: "0xcap13",
        instanceId: "0xinstance13",
        owner: "0xalice",
        scope: "0",
      },
      challenge14Instance: {
        objectId: "0xinstance14",
        challengeId: "14",
        owner: "0xalice",
        stalePriceUsed: true,
        observedEpoch: "1",
        solved: false,
      },
      challenge15Instance: {
        objectId: "0xinstance15",
        challengeId: "15",
        owner: "0xalice",
        deposits: "0",
        credits: "1",
        solved: false,
      },
      badges: [{ objectId: "0xbadge", owner: "0xalice", badgeType: "1", issuedAtEpoch: "12" }],
    });
  });

  it("should parse a shared vault object", () => {
    expect(
      parseChallenge02VaultObject(
        moveObject("0xvault", getChallenge02VaultType(packageId), {
          owner: "0xalice",
          balance: "0",
        }),
        packageId,
      ),
    ).toEqual({
      objectId: "0xvault",
      owner: "0xalice",
      balance: "0",
    });
  });

  it("should ignore unrelated and malformed objects", () => {
    const objects: SuiObjectResponse[] = [
      moveObject("0xother", `${packageId}::other::Object`, {}),
      { data: null },
    ];

    expect(parseChainChallengeState(objects, packageId)).toEqual({ badges: [] });
  });

  it("should parse numeric Move ids returned by some wallet RPC paths", () => {
    const state = parseChainChallengeState(
      [
        moveObject("0xinstance", getChallenge01InstanceType(packageId), {
          challenge_id: 1,
          minted_amount: 0,
          solved: false,
        }),
      ],
      packageId,
    );

    expect(state.challenge01Instance).toMatchObject({
      objectId: "0xinstance",
      challengeId: "1",
      mintedAmount: "0",
      solved: false,
    });
  });
});

function moveObject(objectId: string, type: string, fields: Record<string, unknown>): SuiObjectResponse {
  return {
    data: {
      objectId,
      version: "1",
      digest: "digest",
      type,
      content: {
        dataType: "moveObject",
        type,
        hasPublicTransfer: true,
        fields: fields as never,
      },
    },
  };
}
