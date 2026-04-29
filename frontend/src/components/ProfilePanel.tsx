import { Award, UserRound } from "lucide-react";
import { BadgeCard } from "./BadgeCard";
import { useDojo } from "../app/DojoContext";
import type { ProfileSummary } from "../lib/profile";

type ProfilePanelProps = {
  summary: ProfileSummary;
};

export function ProfilePanel({ summary }: ProfilePanelProps) {
  const { t } = useDojo();

  return (
    <section className="profile-panel" id="profile">
      <div className="section-heading">
        <UserRound aria-hidden="true" />
        <h2>{t.profile}</h2>
      </div>

      <dl className="profile-grid">
        <div>
          <dt>{t.wallet}</dt>
          <dd>{summary.walletLabel}</dd>
        </div>
        <div>
          <dt>{t.network}</dt>
          <dd>{summary.network}</dd>
        </div>
        <div>
          <dt>{t.claimed}</dt>
          <dd>
            {summary.claimed}/{summary.total}
          </dd>
        </div>
        <div>
          <dt>{t.completed}</dt>
          <dd>
            {summary.completed}/{summary.total} ({summary.percent}%)
          </dd>
        </div>
        <div>
          <dt>{t.score}</dt>
          <dd>{summary.totalScore}</dd>
        </div>
        <div>
          <dt>{t.modeSplit}</dt>
          <dd>
            {summary.challengeModeCompletions} challenge / {summary.guidedModeCompletions} guided
          </dd>
        </div>
        <div>
          <dt>{t.avgAssistance}</dt>
          <dd>{summary.averageAssistanceLevel}</dd>
        </div>
        <div>
          <dt>{t.next}</dt>
          <dd>{summary.nextChallenge?.title ?? t.allChallengesCompleted}</dd>
        </div>
      </dl>

      <div className="badge-section">
        <div className="badge-heading">
          <Award aria-hidden="true" />
          <span>{t.badges}</span>
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
          <p className="empty-state">{t.noBadges}</p>
        )}
      </div>
    </section>
  );
}
