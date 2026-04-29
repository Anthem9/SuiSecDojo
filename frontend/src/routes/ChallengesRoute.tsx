import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { challenges } from "../data/challenges";
import { useDojo } from "../app/DojoContext";
import { filterChallenges } from "../lib/challengeFilters";
import type { ChallengeDifficulty } from "../types";

export function ChallengesRoute() {
  const { t } = useDojo();
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const visibleChallenges = useMemo(() => filterChallenges(challenges, { difficulty }), [difficulty]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <BookOpen aria-hidden="true" />
        <h1>{t.challengeArena}</h1>
      </div>
      <p className="section-copy">{t.challengeArenaCopy}</p>
      <div className="filters" aria-label="Difficulty filters">
        {(["all", "beginner", "easy", "medium", "hard"] as const).map((item) => (
          <button key={item} className={difficulty === item ? "active" : ""} type="button" onClick={() => setDifficulty(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="challenge-grid">
        {visibleChallenges.map((challenge) => (
          <Link key={challenge.id} className="challenge-card" to={`/challenges/${challenge.slug}`}>
            <span>{challenge.difficulty}</span>
            <strong>
              {challenge.id}. {challenge.title}
            </strong>
            <small>{challenge.category}</small>
            <p>{challenge.description}</p>
            <em>{challenge.status === "coming-soon" ? t.comingSoon : t.liveOnTestnet}</em>
          </Link>
        ))}
      </div>
    </section>
  );
}
