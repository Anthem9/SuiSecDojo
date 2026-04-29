import { IdCard } from "lucide-react";
import { useDojo } from "../app/DojoContext";
import { summarizePassport } from "../lib/passport";
import type { ProfileSummary } from "../lib/profile";

type PassportPanelProps = {
  profile: ProfileSummary;
};

export function PassportPanel({ profile }: PassportPanelProps) {
  const { t } = useDojo();
  const passport = summarizePassport(profile);

  return (
    <section className="passport-panel" id="passport">
      <div className="section-heading">
        <IdCard aria-hidden="true" />
        <h2>{t.passport}</h2>
      </div>
      <div className="certificate-preview">
        <span>{t.testnetOnly}</span>
        <h3>{passport.certificateTitle}</h3>
        <p>{passport.holder}</p>
        <dl>
          <div>
            <dt>{t.network}</dt>
            <dd>{passport.network}</dd>
          </div>
          <div>
            <dt>{t.progress}</dt>
            <dd>{passport.completedLabel}</dd>
          </div>
          <div>
            <dt>{t.badges}</dt>
            <dd>{passport.badgeLabel}</dd>
          </div>
          <div>
            <dt>{t.score}</dt>
            <dd>{passport.scoreLabel}</dd>
          </div>
          <div>
            <dt>{t.nextStep}</dt>
            <dd>{passport.nextStep}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
