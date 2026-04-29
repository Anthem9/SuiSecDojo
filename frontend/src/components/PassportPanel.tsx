import { IdCard } from "lucide-react";
import { summarizePassport } from "../lib/passport";
import type { ProfileSummary } from "../lib/profile";

type PassportPanelProps = {
  profile: ProfileSummary;
};

export function PassportPanel({ profile }: PassportPanelProps) {
  const passport = summarizePassport(profile);

  return (
    <section className="passport-panel" id="passport">
      <div className="section-heading">
        <IdCard aria-hidden="true" />
        <h2>Security Passport</h2>
      </div>
      <div className="certificate-preview">
        <span>TESTNET ONLY</span>
        <h3>{passport.certificateTitle}</h3>
        <p>{passport.holder}</p>
        <dl>
          <div>
            <dt>Network</dt>
            <dd>{passport.network}</dd>
          </div>
          <div>
            <dt>Progress</dt>
            <dd>{passport.completedLabel}</dd>
          </div>
          <div>
            <dt>Badges</dt>
            <dd>{passport.badgeLabel}</dd>
          </div>
          <div>
            <dt>Score</dt>
            <dd>{passport.scoreLabel}</dd>
          </div>
          <div>
            <dt>Next Step</dt>
            <dd>{passport.nextStep}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
