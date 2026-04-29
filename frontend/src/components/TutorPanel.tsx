import { Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useDojo } from "../app/DojoContext";
import type { Locale } from "../lib/i18n";
import { nextAssistanceLevel, type AssistanceLevel, type TrainingMode } from "../lib/scoring";
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
  const { t } = useDojo();

  return (
    <section className="tool-panel" id="tutor">
      <div className="section-heading">
        <Lightbulb aria-hidden="true" />
        <h2>{t.tutor}</h2>
      </div>
      <p className="section-copy">
        {locale === "zh"
          ? `按需要逐级查看提示。提示越多分数越低，查看答案后本题记 0 分。当前模式：${localizedTrainingMode(
              trainingMode,
              locale,
            )}；预计分数：${scorePreview}。`
          : `Reveal only what you need. Hints reduce score, and the practice answer records zero score. Mode: ${localizedTrainingMode(
              trainingMode,
              locale,
            )}; current score preview: ${scorePreview}.`}
      </p>
      <div className="hint-grid">
        {([1, 2, 3, 4] as const).map((level) => (
          <button
            key={level}
            className={assistanceLevel >= level ? "active" : ""}
            type="button"
            onClick={() => onAssistanceLevelChange(nextAssistanceLevel(assistanceLevel, level))}
          >
            {localizedAssistance(level, locale)}
          </button>
        ))}
      </div>
      {assistanceLevel === 0 ? (
        <p className="empty-state">
          {locale === "zh" ? "还没有查看提示。建议先读对象状态、入口函数签名和题目目标。" : "No hints revealed. Try reading the object state and entry signatures first."}
        </p>
      ) : (
        <MarkdownRenderer locale={locale} sourceUrl={`content/tutor/${challenge.slug}.md`} />
      )}
      {assistanceLevel >= 4 ? (
        <p className="status-line warning">
          {locale === "zh" ? "已查看答案：本次仍可完成链上题目，但只作为练习记录，分数为 0。" : "Answer viewed: this completion is practice-only and scores 0."}
        </p>
      ) : null}
    </section>
  );
}

function localizedTrainingMode(mode: TrainingMode, locale: Locale): string {
  if (locale === "zh") return mode === "challenge" ? "挑战模式" : "引导模式";
  return mode === "challenge" ? "Challenge Mode" : "Guided Mode";
}

function localizedAssistance(level: AssistanceLevel, locale: Locale): string {
  if (locale !== "zh") {
    switch (level) {
      case 1:
        return "Concept";
      case 2:
        return "Direction";
      case 3:
        return "Checklist";
      case 4:
        return "Practice Answer";
      case 0:
        return "None";
    }
  }
  switch (level) {
    case 1:
      return "概念提示";
    case 2:
      return "方向提示";
    case 3:
      return "检查清单";
    case 4:
      return "查看答案";
    case 0:
      return "不看提示";
  }
}
