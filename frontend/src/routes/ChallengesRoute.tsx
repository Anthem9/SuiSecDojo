import { BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { challenges } from "../data/challenges";
import { filterChallenges } from "../lib/challengeFilters";
import type { ChallengeDifficulty } from "../types";

export function ChallengesRoute() {
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const visibleChallenges = useMemo(() => filterChallenges(challenges, { difficulty }), [difficulty]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <BookOpen aria-hidden="true" />
        <h1>Challenge Arena</h1>
      </div>
      <p className="section-copy">
        Live challenges are connected to Sui testnet. Coming-soon cards are roadmap placeholders and cannot be claimed until their
        Move modules, tests, frontend adapters, and deployments are complete.
      </p>
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
            <em>{challenge.status === "coming-soon" ? "Coming soon" : "Live on testnet"}</em>
          </Link>
        ))}
      </div>
    </section>
  );
}
