import { Award, UserRound } from "lucide-react";
import { BadgeCard } from "./BadgeCard";
import type { ProfileSummary } from "../lib/profile";

type ProfilePanelProps = {
  summary: ProfileSummary;
};

export function ProfilePanel({ summary }: ProfilePanelProps) {
  return (
    <section className="profile-panel" id="profile">
      <div className="section-heading">
        <UserRound aria-hidden="true" />
        <h2>Profile</h2>
      </div>

      <dl className="profile-grid">
        <div>
          <dt>Wallet</dt>
          <dd>{summary.walletLabel}</dd>
        </div>
        <div>
          <dt>Network</dt>
          <dd>{summary.network}</dd>
        </div>
        <div>
          <dt>Claimed</dt>
          <dd>
            {summary.claimed}/{summary.total}
          </dd>
        </div>
        <div>
          <dt>Completed</dt>
          <dd>
            {summary.completed}/{summary.total} ({summary.percent}%)
          </dd>
        </div>
        <div>
          <dt>Next</dt>
          <dd>{summary.nextChallenge?.title ?? "All available challenges completed"}</dd>
        </div>
      </dl>

      <div className="badge-section">
        <div className="badge-heading">
          <Award aria-hidden="true" />
          <span>Badges</span>
        </div>
        {summary.badgeLabels.length > 0 ? (
          <div className="badge-list">
            {summary.badgeDetails.map((badge) => (
              <BadgeCard
                key={badge.badgeType}
                badgeType={badge.badgeType}
                issuedAtEpoch={badge.issuedAtEpoch}
                label={badge.label}
                objectId={badge.objectId}
                requirement={badge.requirement}
              />
            ))}
          </div>
        ) : (
          <p className="empty-state">No badges yet.</p>
        )}
      </div>
    </section>
  );
}
