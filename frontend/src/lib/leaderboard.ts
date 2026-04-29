export type CompletionEvent = {
  challengeId: string;
  solver: string;
  epoch: string;
  badgeType: string;
  mode: "challenge" | "guided" | "unknown";
  assistanceLevel: string;
  score: number;
  timestampMs?: string;
  digest?: string;
};

export type LeaderboardEntry = {
  solver: string;
  completedCount: number;
  badgeCount: number;
  totalScore: number;
  challengeModeCount: number;
  guidedModeCount: number;
  averageAssistanceLevel: number;
  latestEpoch: string;
  latestTimestampMs?: string;
};

type MutableLeaderboardEntry = LeaderboardEntry & {
  challengeIds: Set<string>;
  badgeTypes: Set<string>;
  assistanceSum: number;
  scoredEvents: number;
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
        mode: String(json.mode ?? "1") === "2" ? "guided" : String(json.mode ?? "1") === "1" ? "challenge" : "unknown",
        assistanceLevel: String(json.assistance_level ?? "0"),
        score: Number(json.score ?? 0),
        timestampMs: event.timestampMs ?? undefined,
        digest: event.id?.txDigest,
      };
      return parsed;
    })
    .filter((event): event is CompletionEvent => Boolean(event));
}

export function aggregateLeaderboard(events: CompletionEvent[], currentAddress?: string) {
  const bySolver = new Map<string, MutableLeaderboardEntry>();

  for (const event of events) {
    const key = event.solver.toLowerCase();
    const entry =
      bySolver.get(key) ??
      ({
        solver: event.solver,
        completedCount: 0,
        badgeCount: 0,
        totalScore: 0,
        challengeModeCount: 0,
        guidedModeCount: 0,
        averageAssistanceLevel: 0,
        latestEpoch: event.epoch,
        latestTimestampMs: event.timestampMs,
        challengeIds: new Set<string>(),
        badgeTypes: new Set<string>(),
        assistanceSum: 0,
        scoredEvents: 0,
      } as MutableLeaderboardEntry);

    const firstCompletionForChallenge = !entry.challengeIds.has(event.challengeId);
    entry.challengeIds.add(event.challengeId);
    if (event.badgeType !== "0") entry.badgeTypes.add(event.badgeType);
    if (firstCompletionForChallenge) {
      entry.totalScore += event.score;
      entry.assistanceSum += Number(event.assistanceLevel);
      entry.scoredEvents += 1;
      if (event.mode === "guided") entry.guidedModeCount += 1;
      if (event.mode === "challenge") entry.challengeModeCount += 1;
    }
    if (BigInt(event.epoch) >= BigInt(entry.latestEpoch)) {
      entry.latestEpoch = event.epoch;
      entry.latestTimestampMs = event.timestampMs;
    }
    bySolver.set(key, entry);
  }

  const entries = Array.from(bySolver.values())
    .map(({ challengeIds, badgeTypes, assistanceSum, scoredEvents, ...entry }) => ({
      ...entry,
      completedCount: challengeIds.size,
      badgeCount: badgeTypes.size,
      averageAssistanceLevel: scoredEvents === 0 ? 0 : Number((assistanceSum / scoredEvents).toFixed(1)),
    }))
    .sort((a, b) => b.totalScore - a.totalScore || b.completedCount - a.completedCount || Number(BigInt(b.latestEpoch) - BigInt(a.latestEpoch)));

  const currentRank = currentAddress
    ? entries.findIndex((entry) => entry.solver.toLowerCase() === currentAddress.toLowerCase()) + 1
    : 0;

  const currentEntry = currentAddress ? entries.find((entry) => entry.solver.toLowerCase() === currentAddress.toLowerCase()) : undefined;

  return {
    entries,
    recent: [...events].slice(0, 10),
    currentRank: currentRank > 0 ? currentRank : undefined,
    currentEntry,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
