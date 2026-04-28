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
        ...(fullChainState.progress?.badgeIds ?? []),
        ...(fullChainState.badges ?? []).map((badge) => badge.badgeType),
      ],
    }),
    [fullChainState.progress, fullChainState.badges],
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
      await ownedObjectsQuery.refetch();
      await challenge02VaultQuery.refetch();
      await suiBalanceQuery.refetch();
    },
    ownedObjectsQuery,
    challenge02VaultQuery,
    suiBalanceQuery,
    suiBalanceMist: suiBalanceQuery.data?.totalBalance,
  };
}
