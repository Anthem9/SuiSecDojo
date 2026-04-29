import { describe, expect, it } from "vitest";
import { getIncidentBySlug, incidents } from "./incidents";

describe("incident metadata", () => {
  it("should include the expanded incident library", () => {
    expect(incidents).toHaveLength(9);
    expect(getIncidentBySlug("oracle-staleness")?.relatedChallengeIds).toContain("14");
  });

  it("should keep every incident backed by content", () => {
    expect(incidents.every((incident) => incident.sourceUrl.startsWith("content/replays/"))).toBe(true);
    expect(incidents.every((incident) => incident.sourceUrl.endsWith("/index.md"))).toBe(true);
  });
});
