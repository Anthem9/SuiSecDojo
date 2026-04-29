export type IncidentMetadata = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  relatedChallengeIds: string[];
  sourceUrl: string;
};

export const incidents: IncidentMetadata[] = [
  {
    slug: "amm-math-error-replay",
    title: "AMM Math Error Replay",
    summary: "Rounding and reserve update order can break a simplified invariant.",
    category: "DeFi Math",
    relatedChallengeIds: ["6", "10"],
    sourceUrl: "content/replays/amm-math-error-replay/index.md",
  },
  {
    slug: "capability-leak-replay",
    title: "Capability Leak Replay",
    summary: "Capability ownership and lifecycle mistakes can turn admin-only functions into public paths.",
    category: "Capability Pattern",
    relatedChallengeIds: ["4", "5", "13"],
    sourceUrl: "content/replays/capability-leak-replay/index.md",
  },
  {
    slug: "shared-object-pollution-replay",
    title: "Shared Object Pollution Replay",
    summary: "Shared object state requires explicit authorization boundaries and learner isolation.",
    category: "Shared Object",
    relatedChallengeIds: ["2", "12", "17"],
    sourceUrl: "content/replays/shared-object-pollution-replay/index.md",
  },
  {
    slug: "treasury-cap-misuse",
    title: "TreasuryCap Misuse",
    summary: "Mint authority should stay behind a deliberate capability path, not a convenience entry.",
    category: "Object Security",
    relatedChallengeIds: ["1"],
    sourceUrl: "content/replays/treasury-cap-misuse/index.md",
  },
  {
    slug: "package-upgrade-footgun",
    title: "Package Upgrade Footgun",
    summary: "Old entry points and initialization paths can remain reachable after a visible fix.",
    category: "Upgrade Safety",
    relatedChallengeIds: ["5", "8", "19"],
    sourceUrl: "content/replays/package-upgrade-footgun/index.md",
  },
  {
    slug: "ptb-atomicity-bypass",
    title: "PTB Atomicity Bypass",
    summary: "Programmable transaction blocks can invalidate assumptions about call ordering.",
    category: "Programmable Transaction",
    relatedChallengeIds: ["9"],
    sourceUrl: "content/replays/ptb-atomicity-bypass/index.md",
  },
  {
    slug: "oracle-staleness",
    title: "Oracle Staleness",
    summary: "Freshness checks must bind the consumed price to the epoch or timestamp the protocol trusts.",
    category: "Oracle",
    relatedChallengeIds: ["14", "20"],
    sourceUrl: "content/replays/oracle-staleness/index.md",
  },
  {
    slug: "shared-object-authorization-drift",
    title: "Shared Object Authorization Drift",
    summary: "State that starts owner-only can drift into shared access without matching checks.",
    category: "Authorization",
    relatedChallengeIds: ["2", "3", "11", "16"],
    sourceUrl: "content/replays/shared-object-authorization-drift/index.md",
  },
  {
    slug: "coin-accounting-mismatch",
    title: "Coin Accounting Mismatch",
    summary: "Internal credits and actual coin movement must be reconciled on every mutation path.",
    category: "Accounting",
    relatedChallengeIds: ["6", "7", "10", "15", "18"],
    sourceUrl: "content/replays/coin-accounting-mismatch/index.md",
  },
];

export function getIncidentBySlug(slug: string): IncidentMetadata | undefined {
  return incidents.find((incident) => incident.slug === slug);
}
