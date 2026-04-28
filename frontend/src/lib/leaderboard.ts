export type CompletionEvent = {
  challengeId: string;
  solver: string;
  epoch: string;
  badgeType: string;
  timestampMs?: string;
  digest?: string;
};

export type LeaderboardEntry = {
  solver: string;
  completedCount: number;
  badgeCount: number;
  latestEpoch: string;
  latestTimestampMs?: string;
};

type SuiEventLike = {
  id?: { txDigest?: string };
  timestampMs?: string | null;
  parsedJson?: unknown;
};

export function parseCompletionEvents(events: SuiEventLike[]): CompletionEvent[] {
  return events
    .map((event) => {
      const json = isRecord(event.parsedJson) ? event.parsedJson : undefined;
      if (!json?.challenge_id || !json?.solver || json.epoch === undefined || json.badge_type === undefined) return undefined;
      const parsed: CompletionEvent = {
        challengeId: String(json.challenge_id),
        solver: String(json.solver),
        epoch: String(json.epoch),
        badgeType: String(json.badge_type),
        timestampMs: event.timestampMs ?? undefined,
        digest: event.id?.txDigest,
      };
      return parsed;
    })
    .filter((event): event is CompletionEvent => Boolean(event));
}

export function aggregateLeaderboard(events: CompletionEvent[], currentAddress?: string) {
  const bySolver = new Map<string, LeaderboardEntry & { challengeIds: Set<string>; badgeTypes: Set<string> }>();

  for (const event of events) {
    const key = event.solver.toLowerCase();
    const entry =
      bySolver.get(key) ??
      ({
        solver: event.solver,
        completedCount: 0,
        badgeCount: 0,
        latestEpoch: event.epoch,
        latestTimestampMs: event.timestampMs,
        challengeIds: new Set<string>(),
        badgeTypes: new Set<string>(),
      } as LeaderboardEntry & { challengeIds: Set<string>; badgeTypes: Set<string> });

    entry.challengeIds.add(event.challengeId);
    if (event.badgeType !== "0") entry.badgeTypes.add(event.badgeType);
    if (BigInt(event.epoch) >= BigInt(entry.latestEpoch)) {
      entry.latestEpoch = event.epoch;
      entry.latestTimestampMs = event.timestampMs;
    }
    bySolver.set(key, entry);
  }

  const entries = Array.from(bySolver.values())
    .map(({ challengeIds, badgeTypes, ...entry }) => ({
      ...entry,
      completedCount: challengeIds.size,
      badgeCount: badgeTypes.size,
    }))
    .sort((a, b) => b.completedCount - a.completedCount || Number(BigInt(b.latestEpoch) - BigInt(a.latestEpoch)));

  const currentRank = currentAddress
    ? entries.findIndex((entry) => entry.solver.toLowerCase() === currentAddress.toLowerCase()) + 1
    : 0;

  return {
    entries,
    recent: [...events].slice(0, 10),
    currentRank: currentRank > 0 ? currentRank : undefined,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
