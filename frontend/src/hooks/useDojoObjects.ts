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
      badgeIds: [],
    }),
    [fullChainState.progress],
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
    },
    ownedObjectsQuery,
    challenge02VaultQuery,
  };
}
