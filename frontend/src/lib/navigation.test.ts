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
      "https://faucet.sui.io/",
      "/about",
    ]);
  });

  it("should link to the official Sui faucet as an external route", () => {
    expect(navItems.find((item) => item.id === "faucet")).toMatchObject({
      external: true,
      path: "https://faucet.sui.io/",
    });
  });
});
