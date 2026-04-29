import { describe, expect, it } from "vitest";
import { copyMarkdownToClipboard, reportFilename, reportTemplates } from "./reportTemplates";

describe("report templates", () => {
  it("should expose the three Phase 4 templates", () => {
    expect(reportTemplates.map((template) => template.id)).toEqual(["challenge-writeup", "incident-replay", "audit-finding"]);
  });

  it("should produce markdown filenames", () => {
    expect(reportFilename("Challenge Writeup")).toBe("challenge-writeup.md");
  });

  it("should report clipboard denial without throwing", async () => {
    await expect(
      copyMarkdownToClipboard("body", {
        writeText: async () => {
          throw new DOMException("denied", "NotAllowedError");
        },
      }),
    ).resolves.toBe("denied");
  });
});
