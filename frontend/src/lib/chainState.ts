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

export type Challenge02InstanceObject = {
  objectId: string;
  challengeId: string;
  vaultId: string;
  solved: boolean;
};

export type SharedVaultObject = {
  objectId: string;
  owner: string;
  balance: string;
};

export type Challenge03InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  restrictedFlag: boolean;
  solved: boolean;
};

export type ChainChallengeState = {
  progress?: UserProgressObject;
  challenge01Instance?: ChallengeInstanceObject;
  challenge02Instance?: Challenge02InstanceObject;
  challenge02Vault?: SharedVaultObject;
  challenge03Instance?: Challenge03InstanceObject;
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

export function getChallenge02InstanceType(packageId: string): string {
  return `${packageId}::challenge_02_shared_vault::ChallengeInstance`;
}

export function getChallenge02VaultType(packageId: string): string {
  return `${packageId}::challenge_02_shared_vault::SharedVault`;
}

export function getChallenge03InstanceType(packageId: string): string {
  return `${packageId}::challenge_03_fake_owner::ChallengeInstance`;
}

export function parseChainChallengeState(objects: SuiObjectResponse[], packageId: string): ChainChallengeState {
  const progressType = getUserProgressType(packageId);
  const challenge01Type = getChallenge01InstanceType(packageId);
  const challenge02Type = getChallenge02InstanceType(packageId);
  const challenge03Type = getChallenge03InstanceType(packageId);

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

    if (content.type === challenge02Type && content.fields.challenge_id === "2") {
      return {
        ...state,
        challenge02Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          vaultId: String(content.fields.vault_id),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge03Type && content.fields.challenge_id === "3") {
      return {
        ...state,
        challenge03Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          restrictedFlag: content.fields.restricted_flag === true,
          solved: content.fields.solved === true,
        },
      };
    }

    return state;
  }, {});
}

export function parseChallenge02VaultObject(object: SuiObjectResponse | undefined, packageId: string): SharedVaultObject | undefined {
  const data = object?.data;
  const content = data?.content as MoveObjectContent | undefined;

  if (!data?.objectId || !content || content.dataType !== "moveObject" || content.type !== getChallenge02VaultType(packageId)) {
    return undefined;
  }

  return {
    objectId: data.objectId,
    owner: String(content.fields.owner),
    balance: String(content.fields.balance),
  };
}

export function hasPhase0Deployment(packageId: string): boolean {
  return packageId.trim().length > 0;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}
