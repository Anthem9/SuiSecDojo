import { describe, expect, it } from "vitest";
import { aggregateLeaderboard, parseCompletionEvents } from "./leaderboard";

describe("leaderboard helpers", () => {
  it("should parse Sui completion events", () => {
    expect(
      parseCompletionEvents([
        {
          id: { txDigest: "abc" },
          timestampMs: "100",
          parsedJson: { challenge_id: "1", solver: "0xabc", epoch: "9", badge_type: "1" },
        },
      ]),
    ).toEqual([{ challengeId: "1", solver: "0xabc", epoch: "9", badgeType: "1", timestampMs: "100", digest: "abc" }]);
  });

  it("should aggregate by learner and rank current wallet", () => {
    const board = aggregateLeaderboard(
      [
        { challengeId: "1", solver: "0xaaa", epoch: "2", badgeType: "1" },
        { challengeId: "2", solver: "0xaaa", epoch: "3", badgeType: "2" },
        { challengeId: "1", solver: "0xbbb", epoch: "4", badgeType: "1" },
      ],
      "0xbbb",
    );

    expect(board.entries[0]).toMatchObject({ solver: "0xaaa", completedCount: 2, badgeCount: 2 });
    expect(board.currentRank).toBe(2);
  });
});

