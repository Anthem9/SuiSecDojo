import { describe, expect, it } from "vitest";
import { externalLinkProps, isMarkdownPayload, markdownSourceUrl } from "./markdown";

describe("markdown helpers", () => {
  it("should normalize bundled content paths", () => {
    expect(markdownSourceUrl("content/challenges/01-anyone-can-mint/statement.md")).toBe(
      "/content/challenges/01-anyone-can-mint/statement.md",
    );
    expect(markdownSourceUrl("/content/challenges/01-anyone-can-mint/statement.md")).toBe(
      "/content/challenges/01-anyone-can-mint/statement.md",
    );
  });

  it("should secure external markdown links", () => {
    expect(externalLinkProps("https://example.com")).toEqual({ target: "_blank", rel: "noreferrer" });
    expect(externalLinkProps("/docs")).toEqual({});
    expect(externalLinkProps("#section")).toEqual({});
  });

  it("should reject Vite fallback html as markdown", () => {
    expect(isMarkdownPayload("# Title", "text/markdown")).toBe(true);
    expect(isMarkdownPayload("<!doctype html><script type=\"module\" src=\"/@vite/client\"></script>", "text/html")).toBe(false);
    expect(isMarkdownPayload("<html><script type=\"module\" src=\"/src/main.tsx\"></script></html>")).toBe(false);
  });
});
