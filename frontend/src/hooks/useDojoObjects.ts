import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { parseChallenge02VaultObject, parseChainChallengeState } from "../lib/chainState";
import type { ChallengeProgress } from "../types";

export function useDojoObjects(accountAddress: string | undefined, packageId: string) {
  const ownedObjectsQuery = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: accountAddress ?? "",
      filter: {
        MatchAny: [
          { StructType: `${packageId}::user_progress::UserProgress` },
          { StructType: `${packageId}::challenge_01_anyone_can_mint::ChallengeInstance` },
          { StructType: `${packageId}::challenge_02_shared_vault::ChallengeInstance` },
          { StructType: `${packageId}::challenge_03_fake_owner::ChallengeInstance` },
          { StructType: `${packageId}::challenge_04_leaky_capability::ChallengeInstance` },
          { StructType: `${packageId}::challenge_04_leaky_capability::AdminCap` },
          { StructType: `${packageId}::challenge_05_bad_init::ChallengeInstance` },
          { StructType: `${packageId}::challenge_05_bad_init::AdminCap` },
          { StructType: `${packageId}::challenge_06_price_rounding::ChallengeInstance` },
          { StructType: `${packageId}::challenge_07_overflow_guard::ChallengeInstance` },
          { StructType: `${packageId}::challenge_08_old_package_trap::ChallengeInstance` },
          { StructType: `${packageId}::challenge_09_ptb_combo::ChallengeInstance` },
          { StructType: `${packageId}::challenge_10_mini_amm_incident::ChallengeInstance` },
          { StructType: `${packageId}::challenge_11_object_transfer_trap::ChallengeInstance` },
          { StructType: `${packageId}::challenge_12_shared_object_pollution::ChallengeInstance` },
          { StructType: `${packageId}::challenge_13_delegated_capability_abuse::ChallengeInstance` },
          { StructType: `${packageId}::challenge_13_delegated_capability_abuse::DelegatedCap` },
          { StructType: `${packageId}::challenge_14_oracle_staleness::ChallengeInstance` },
          { StructType: `${packageId}::challenge_15_coin_accounting_mismatch::ChallengeInstance` },
          { StructType: `${packageId}::challenge_16_signer_confusion::ChallengeInstance` },
          { StructType: `${packageId}::challenge_17_dynamic_field_shadow::ChallengeInstance` },
          { StructType: `${packageId}::challenge_18_epoch_reward_drift::ChallengeInstance` },
          { StructType: `${packageId}::challenge_19_upgrade_witness_gap::ChallengeInstance` },
          { StructType: `${packageId}::challenge_19_upgrade_witness_gap::OldWitness` },
          { StructType: `${packageId}::challenge_20_liquidation_edge_case::ChallengeInstance` },
          { StructType: `${packageId}::dojo_pass::DojoPass` },
          { StructType: `${packageId}::badge::Badge` },
        ],
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
      limit: 50,
    },
    {
      enabled: Boolean(accountAddress && packageId),
    },
  );

  const suiBalanceQuery = useSuiClientQuery(
    "getBalance",
    {
      owner: accountAddress ?? "",
    },
    {
      enabled: Boolean(accountAddress),
    },
  );

  const chainState = useMemo(
    () => parseChainChallengeState(ownedObjectsQuery.data?.data ?? [], packageId),
    [ownedObjectsQuery.data?.data, packageId],
  );

  const challenge02VaultQuery = useSuiClientQuery(
    "getObject",
    {
      id: chainState.challenge02Instance?.vaultId ?? "",
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
    },
    {
      enabled: Boolean(chainState.challenge02Instance?.vaultId && packageId),
    },
  );

  const challenge02Vault = useMemo(
    () => parseChallenge02VaultObject(challenge02VaultQuery.data, packageId),
    [challenge02VaultQuery.data, packageId],
  );

  const fullChainState = useMemo(
    () => ({
      ...chainState,
      challenge02Vault,
    }),
    [chainState, challenge02Vault],
  );

  const chainProgress: ChallengeProgress = useMemo(
    () => ({
      completedChallengeIds: fullChainState.progress?.completedChallengeIds ?? [],
      badgeIds: [
        ...(fullChainState.dojoPass?.mintedBadgeIds ?? []),
        ...(fullChainState.badges ?? []).map((badge) => badge.badgeType),
      ],
    }),
    [fullChainState.progress, fullChainState.dojoPass, fullChainState.badges],
  );

  const isSolved =
    fullChainState.challenge01Instance?.solved === true || fullChainState.progress?.completedChallengeIds.includes("1") === true;

  return {
    chainState: fullChainState,
    chainProgress,
    hasProgress: Boolean(fullChainState.progress),
    hasInstance: Boolean(fullChainState.challenge01Instance),
    isSolved,
    refetchObjects: async () => {
      await retryRefetch(async () => {
        await ownedObjectsQuery.refetch();
        if (chainState.challenge02Instance?.vaultId) {
          await challenge02VaultQuery.refetch();
        }
        if (accountAddress) {
          await suiBalanceQuery.refetch();
        }
      });
    },
    ownedObjectsQuery,
    challenge02VaultQuery,
    suiBalanceQuery,
    suiBalanceMist: suiBalanceQuery.data?.totalBalance,
  };
}

async function retryRefetch(refetch: () => Promise<void>) {
  const delaysMs = [0, 650, 1400];

  for (const delayMs of delaysMs) {
    if (delayMs > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, delayMs));
    }
    await refetch();
  }
}
