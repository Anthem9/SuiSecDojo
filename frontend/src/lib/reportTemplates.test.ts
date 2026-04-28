import { describe, expect, it } from "vitest";
import { reportFilename, reportTemplates } from "./reportTemplates";

describe("report templates", () => {
  it("should expose the three Phase 4 templates", () => {
    expect(reportTemplates.map((template) => template.id)).toEqual(["challenge-writeup", "incident-replay", "audit-finding"]);
  });

  it("should produce markdown filenames", () => {
    expect(reportFilename("Challenge Writeup")).toBe("challenge-writeup.md");
  });
});
