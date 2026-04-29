import { describe, expect, it } from "vitest";
import { challenges } from "../data/challenges";
import { filterChallenges, getChallengeBySlug } from "./challengeFilters";

describe("challenge filters", () => {
  it("should filter challenges by difficulty", () => {
    const result = filterChallenges(challenges, { difficulty: "beginner" });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("anyone-can-mint");
  });

  it("should filter challenges by query across title description and tags", () => {
    expect(filterChallenges(challenges, { query: "vault" }).map((item) => item.slug)).toEqual(["shared-vault"]);
    expect(filterChallenges(challenges, { query: "TreasuryCap" }).map((item) => item.slug)).toEqual([
      "anyone-can-mint",
    ]);
  });

  it("should return a challenge by slug", () => {
    expect(getChallengeBySlug(challenges, "fake-owner")?.title).toBe("Fake Owner");
  });

  it("should mark the expanded challenge set as live", () => {
    expect(getChallengeBySlug(challenges, "signer-confusion")?.status).toBe("live");
    expect(getChallengeBySlug(challenges, "liquidation-edge-case")?.status).toBe("live");
    expect(getChallengeBySlug(challenges, "object-transfer-trap")?.status).toBe("live");
    expect(getChallengeBySlug(challenges, "anyone-can-mint")?.status).toBe("live");
  });
});
