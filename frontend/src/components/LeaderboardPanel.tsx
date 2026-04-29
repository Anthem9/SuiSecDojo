import { Trophy } from "lucide-react";
import { useDojo } from "../app/DojoContext";
import type { CompletionEvent, LeaderboardEntry } from "../lib/leaderboard";

type LeaderboardPanelProps = {
  entries: LeaderboardEntry[];
  recent: CompletionEvent[];
  currentRank?: number;
  isLoading: boolean;
  error?: Error | null;
};

export function LeaderboardPanel({ currentRank, entries, error, isLoading, recent }: LeaderboardPanelProps) {
  const { t } = useDojo();

  return (
    <section className="leaderboard-panel" id="leaderboard">
      <div className="section-heading">
        <Trophy aria-hidden="true" />
        <h2>{t.leaderboard}</h2>
      </div>
      <p className="section-copy">{t.leaderboardCopy}</p>
      {currentRank ? (
        <p className="status-line">
          {t.currentWalletRank}: #{currentRank}
        </p>
      ) : null}
      {isLoading ? <p className="empty-state">{t.loadingEvents}</p> : null}
      {error ? <p className="status-line error">{error.message}</p> : null}
      <div className="leaderboard-grid">
        <div>
          <h3>{t.topLearners}</h3>
          {entries.length > 0 ? (
            <ol className="leaderboard-list">
              {entries.slice(0, 10).map((entry) => (
                <li key={entry.solver}>
                  <strong>{shortAddress(entry.solver)}</strong>
                  <span>{entry.totalScore} pts</span>
                  <small>
                    {entry.completedCount} {t.solved} / {entry.badgeCount} {t.badges}
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">{t.noCompletionEvents}</p>
          )}
        </div>
        <div>
          <h3>{t.recentCompletions}</h3>
          {recent.length > 0 ? (
            <ol className="leaderboard-list">
              {recent.map((event) => (
                <li key={`${event.digest}-${event.challengeId}-${event.solver}`}>
                  <strong>{shortAddress(event.solver)}</strong>
                  <span>
                    Challenge {event.challengeId} / {event.score} pts
                  </span>
                  <small>
                    {event.mode}, {t.hint} {event.assistanceLevel}, {t.epoch} {event.epoch}
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">{t.noRecentCompletions}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
