import { describe, expect, it } from "vitest";
import { baseScoreForDifficulty, calculateScore, nextAssistanceLevel } from "./scoring";

describe("scoring helpers", () => {
  it("should map difficulty to base score", () => {
    expect(baseScoreForDifficulty("beginner")).toBe(100);
    expect(baseScoreForDifficulty("easy")).toBe(150);
    expect(baseScoreForDifficulty("medium")).toBe(250);
    expect(baseScoreForDifficulty("hard")).toBe(400);
  });

  it("should calculate mode and assistance penalties", () => {
    expect(calculateScore(100, "challenge", 0)).toBe(100);
    expect(calculateScore(150, "guided", 0)).toBe(60);
    expect(calculateScore(200, "challenge", 2)).toBe(150);
    expect(calculateScore(200, "challenge", 4)).toBe(0);
  });

  it("should keep the highest revealed assistance level", () => {
    expect(nextAssistanceLevel(1, 3)).toBe(3);
    expect(nextAssistanceLevel(3, 1)).toBe(3);
  });
});
