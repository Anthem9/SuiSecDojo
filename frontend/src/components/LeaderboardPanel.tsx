import { Trophy } from "lucide-react";
import type { CompletionEvent, LeaderboardEntry } from "../lib/leaderboard";

type LeaderboardPanelProps = {
  entries: LeaderboardEntry[];
  recent: CompletionEvent[];
  currentRank?: number;
  isLoading: boolean;
  error?: Error | null;
};

export function LeaderboardPanel({ currentRank, entries, error, isLoading, recent }: LeaderboardPanelProps) {
  return (
    <section className="leaderboard-panel" id="leaderboard">
      <div className="section-heading">
        <Trophy aria-hidden="true" />
        <h2>Leaderboard</h2>
      </div>
      <p className="section-copy">Completion events are indexed from the current Phase 4 testnet package.</p>
      {currentRank ? <p className="status-line">Current wallet rank: #{currentRank}</p> : null}
      {isLoading ? <p className="empty-state">Loading events...</p> : null}
      {error ? <p className="status-line error">{error.message}</p> : null}
      <div className="leaderboard-grid">
        <div>
          <h3>Top learners</h3>
          {entries.length > 0 ? (
            <ol className="leaderboard-list">
              {entries.slice(0, 10).map((entry) => (
                <li key={entry.solver}>
                  <strong>{shortAddress(entry.solver)}</strong>
                  <span>{entry.totalScore} pts</span>
                  <small>
                    {entry.completedCount} solved / {entry.badgeCount} badges
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No completion events yet.</p>
          )}
        </div>
        <div>
          <h3>Recent completions</h3>
          {recent.length > 0 ? (
            <ol className="leaderboard-list">
              {recent.map((event) => (
                <li key={`${event.digest}-${event.challengeId}-${event.solver}`}>
                  <strong>{shortAddress(event.solver)}</strong>
                  <span>
                    Challenge {event.challengeId} / {event.score} pts
                  </span>
                  <small>
                    {event.mode}, hint {event.assistanceLevel}, epoch {event.epoch}
                  </small>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-state">No recent completions.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
