import { BookOpen, CheckCircle2, Shield, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { challenges } from "./data/challenges";
import { filterChallenges } from "./lib/challengeFilters";
import { summarizeProgress } from "./lib/progress";
import type { ChallengeDifficulty, ChallengeProgress } from "./types";

const demoProgress: ChallengeProgress = {
  completedChallengeIds: ["1"],
  badgeIds: ["object-security-beginner"],
};

export function App() {
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [selectedSlug, setSelectedSlug] = useState(challenges[0]?.slug ?? "");
  const visibleChallenges = useMemo(() => filterChallenges(challenges, { difficulty }), [difficulty]);
  const selectedChallenge = challenges.find((challenge) => challenge.slug === selectedSlug) ?? challenges[0];
  const progress = summarizeProgress(challenges, demoProgress);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Shield aria-hidden="true" />
          <span>SuiSec Dojo</span>
        </div>
        <button className="wallet-button" type="button">
          <Wallet aria-hidden="true" />
          Connect Wallet
        </button>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Sui Move Security Training Ground</p>
          <h1>由 Walrus 驱动的 Sui Move 安全训练场</h1>
          <p className="hero-copy">
            浏览挑战、领取链上实例、通过 Sui 交易完成判题，并把学习进度写入链上对象。
          </p>
          <div className="hero-actions">
            <a href="#challenges">Start Learning</a>
            <a className="secondary" href="#profile">View Progress</a>
          </div>
        </div>

        <aside className="progress-panel" id="profile">
          <div className="panel-icon">
            <CheckCircle2 aria-hidden="true" />
          </div>
          <p className="panel-label">Current Progress</p>
          <strong>
            {progress.completed}/{progress.total}
          </strong>
          <span>{progress.percent}% completed</span>
          <small>Next: {progress.nextChallenge?.title ?? "All challenges completed"}</small>
        </aside>
      </section>

      <section className="workspace" id="challenges">
        <div className="challenge-list">
          <div className="section-heading">
            <BookOpen aria-hidden="true" />
            <h2>Challenge Arena</h2>
          </div>
          <div className="filters" aria-label="Difficulty filters">
            {(["all", "beginner", "easy", "medium", "hard"] as const).map((item) => (
              <button
                key={item}
                className={difficulty === item ? "active" : ""}
                type="button"
                onClick={() => setDifficulty(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="cards">
            {visibleChallenges.map((challenge) => (
              <button
                key={challenge.id}
                className={challenge.slug === selectedChallenge.slug ? "challenge-card selected" : "challenge-card"}
                type="button"
                onClick={() => setSelectedSlug(challenge.slug)}
              >
                <span>{challenge.difficulty}</span>
                <strong>{challenge.title}</strong>
                <small>{challenge.category}</small>
              </button>
            ))}
          </div>
        </div>

        <article className="detail-panel">
          <span className="difficulty">{selectedChallenge.difficulty}</span>
          <h2>{selectedChallenge.title}</h2>
          <p>{selectedChallenge.description}</p>
          <dl>
            <div>
              <dt>Module</dt>
              <dd>{selectedChallenge.moduleName ?? "pending deployment"}</dd>
            </div>
            <div>
              <dt>Walrus Content</dt>
              <dd>{selectedChallenge.sourceUrl ?? "pending upload"}</dd>
            </div>
          </dl>
          <div className="tag-row">
            {selectedChallenge.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="detail-actions">
            <button type="button">Claim Instance</button>
            <button type="button">Solve Challenge</button>
          </div>
        </article>
      </section>
    </main>
  );
}

