import { BookOpen, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useDojo } from "../app/DojoContext";
import { ProgressPanel } from "../components/ProgressPanel";

export function HomeRoute() {
  const { account, progress, t } = useDojo();

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroCopy}</p>
          <p className="safety-notice">{t.safetyNotice}</p>
          <div className="hero-actions">
            <Link to="/challenges">{t.startLearning}</Link>
            <Link className="secondary" to="/profile">
              {t.viewProgress}
            </Link>
          </div>
        </div>
        <ProgressPanel accountAddress={account?.address} progress={progress} />
      </section>
      <section className="home-grid">
        <Link className="feature-link" to="/challenges">
          <BookOpen aria-hidden="true" />
          <strong>{t.challengeModeTitle}</strong>
          <span>{t.challengeModeCopy}</span>
        </Link>
        <Link className="feature-link" to="/incidents">
          <Trophy aria-hidden="true" />
          <strong>{t.incidentLibraryTitle}</strong>
          <span>{t.incidentLibraryCopy}</span>
        </Link>
      </section>
    </>
  );
}
