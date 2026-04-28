import { describe, expect, it } from "vitest";
import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";
import {
  getChallenge01InstanceType,
  getUserProgressType,
  hasPhase0Deployment,
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
