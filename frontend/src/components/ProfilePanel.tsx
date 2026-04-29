import { Award, UserRound } from "lucide-react";
import { BadgeCard } from "./BadgeCard";
import { useDojo } from "../app/DojoContext";
import type { ProfileSummary } from "../lib/profile";

type ProfilePanelProps = {
  dojoPassNetworkMessage?: string;
  onMintBadge?: (badgeType: string) => void;
  summary: ProfileSummary;
};

export function ProfilePanel({ dojoPassNetworkMessage, onMintBadge, summary }: ProfilePanelProps) {
  const { locale, t } = useDojo();

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
          <dt>Dojo Pass</dt>
          <dd>{summary.hasDojoPass ? (locale === "zh" ? "已绑定" : "Bound") : locale === "zh" ? "未领取" : "Not minted"}</dd>
        </div>
        <div>
          <dt>{locale === "zh" ? "答案" : "Answers"}</dt>
          <dd>{locale === "zh" ? `已解锁 ${summary.unlockedAnswerCount} 道` : `${summary.unlockedAnswerCount} unlocked`}</dd>
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
      {summary.dojoPassId ? <p className="status-line">{locale === "zh" ? "灵魂绑定 Dojo Pass" : "Soulbound Dojo Pass"}: {summary.dojoPassId}</p> : null}

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
      <div className="badge-section">
        <div className="badge-heading">
          <Award aria-hidden="true" />
          <span>{locale === "zh" ? "徽章铸造" : "Badge Minting"}</span>
        </div>
        {dojoPassNetworkMessage ? <p className="empty-state">{dojoPassNetworkMessage}</p> : null}
        <div className="badge-list">
          {["1", "2", "3", "4", "5"].map((badgeType) => {
            const minted = summary.mintedBadgeIds.includes(badgeType);
            return (
              <article className="badge-card" key={badgeType}>
                <strong>{formatBadgeName(badgeType, locale)}</strong>
                <small>{formatBadgeRequirement(badgeType, locale)}</small>
                <button
                  type="button"
                  disabled={!summary.hasDojoPass || minted || !onMintBadge || Boolean(dojoPassNetworkMessage)}
                  onClick={() => onMintBadge?.(badgeType)}
                >
                  {minted ? (locale === "zh" ? "已铸造" : "Minted") : locale === "zh" ? "铸造徽章" : "Mint Badge"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function formatBadgeName(badgeType: string, locale: "en" | "zh") {
  if (locale === "zh") {
    switch (badgeType) {
      case "1":
        return "对象安全入门";
      case "2":
        return "共享对象入门";
      case "3":
        return "授权与 Capability 入门";
      case "4":
        return "DeFi 逻辑入门";
      case "5":
        return "安全事件复盘入门";
    }
  }
  switch (badgeType) {
    case "1":
      return "Object Security Beginner";
    case "2":
      return "Shared Object Beginner";
    case "3":
      return "Authorization & Capability Beginner";
    case "4":
      return "DeFi Logic Beginner";
    case "5":
      return "Incident Replay Beginner";
    default:
      return `Badge ${badgeType}`;
  }
}

function formatBadgeRequirement(badgeType: string, locale: "en" | "zh") {
  if (locale === "zh") {
    switch (badgeType) {
      case "1":
        return "完成 Challenge 01。";
      case "2":
        return "完成 Challenge 02。";
      case "3":
        return "完成 Challenge 03、04 或 05。";
      case "4":
        return "完成 Challenge 06 和 10。";
      case "5":
        return "预留给安全事件复盘学习。";
    }
  }
  switch (badgeType) {
    case "1":
      return "Complete Challenge 01.";
    case "2":
      return "Complete Challenge 02.";
    case "3":
      return "Complete Challenge 03, 04, or 05.";
    case "4":
      return "Complete Challenge 06 and 10.";
    case "5":
      return "Reserved for incident replay learning.";
    default:
      return "Complete the related learning path.";
  }
}
