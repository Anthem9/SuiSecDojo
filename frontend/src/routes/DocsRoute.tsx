import { FileText } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { challenges } from "../data/challenges";
import { incidents } from "../data/incidents";
import { useDojo } from "../app/DojoContext";

export function DocsRoute() {
  const { locale, t } = useDojo();
  const [selectedDocUrl, setSelectedDocUrl] = useState("content/challenges/01-anyone-can-mint/statement.md");

  return (
    <section className="docs-hub page-section">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <h1>{t.docs}</h1>
      </div>
      <p className="safety-notice">
        本平台仅用于安全教育、审计训练和防御研究。所有漏洞案例均为最小化模拟版本，禁止用于攻击真实协议、真实资产或未授权系统。
      </p>
      <div className="docs-layout">
        <div className="docs-nav">
          <h3>Challenge Statements</h3>
          {challenges.map((challenge) => (
            <button key={challenge.id} type="button" onClick={() => setSelectedDocUrl(challenge.sourceUrl ?? selectedDocUrl)}>
              {challenge.id}. {challenge.title}
            </button>
          ))}
          <h3>Incident Replays</h3>
          {incidents.map((incident) => (
            <button key={incident.sourceUrl} type="button" onClick={() => setSelectedDocUrl(incident.sourceUrl)}>
              {incident.title}
            </button>
          ))}
        </div>
        <div className="docs-reader">
          <MarkdownRenderer locale={locale} sourceUrl={selectedDocUrl} />
        </div>
      </div>
    </section>
  );
}
