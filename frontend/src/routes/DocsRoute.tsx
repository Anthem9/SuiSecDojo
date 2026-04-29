import { FileText } from "lucide-react";
import { useState } from "react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { challenges } from "../data/challenges";
import { incidents } from "../data/incidents";
import { useDojo } from "../app/DojoContext";
import { challengeTitle } from "../lib/challengeText";

export function DocsRoute() {
  const { locale, t } = useDojo();
  const [selectedDocUrl, setSelectedDocUrl] = useState("content/challenges/01-anyone-can-mint/statement.md");

  return (
    <section className="docs-hub page-section">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <h1>{t.docs}</h1>
      </div>
      <p className="safety-notice">{t.safetyNotice}</p>
      <div className="docs-layout">
        <div className="docs-nav">
          <h3>{locale === "zh" ? "挑战题面" : "Challenge Statements"}</h3>
          {challenges.map((challenge) => (
            <button key={challenge.id} type="button" onClick={() => setSelectedDocUrl(challenge.sourceUrl ?? selectedDocUrl)}>
              {challenge.id}. {challengeTitle(challenge, locale)}
            </button>
          ))}
          <h3>{locale === "zh" ? "安全事件时间轴" : "Incident Timeline"}</h3>
          {incidents.map((incident) => (
            <button key={incident.sourceUrl} type="button" onClick={() => setSelectedDocUrl(incident.sourceUrl)}>
              {locale === "zh" ? incident.titleZh ?? incident.title : incident.title}
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
