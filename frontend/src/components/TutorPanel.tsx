import { Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useDojo } from "../app/DojoContext";
import { DOJO_PASS } from "../lib/constants";
import { hasUnlockedAnswer, mistPriceLabel } from "../lib/dojoPass";
import type { Locale } from "../lib/i18n";
import { nextAssistanceLevel, type AssistanceLevel, type TrainingMode } from "../lib/scoring";
import type { DojoPassObject } from "../lib/chainState";
import type { ChallengeMetadata } from "../types";

type TutorPanelProps = {
  assistanceLevel: AssistanceLevel;
  challenge: ChallengeMetadata;
  dojoPass?: DojoPassObject;
  dojoPassNetworkMessage?: string;
  locale: Locale;
  onAssistanceLevelChange: (level: AssistanceLevel) => void;
  onMintDojoPass: () => void;
  onUnlockAnswer: () => void;
  scorePreview: number;
  trainingMode: TrainingMode;
};

export function TutorPanel({
  assistanceLevel,
  challenge,
  dojoPass,
  dojoPassNetworkMessage,
  locale,
  onAssistanceLevelChange,
  onMintDojoPass,
  onUnlockAnswer,
  scorePreview,
  trainingMode,
}: TutorPanelProps) {
  const { t } = useDojo();
  const answerUnlocked = hasUnlockedAnswer(dojoPass?.unlockedChallengeIds, challenge.id);
  const passConfigured = Boolean(DOJO_PASS.PACKAGE_ID && DOJO_PASS.CONFIG_ID);

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
      <div className="answer-unlock-panel">
        <h3>{locale === "zh" ? "答案解锁" : "Answer Unlock"}</h3>
        {!dojoPass ? (
          <>
            <p className="section-copy">
              {locale === "zh"
                ? "先领取灵魂绑定 Dojo Pass。它会记录你已经解锁的题目答案，后续也可扩展会员权益。"
                : "Mint your soulbound Dojo Pass first. It records unlocked answers and can support membership features later."}
            </p>
            {dojoPassNetworkMessage ? <p className="empty-state">{dojoPassNetworkMessage}</p> : null}
            <button type="button" disabled={!passConfigured || Boolean(dojoPassNetworkMessage)} onClick={onMintDojoPass}>
              {locale === "zh" ? "领取 Dojo Pass" : "Mint Dojo Pass"}
            </button>
          </>
        ) : answerUnlocked ? (
          <>
            <p className="status-line">
              {locale === "zh" ? "此题答案已记录在你的 Dojo Pass 中。" : "This answer is recorded in your Dojo Pass."}
            </p>
            <p className="empty-state">
              {locale === "zh"
                ? "Seal 加密答案接入后，这里会显示解密后的答案内容。"
                : "After Seal encrypted answers are connected, the decrypted answer will render here."}
            </p>
          </>
        ) : (
          <>
            <p className="section-copy">
              {locale === "zh"
                ? `解锁后会写入你的 Dojo Pass。价格：${mistPriceLabel(DOJO_PASS.ANSWER_PRICE_MIST)}。`
                : `Unlocking records this challenge in your Dojo Pass. Price: ${mistPriceLabel(DOJO_PASS.ANSWER_PRICE_MIST)}.`}
            </p>
            {dojoPassNetworkMessage ? <p className="empty-state">{dojoPassNetworkMessage}</p> : null}
            <button type="button" disabled={!passConfigured || Boolean(dojoPassNetworkMessage)} onClick={onUnlockAnswer}>
              {locale === "zh" ? "解锁答案" : "Unlock Answer"}
            </button>
          </>
        )}
      </div>
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
