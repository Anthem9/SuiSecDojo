import { describe, expect, it } from "vitest";
import { getIncidentBySlug, incidents } from "./incidents";

describe("incident metadata", () => {
  it("should include the expanded incident library", () => {
    expect(incidents).toHaveLength(6);
    expect(getIncidentBySlug("cetus-clmm-exploit-2025")?.relatedChallengeIds).toContain("10");
    expect(getIncidentBySlug("amm-math-error-replay")?.slug).toBe("cetus-clmm-exploit-2025");
    expect(getIncidentBySlug("dango-perps-insurance-fund-2026")).toBeUndefined();
    expect(getIncidentBySlug("nemo-protocol-usdc-exploit-2025")?.affectedProtocol).toBe("Nemo Protocol");
    expect(getIncidentBySlug("typus-prep-vault-exploit-2025")?.affectedProtocol).toContain("Typus");
  });

  it("should keep every incident backed by content", () => {
    expect(incidents.every((incident) => incident.sourceUrl.startsWith("content/incidents/"))).toBe(true);
    expect(incidents.every((incident) => incident.sourceUrl.endsWith("/index.md"))).toBe(true);
  });

  it("should expose timeline fields and references", () => {
    expect(incidents.every((incident) => /^\d{4}-\d{2}-\d{2}$/.test(incident.date))).toBe(true);
    expect(incidents.every((incident) => incident.affectedProtocol.length > 0)).toBe(true);
    expect(incidents.every((incident) => incident.references.length > 0)).toBe(true);
  });
});
