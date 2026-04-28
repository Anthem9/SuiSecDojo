import { describe, expect, it } from "vitest";
import { localizedContentCandidates } from "./i18n";

describe("i18n helpers", () => {
  it("should prefer localized content and fall back to bundled content", () => {
    expect(localizedContentCandidates("content/challenges/01-anyone-can-mint/statement.md", "zh")).toEqual([
      "/content/zh/challenges/01-anyone-can-mint/statement.md",
      "/content/challenges/01-anyone-can-mint/statement.md",
    ]);
  });
});

