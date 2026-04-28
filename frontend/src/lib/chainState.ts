import type { SuiObjectResponse } from "@mysten/sui/jsonRpc";

export type UserProgressObject = {
  objectId: string;
  claimedChallengeIds: string[];
  completedChallengeIds: string[];
  badgeIds?: string[];
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

export type Challenge04InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  capClaimed: boolean;
  adminFlag: boolean;
  solved: boolean;
};

export type Challenge04AdminCapObject = {
  objectId: string;
  instanceId: string;
  owner: string;
};

export type Challenge05InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  adminCapCreated: boolean;
  initialized: boolean;
  solved: boolean;
};

export type Challenge05AdminCapObject = {
  objectId: string;
  instanceId: string;
  owner: string;
};

export type Challenge06InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  paidAmount: string;
  credits: string;
  solved: boolean;
};

export type Challenge07InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  guardedValue: string;
  solved: boolean;
};

export type Challenge08InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  legacyFlag: boolean;
  solved: boolean;
};

export type Challenge09InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  comboReady: boolean;
  solved: boolean;
};

export type Challenge10InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  reserveX: string;
  reserveY: string;
  attackerProfit: string;
  invariantBroken: boolean;
  solved: boolean;
};

export type BadgeObject = {
  objectId: string;
  owner: string;
  badgeType: string;
  issuedAtEpoch: string;
};

export type ChainChallengeState = {
  progress?: UserProgressObject;
  challenge01Instance?: ChallengeInstanceObject;
  challenge02Instance?: Challenge02InstanceObject;
  challenge02Vault?: SharedVaultObject;
  challenge03Instance?: Challenge03InstanceObject;
  challenge04Instance?: Challenge04InstanceObject;
  challenge04AdminCap?: Challenge04AdminCapObject;
  challenge05Instance?: Challenge05InstanceObject;
  challenge05AdminCap?: Challenge05AdminCapObject;
  challenge06Instance?: Challenge06InstanceObject;
  challenge07Instance?: Challenge07InstanceObject;
  challenge08Instance?: Challenge08InstanceObject;
  challenge09Instance?: Challenge09InstanceObject;
  challenge10Instance?: Challenge10InstanceObject;
  badges?: BadgeObject[];
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

export function getChallenge04InstanceType(packageId: string): string {
  return `${packageId}::challenge_04_leaky_capability::ChallengeInstance`;
}

export function getChallenge04AdminCapType(packageId: string): string {
  return `${packageId}::challenge_04_leaky_capability::AdminCap`;
}

export function getChallenge05InstanceType(packageId: string): string {
  return `${packageId}::challenge_05_bad_init::ChallengeInstance`;
}

export function getChallenge05AdminCapType(packageId: string): string {
  return `${packageId}::challenge_05_bad_init::AdminCap`;
}

export function getChallenge06InstanceType(packageId: string): string {
  return `${packageId}::challenge_06_price_rounding::ChallengeInstance`;
}

export function getChallenge07InstanceType(packageId: string): string {
  return `${packageId}::challenge_07_overflow_guard::ChallengeInstance`;
}

export function getChallenge08InstanceType(packageId: string): string {
  return `${packageId}::challenge_08_old_package_trap::ChallengeInstance`;
}

export function getChallenge09InstanceType(packageId: string): string {
  return `${packageId}::challenge_09_ptb_combo::ChallengeInstance`;
}

export function getChallenge10InstanceType(packageId: string): string {
  return `${packageId}::challenge_10_mini_amm_incident::ChallengeInstance`;
}

export function getBadgeType(packageId: string): string {
  return `${packageId}::badge::Badge`;
}

export function parseChainChallengeState(objects: SuiObjectResponse[], packageId: string): ChainChallengeState {
  const progressType = getUserProgressType(packageId);
  const challenge01Type = getChallenge01InstanceType(packageId);
  const challenge02Type = getChallenge02InstanceType(packageId);
  const challenge03Type = getChallenge03InstanceType(packageId);
  const challenge04Type = getChallenge04InstanceType(packageId);
  const challenge04AdminCapType = getChallenge04AdminCapType(packageId);
  const challenge05Type = getChallenge05InstanceType(packageId);
  const challenge05AdminCapType = getChallenge05AdminCapType(packageId);
  const challenge06Type = getChallenge06InstanceType(packageId);
  const challenge07Type = getChallenge07InstanceType(packageId);
  const challenge08Type = getChallenge08InstanceType(packageId);
  const challenge09Type = getChallenge09InstanceType(packageId);
  const challenge10Type = getChallenge10InstanceType(packageId);
  const badgeType = getBadgeType(packageId);

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
          badgeIds: toStringArray(content.fields.badges),
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

    if (content.type === challenge04Type && content.fields.challenge_id === "4") {
      return {
        ...state,
        challenge04Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          capClaimed: content.fields.cap_claimed === true,
          adminFlag: content.fields.admin_flag === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge04AdminCapType) {
      return {
        ...state,
        challenge04AdminCap: {
          objectId: data.objectId,
          instanceId: String(content.fields.instance_id),
          owner: String(content.fields.owner),
        },
      };
    }

    if (content.type === challenge05Type && content.fields.challenge_id === "5") {
      return {
        ...state,
        challenge05Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          adminCapCreated: content.fields.admin_cap_created === true,
          initialized: content.fields.initialized === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge05AdminCapType) {
      return {
        ...state,
        challenge05AdminCap: {
          objectId: data.objectId,
          instanceId: String(content.fields.instance_id),
          owner: String(content.fields.owner),
        },
      };
    }

    if (content.type === challenge06Type && content.fields.challenge_id === "6") {
      return {
        ...state,
        challenge06Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          paidAmount: String(content.fields.paid_amount),
          credits: String(content.fields.credits),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge07Type && content.fields.challenge_id === "7") {
      return {
        ...state,
        challenge07Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          guardedValue: String(content.fields.guarded_value),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge08Type && content.fields.challenge_id === "8") {
      return {
        ...state,
        challenge08Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          legacyFlag: content.fields.legacy_flag === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge09Type && content.fields.challenge_id === "9") {
      return {
        ...state,
        challenge09Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          comboReady: content.fields.combo_ready === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge10Type && content.fields.challenge_id === "10") {
      return {
        ...state,
        challenge10Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          reserveX: String(content.fields.reserve_x),
          reserveY: String(content.fields.reserve_y),
          attackerProfit: String(content.fields.attacker_profit),
          invariantBroken: content.fields.invariant_broken === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === badgeType) {
      return {
        ...state,
        badges: [
          ...(state.badges ?? []),
          {
            objectId: data.objectId,
            owner: String(content.fields.owner),
            badgeType: String(content.fields.badge_type),
            issuedAtEpoch: String(content.fields.issued_at_epoch),
          },
        ],
      };
    }

    return state;
  }, { badges: [] });
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
