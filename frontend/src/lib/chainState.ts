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

export type Challenge11InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  custodian: string;
  solved: boolean;
};

export type Challenge12InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  pollutionCount: string;
  solved: boolean;
};

export type Challenge13InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  privilegedFlag: boolean;
  solved: boolean;
};

export type Challenge13DelegatedCapObject = {
  objectId: string;
  instanceId: string;
  owner: string;
  scope: string;
};

export type Challenge14InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  stalePriceUsed: boolean;
  observedEpoch: string;
  solved: boolean;
};

export type Challenge15InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  deposits: string;
  credits: string;
  solved: boolean;
};

export type Challenge16InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  trustedSigner: string;
  intentAccepted: boolean;
  solved: boolean;
};

export type Challenge17InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  trustedKey: string;
  shadowKey: string;
  shadowWritten: boolean;
  solved: boolean;
};

export type Challenge18InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  lastEpoch: string;
  rewards: string;
  solved: boolean;
};

export type Challenge19InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  oldWitnessUsed: boolean;
  solved: boolean;
};

export type Challenge19OldWitnessObject = {
  objectId: string;
  instanceId: string;
  owner: string;
};

export type Challenge20InstanceObject = {
  objectId: string;
  challengeId: string;
  owner: string;
  collateral: string;
  debt: string;
  health: string;
  liquidated: boolean;
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
  challenge11Instance?: Challenge11InstanceObject;
  challenge12Instance?: Challenge12InstanceObject;
  challenge13Instance?: Challenge13InstanceObject;
  challenge13DelegatedCap?: Challenge13DelegatedCapObject;
  challenge14Instance?: Challenge14InstanceObject;
  challenge15Instance?: Challenge15InstanceObject;
  challenge16Instance?: Challenge16InstanceObject;
  challenge17Instance?: Challenge17InstanceObject;
  challenge18Instance?: Challenge18InstanceObject;
  challenge19Instance?: Challenge19InstanceObject;
  challenge19OldWitness?: Challenge19OldWitnessObject;
  challenge20Instance?: Challenge20InstanceObject;
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

export function getChallenge11InstanceType(packageId: string): string {
  return `${packageId}::challenge_11_object_transfer_trap::ChallengeInstance`;
}

export function getChallenge12InstanceType(packageId: string): string {
  return `${packageId}::challenge_12_shared_object_pollution::ChallengeInstance`;
}

export function getChallenge13InstanceType(packageId: string): string {
  return `${packageId}::challenge_13_delegated_capability_abuse::ChallengeInstance`;
}

export function getChallenge13DelegatedCapType(packageId: string): string {
  return `${packageId}::challenge_13_delegated_capability_abuse::DelegatedCap`;
}

export function getChallenge14InstanceType(packageId: string): string {
  return `${packageId}::challenge_14_oracle_staleness::ChallengeInstance`;
}

export function getChallenge15InstanceType(packageId: string): string {
  return `${packageId}::challenge_15_coin_accounting_mismatch::ChallengeInstance`;
}

export function getChallenge16InstanceType(packageId: string): string {
  return `${packageId}::challenge_16_signer_confusion::ChallengeInstance`;
}

export function getChallenge17InstanceType(packageId: string): string {
  return `${packageId}::challenge_17_dynamic_field_shadow::ChallengeInstance`;
}

export function getChallenge18InstanceType(packageId: string): string {
  return `${packageId}::challenge_18_epoch_reward_drift::ChallengeInstance`;
}

export function getChallenge19InstanceType(packageId: string): string {
  return `${packageId}::challenge_19_upgrade_witness_gap::ChallengeInstance`;
}

export function getChallenge19OldWitnessType(packageId: string): string {
  return `${packageId}::challenge_19_upgrade_witness_gap::OldWitness`;
}

export function getChallenge20InstanceType(packageId: string): string {
  return `${packageId}::challenge_20_liquidation_edge_case::ChallengeInstance`;
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
  const challenge11Type = getChallenge11InstanceType(packageId);
  const challenge12Type = getChallenge12InstanceType(packageId);
  const challenge13Type = getChallenge13InstanceType(packageId);
  const challenge13DelegatedCapType = getChallenge13DelegatedCapType(packageId);
  const challenge14Type = getChallenge14InstanceType(packageId);
  const challenge15Type = getChallenge15InstanceType(packageId);
  const challenge16Type = getChallenge16InstanceType(packageId);
  const challenge17Type = getChallenge17InstanceType(packageId);
  const challenge18Type = getChallenge18InstanceType(packageId);
  const challenge19Type = getChallenge19InstanceType(packageId);
  const challenge19OldWitnessType = getChallenge19OldWitnessType(packageId);
  const challenge20Type = getChallenge20InstanceType(packageId);
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

    if (content.type === challenge01Type && String(content.fields.challenge_id) === "1") {
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

    if (content.type === challenge02Type && String(content.fields.challenge_id) === "2") {
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

    if (content.type === challenge03Type && String(content.fields.challenge_id) === "3") {
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

    if (content.type === challenge04Type && String(content.fields.challenge_id) === "4") {
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

    if (content.type === challenge05Type && String(content.fields.challenge_id) === "5") {
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

    if (content.type === challenge06Type && String(content.fields.challenge_id) === "6") {
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

    if (content.type === challenge07Type && String(content.fields.challenge_id) === "7") {
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

    if (content.type === challenge08Type && String(content.fields.challenge_id) === "8") {
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

    if (content.type === challenge09Type && String(content.fields.challenge_id) === "9") {
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

    if (content.type === challenge10Type && String(content.fields.challenge_id) === "10") {
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

    if (content.type === challenge11Type && String(content.fields.challenge_id) === "11") {
      return {
        ...state,
        challenge11Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          custodian: String(content.fields.custodian),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge12Type && String(content.fields.challenge_id) === "12") {
      return {
        ...state,
        challenge12Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          pollutionCount: String(content.fields.pollution_count),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge13Type && String(content.fields.challenge_id) === "13") {
      return {
        ...state,
        challenge13Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          privilegedFlag: content.fields.privileged_flag === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge13DelegatedCapType) {
      return {
        ...state,
        challenge13DelegatedCap: {
          objectId: data.objectId,
          instanceId: String(content.fields.instance_id),
          owner: String(content.fields.owner),
          scope: String(content.fields.scope),
        },
      };
    }

    if (content.type === challenge14Type && String(content.fields.challenge_id) === "14") {
      return {
        ...state,
        challenge14Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          stalePriceUsed: content.fields.stale_price_used === true,
          observedEpoch: String(content.fields.observed_epoch),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge15Type && String(content.fields.challenge_id) === "15") {
      return {
        ...state,
        challenge15Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          deposits: String(content.fields.deposits),
          credits: String(content.fields.credits),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge16Type && String(content.fields.challenge_id) === "16") {
      return {
        ...state,
        challenge16Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          trustedSigner: String(content.fields.trusted_signer),
          intentAccepted: content.fields.intent_accepted === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge17Type && String(content.fields.challenge_id) === "17") {
      return {
        ...state,
        challenge17Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          trustedKey: String(content.fields.trusted_key),
          shadowKey: String(content.fields.shadow_key),
          shadowWritten: content.fields.shadow_written === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge18Type && String(content.fields.challenge_id) === "18") {
      return {
        ...state,
        challenge18Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          lastEpoch: String(content.fields.last_epoch),
          rewards: String(content.fields.rewards),
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge19Type && String(content.fields.challenge_id) === "19") {
      return {
        ...state,
        challenge19Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          oldWitnessUsed: content.fields.old_witness_used === true,
          solved: content.fields.solved === true,
        },
      };
    }

    if (content.type === challenge19OldWitnessType) {
      return {
        ...state,
        challenge19OldWitness: {
          objectId: data.objectId,
          instanceId: String(content.fields.instance_id),
          owner: String(content.fields.owner),
        },
      };
    }

    if (content.type === challenge20Type && String(content.fields.challenge_id) === "20") {
      return {
        ...state,
        challenge20Instance: {
          objectId: data.objectId,
          challengeId: String(content.fields.challenge_id),
          owner: String(content.fields.owner),
          collateral: String(content.fields.collateral),
          debt: String(content.fields.debt),
          health: String(content.fields.health),
          liquidated: content.fields.liquidated === true,
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
