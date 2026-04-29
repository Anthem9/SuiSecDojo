import { BookOpen, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useDojo } from "../app/DojoContext";
import { ProgressPanel } from "../components/ProgressPanel";

const safetyNotice =
  "本平台仅用于安全教育、审计训练和防御研究。所有漏洞案例均为最小化模拟版本，禁止用于攻击真实协议、真实资产或未授权系统。";

export function HomeRoute() {
  const { account, progress, t } = useDojo();

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Sui Move Security Training Ground</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroCopy}</p>
          <p className="safety-notice">{safetyNotice}</p>
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
          <strong>Challenge Mode</strong>
          <span>Read the statement first, construct CLI/PTB calls, and use guided buttons only when needed.</span>
        </Link>
        <Link className="feature-link" to="/incidents">
          <Trophy aria-hidden="true" />
          <strong>Incident Library</strong>
          <span>Study abstract Sui and Move security patterns connected to the dojo challenges.</span>
        </Link>
      </section>
    </>
  );
}
