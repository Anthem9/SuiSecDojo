import { describe, expect, it } from "vitest";
import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";
import {
  getChallenge01InstanceType,
  getChallenge02InstanceType,
  getChallenge02VaultType,
  getChallenge03InstanceType,
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
    ];

    expect(parseChainChallengeState(objects, packageId)).toEqual({
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

    expect(parseChainChallengeState(objects, packageId)).toEqual({});
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
