import { ExternalLink } from "lucide-react";
import type { ChainChallengeState } from "../lib/chainState";
import type { Challenge01ActionState } from "../lib/challengeRuntime";
import type { ChallengeMetadata } from "../types";

type ChallengeDetailPanelProps = {
  actionState: Challenge01ActionState;
  chainState: ChainChallengeState;
  challenge: ChallengeMetadata;
  lastDigest?: string;
  objectError?: Error | null;
  onClaimInstance: () => void;
  onCreateProgress: () => void;
  onSolveChallenge: () => void;
  packageId: string;
  statusMessage: string;
};

export function ChallengeDetailPanel({
  actionState,
  chainState,
  challenge,
  lastDigest,
  objectError,
  onClaimInstance,
  onCreateProgress,
  onSolveChallenge,
  packageId,
  statusMessage,
}: ChallengeDetailPanelProps) {
  const isChallenge01 = challenge.id === "1";
  const isSolved =
    chainState.challenge01Instance?.solved === true || chainState.progress?.completedChallengeIds.includes("1") === true;

  return (
    <article className="detail-panel">
      <span className="difficulty">{challenge.difficulty}</span>
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>

      <dl>
        <div>
          <dt>Package</dt>
          <dd>{packageId || "missing VITE_PACKAGE_ID"}</dd>
        </div>
        <div>
          <dt>Progress Object</dt>
          <dd>{chainState.progress?.objectId ?? "not created"}</dd>
        </div>
        <div>
          <dt>Challenge Instance</dt>
          <dd>{isChallenge01 ? chainState.challenge01Instance?.objectId ?? "not claimed" : "not enabled yet"}</dd>
        </div>
        <div>
          <dt>Completion</dt>
          <dd>{isSolved ? "solved" : "not solved"}</dd>
        </div>
      </dl>

      <div className="tag-row">
        {challenge.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="detail-actions">
        <button
          type="button"
          disabled={!actionState.canCreateProgress}
          title={actionState.createProgressReason}
          onClick={onCreateProgress}
        >
          Create Progress
        </button>
        <button type="button" disabled={!actionState.canClaim} title={actionState.claimReason} onClick={onClaimInstance}>
          Claim Instance
        </button>
        <button type="button" disabled={!actionState.canSolve} title={actionState.solveReason} onClick={onSolveChallenge}>
          Solve Challenge
        </button>
      </div>

      <p className="action-hint">{visibleReason(actionState)}</p>
      <p className={statusMessage.toLowerCase().includes("fail") ? "status-line error" : "status-line"}>{statusMessage}</p>
      {lastDigest ? (
        <a className="digest-link" href={`https://suiexplorer.com/txblock/${lastDigest}?network=testnet`} target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" />
          {shortDigest(lastDigest)}
        </a>
      ) : null}
      {!packageId ? <p className="status-line error">Missing frontend deployment configuration.</p> : null}
      {objectError ? <p className="status-line error">{objectError.message}</p> : null}
    </article>
  );
}

function visibleReason(actionState: Challenge01ActionState): string {
  if (actionState.canCreateProgress) return actionState.createProgressReason;
  if (actionState.canClaim) return actionState.claimReason;
  if (actionState.canSolve) return actionState.solveReason;
  if (actionState.runtimeState === "solved") return actionState.solveReason;
  if (actionState.runtimeState === "not-claimed") return actionState.claimReason;
  return actionState.createProgressReason;
}

function shortDigest(digest: string): string {
  return `${digest.slice(0, 10)}...${digest.slice(-6)}`;
}
