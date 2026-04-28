import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { parseChainChallengeState } from "../lib/chainState";
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

  const chainProgress: ChallengeProgress = useMemo(
    () => ({
      completedChallengeIds: chainState.progress?.completedChallengeIds ?? [],
      badgeIds: [],
    }),
    [chainState.progress],
  );

  const isSolved =
    chainState.challenge01Instance?.solved === true || chainState.progress?.completedChallengeIds.includes("1") === true;

  return {
    chainState,
    chainProgress,
    hasProgress: Boolean(chainState.progress),
    hasInstance: Boolean(chainState.challenge01Instance),
    isSolved,
    ownedObjectsQuery,
  };
}
