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
    expect(summary.percent).toBe(Math.round((1 / challenges.length) * 100));
    expect(summary.badgeLabels).toEqual(["Object Security Beginner"]);
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
    expect(summary.badgeLabels).toEqual(["Object Security Beginner", "Capability Pattern Beginner"]);
  });
});

