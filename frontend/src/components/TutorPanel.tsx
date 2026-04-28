import { Lightbulb } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Locale } from "../lib/i18n";
import type { ChallengeMetadata } from "../types";

type TutorPanelProps = {
  challenge: ChallengeMetadata;
  locale: Locale;
};

export function TutorPanel({ challenge, locale }: TutorPanelProps) {
  return (
    <section className="tool-panel" id="tutor">
      <div className="section-heading">
        <Lightbulb aria-hidden="true" />
        <h2>Tutor Mode</h2>
      </div>
      <p className="section-copy">Static hints only. The tutor explains concepts and review direction without giving a full exploit.</p>
      <MarkdownRenderer locale={locale} sourceUrl={`content/tutor/${challenge.slug}.md`} />
    </section>
  );
}

