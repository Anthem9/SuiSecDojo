import { describe, expect, it } from "vitest";
import { challenges } from "../data/challenges";
import { summarizeProfile } from "./profile";

describe("profile summary", () => {
  it("should summarize the disconnected empty state", () => {
    const summary = summarizeProfile({
      network: "testnet",
      challenges,
      chainState: {},
      badges: [],
    });

    expect(summary.walletLabel).toBe("Wallet not connected");
    expect(summary.claimed).toBe(0);
    expect(summary.completed).toBe(0);
    expect(summary.badgeCount).toBe(0);
    expect(summary.totalScore).toBe(0);
    expect(summary.nextChallenge?.id).toBe("1");
  });

  it("should summarize progress and ignore unknown completed ids in totals", () => {
    const summary = summarizeProfile({
      accountAddress: "0xda68b5b7583cf1515ad207e1ce1b5d5a630a9c5832023cf2381936743b3dd0a7",
      network: "testnet",
      challenges,
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: ["1", "999"],
          completedChallengeIds: ["1", "999"],
          badgeIds: ["1"],
        },
      },
      badges: [],
    });

    expect(summary.walletLabel).toBe("0xda68...d0a7");
    expect(summary.claimed).toBe(1);
    expect(summary.completed).toBe(1);
    expect(summary.percent).toBe(7);
    expect(summary.badgeLabels).toEqual(["Object Security Beginner"]);
    expect(summary.badgeDetails[0]).toMatchObject({
      badgeType: "1",
      requirement: "Complete Challenge 01.",
    });
  });

  it("should include score and completion mode stats from leaderboard events", () => {
    const summary = summarizeProfile({
      network: "testnet",
      challenges,
      chainState: {},
      badges: [],
      leaderboardEntry: {
        solver: "0xalice",
        completedCount: 2,
        badgeCount: 1,
        totalScore: 154,
        challengeModeCount: 1,
        guidedModeCount: 1,
        averageAssistanceLevel: 0.5,
        latestEpoch: "10",
      },
    });

    expect(summary.totalScore).toBe(154);
    expect(summary.challengeModeCompletions).toBe(1);
    expect(summary.guidedModeCompletions).toBe(1);
    expect(summary.averageAssistanceLevel).toBe(0.5);
  });

  it("should merge badge ids from progress and owned badge objects", () => {
    const summary = summarizeProfile({
      network: "testnet",
      challenges,
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: [],
          completedChallengeIds: [],
          badgeIds: ["1"],
        },
      },
      badges: [{ objectId: "0xbadge", owner: "0xalice", badgeType: "3", issuedAtEpoch: "42" }],
    });

    expect(summary.badgeCount).toBe(2);
    expect(summary.badgeLabels).toEqual(["Object Security Beginner", "Authorization & Capability Beginner"]);
    expect(summary.badgeDetails[1]).toMatchObject({
      objectId: "0xbadge",
      issuedAtEpoch: "42",
      requirement: "Complete Challenge 03, Challenge 04, or Challenge 05.",
    });
  });

  it("should label DeFi and incident replay badge types", () => {
    const summary = summarizeProfile({
      network: "testnet",
      challenges,
      chainState: {
        progress: {
          objectId: "0xprogress",
          claimedChallengeIds: [],
          completedChallengeIds: [],
          badgeIds: ["4", "5"],
        },
      },
      badges: [],
    });

    expect(summary.badgeLabels).toEqual(["DeFi Logic Beginner", "Incident Replay Beginner"]);
  });
});
