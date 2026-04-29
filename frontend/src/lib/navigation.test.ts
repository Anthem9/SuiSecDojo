import { describe, expect, it } from "vitest";
import { navItems } from "./navigation";

describe("navigation", () => {
  it("should expose stable top-level routes", () => {
    expect(navItems.map((item) => item.path)).toEqual([
      "/",
      "/challenges",
      "/incidents",
      "/docs",
      "/leaderboard",
      "/profile",
      "/about",
    ]);
  });
});
