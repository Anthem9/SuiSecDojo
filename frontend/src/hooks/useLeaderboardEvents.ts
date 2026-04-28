import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { aggregateLeaderboard, parseCompletionEvents } from "../lib/leaderboard";

export function useLeaderboardEvents(packageId: string, currentAddress?: string) {
  const eventType = `${packageId}::challenge_events::ChallengeCompleted`;
  const query = useSuiClientQuery(
    "queryEvents",
    {
      query: { MoveEventType: eventType },
      order: "descending",
      limit: 50,
    },
    {
      enabled: Boolean(packageId),
    },
  );

  const events = useMemo(() => parseCompletionEvents(query.data?.data ?? []), [query.data?.data]);
  const leaderboard = useMemo(() => aggregateLeaderboard(events, currentAddress), [events, currentAddress]);

  return { events, leaderboard, query };
}

