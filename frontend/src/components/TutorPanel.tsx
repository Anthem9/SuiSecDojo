import { Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Locale } from "../lib/i18n";
import { assistanceLabels, nextAssistanceLevel, type AssistanceLevel, type TrainingMode } from "../lib/scoring";
import type { ChallengeMetadata } from "../types";

type TutorPanelProps = {
  assistanceLevel: AssistanceLevel;
  challenge: ChallengeMetadata;
  locale: Locale;
  onAssistanceLevelChange: (level: AssistanceLevel) => void;
  scorePreview: number;
  trainingMode: TrainingMode;
};

export function TutorPanel({
  assistanceLevel,
  challenge,
  locale,
  onAssistanceLevelChange,
  scorePreview,
  trainingMode,
}: TutorPanelProps) {
  return (
    <section className="tool-panel" id="tutor">
      <div className="section-heading">
        <Lightbulb aria-hidden="true" />
        <h2>Tutor Mode</h2>
      </div>
      <p className="section-copy">
        Reveal only what you need. Hints reduce score, and the practice answer records zero score. Mode: {trainingMode}; current score preview:{" "}
        {scorePreview}.
      </p>
      <div className="hint-grid">
        {([1, 2, 3, 4] as const).map((level) => (
          <button
            key={level}
            className={assistanceLevel >= level ? "active" : ""}
            type="button"
            onClick={() => onAssistanceLevelChange(nextAssistanceLevel(assistanceLevel, level))}
          >
            {assistanceLabels[level]}
          </button>
        ))}
      </div>
      {assistanceLevel === 0 ? (
        <p className="empty-state">No hints revealed. Try reading the object state and entry signatures first.</p>
      ) : (
        <MarkdownRenderer locale={locale} sourceUrl={`content/tutor/${challenge.slug}.md`} />
      )}
      {assistanceLevel >= 4 ? <p className="status-line warning">Answer viewed: this completion is practice-only and scores 0.</p> : null}
    </section>
  );
}
