import { describe, expect, it } from "vitest";
import { aggregateLeaderboard, parseCompletionEvents } from "./leaderboard";

describe("leaderboard helpers", () => {
  it("should parse Sui completion events", () => {
    expect(
      parseCompletionEvents([
        {
          id: { txDigest: "abc" },
          timestampMs: "100",
          parsedJson: { challenge_id: "1", solver: "0xabc", epoch: "9", badge_type: "1", mode: "1", assistance_level: "2", score: "75" },
        },
      ]),
    ).toEqual([
      {
        challengeId: "1",
        solver: "0xabc",
        epoch: "9",
        badgeType: "1",
        mode: "challenge",
        assistanceLevel: "2",
        score: 75,
        timestampMs: "100",
        digest: "abc",
      },
    ]);
  });

  it("should aggregate by learner and rank current wallet", () => {
    const board = aggregateLeaderboard(
      [
        { challengeId: "1", solver: "0xaaa", epoch: "2", badgeType: "1", mode: "challenge", assistanceLevel: "0", score: 100 },
        { challengeId: "2", solver: "0xaaa", epoch: "3", badgeType: "2", mode: "guided", assistanceLevel: "1", score: 54 },
        { challengeId: "1", solver: "0xbbb", epoch: "4", badgeType: "1", mode: "challenge", assistanceLevel: "0", score: 100 },
      ],
      "0xbbb",
    );

    expect(board.entries[0]).toMatchObject({ solver: "0xaaa", completedCount: 2, badgeCount: 2, totalScore: 154 });
    expect(board.entries[0].guidedModeCount).toBe(1);
    expect(board.currentRank).toBe(2);
  });

  it("should include the current wallet in recent completions even when outside the first page slice", () => {
    const events = Array.from({ length: 12 }, (_, index) => ({
      challengeId: String(index + 1),
      solver: `0x${index}`,
      epoch: String(100 + index),
      badgeType: "0",
      mode: "challenge" as const,
      assistanceLevel: "0",
      score: 100,
    }));
    events.push({
      challengeId: "1",
      solver: "0xcurrent",
      epoch: "90",
      badgeType: "1",
      mode: "challenge",
      assistanceLevel: "4",
      score: 0,
    });

    const board = aggregateLeaderboard(events, "0xcurrent");

    expect(board.currentEntry).toMatchObject({ solver: "0xcurrent", totalScore: 0, completedCount: 1 });
    expect(board.recent.some((event) => event.solver === "0xcurrent" && event.score === 0)).toBe(true);
  });
});
