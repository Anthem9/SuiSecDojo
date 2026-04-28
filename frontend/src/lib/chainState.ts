import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";

export type UserProgressObject = {
  objectId: string;
  claimedChallengeIds: string[];
  completedChallengeIds: string[];
};

export type ChallengeInstanceObject = {
  objectId: string;
  challengeId: string;
  mintedAmount: string;
  solved: boolean;
};

export type ChainChallengeState = {
  progress?: UserProgressObject;
  challenge01Instance?: ChallengeInstanceObject;
};

type MoveObjectContent = {
  dataType: "moveObject";
  type: string;
  fields: Record<string, unknown>;
};

export function getUserProgressType(packageId: string): string {
  return `${packageId}::user_progress::UserProgress`;
}

export function getChallenge01InstanceType(packageId: string): string {
  return `${packageId}::challenge_01_anyone_can_mint::ChallengeInstance`;
}

export function parseChainChallengeState(objects: SuiObjectResponse[], packageId: string): ChainChallengeState {
  const progressType = getUserProgressType(packageId);
  const challenge01Type = getChallenge01InstanceType(packageId);

  return objects.reduce<ChainChallengeState>((state, object) => {
    const data = object.data;
    const content = data?.content as MoveObjectContent | undefined;

    if (!data?.objectId || !content || content.dataType !== "moveObject") {
      return state;
    }

    if (content.type === progressType) {
      return {
        ...state,
        progress: {
          objectId: data.objectId,
          claimedChallengeIds: toStringArray(content.fields.claimed_challenges),
          completedChallengeIds: toStringArray(content.fields.completed_challenges),
        },
      };
    }

    if (content.type === challenge01Type && content.fields.challenge_id === "1") {
      return {
        ...state,
        challenge01Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          mintedAmount: String(content.fields.minted_amount),
          solved: content.fields.solved === true,
        },
      };
    }

    return state;
  }, {});
}

export function hasPhase0Deployment(packageId: string): boolean {
  return packageId.trim().length > 0;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

