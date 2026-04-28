import { ExternalLink } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChainChallengeState } from "../lib/chainState";
import type { ChallengeActionState } from "../lib/challengeRuntime";
import type { ChallengeMetadata } from "../types";

type ChallengeDetailPanelProps = {
  actionState: ChallengeActionState;
  chainState: ChainChallengeState;
  challenge: ChallengeMetadata;
  lastDigest?: string;
  objectError?: Error | null;
  onExploitChallenge: () => void;
  onClaimInstance: () => void;
  onCreateProgress: () => void;
  onSolveChallenge: () => void;
  onUseCapability: () => void;
  packageId: string;
  statusMessage: string;
  warnings: string[];
};

export function ChallengeDetailPanel({
  actionState,
  chainState,
  challenge,
  lastDigest,
  objectError,
  onExploitChallenge,
  onClaimInstance,
  onCreateProgress,
  onSolveChallenge,
  onUseCapability,
  packageId,
  statusMessage,
  warnings,
}: ChallengeDetailPanelProps) {
  const isChallenge01 = challenge.id === "1";
  const isChallenge02 = challenge.id === "2";
  const isChallenge03 = challenge.id === "3";
  const isChallenge04 = challenge.id === "4";
  const isChallenge05 = challenge.id === "5";
  const selectedInstance = isChallenge02
    ? chainState.challenge02Instance
    : isChallenge03
      ? chainState.challenge03Instance
      : isChallenge04
        ? chainState.challenge04Instance
        : isChallenge05
          ? chainState.challenge05Instance
          : chainState.challenge01Instance;
  const isSolved =
    selectedInstance?.solved === true || chainState.progress?.completedChallengeIds.includes(challenge.id) === true;

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
          <dd>
            {isChallenge01 || isChallenge02 || isChallenge03 || isChallenge04 || isChallenge05
              ? selectedInstance?.objectId ?? "not claimed"
              : "not enabled yet"}
          </dd>
        </div>
        {isChallenge02 ? (
          <>
            <div>
              <dt>Shared Vault</dt>
              <dd>{chainState.challenge02Vault?.objectId ?? chainState.challenge02Instance?.vaultId ?? "not claimed"}</dd>
            </div>
            <div>
              <dt>Vault Balance</dt>
              <dd>{chainState.challenge02Vault?.balance ?? "not loaded"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge04 ? (
          <>
            <div>
              <dt>Admin Cap</dt>
              <dd>{chainState.challenge04AdminCap?.objectId ?? (chainState.challenge04Instance?.capClaimed ? "claimed by wallet" : "not claimed")}</dd>
            </div>
            <div>
              <dt>Admin Flag</dt>
              <dd>{chainState.challenge04Instance?.adminFlag === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge05 ? (
          <>
            <div>
              <dt>Admin Cap</dt>
              <dd>
                {chainState.challenge05AdminCap?.objectId ??
                  (chainState.challenge05Instance?.adminCapCreated ? "created by wallet" : "not created")}
              </dd>
            </div>
            <div>
              <dt>Initialized</dt>
              <dd>{chainState.challenge05Instance?.initialized === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge03 ? (
          <>
            <div>
              <dt>Instance Owner</dt>
              <dd>{chainState.challenge03Instance?.owner ?? "not claimed"}</dd>
            </div>
            <div>
              <dt>Restricted Flag</dt>
              <dd>{chainState.challenge03Instance?.restrictedFlag === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
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
        {isChallenge02 || isChallenge03 || isChallenge04 || isChallenge05 ? (
          <button type="button" disabled={!actionState.canExploit} title={actionState.exploitReason} onClick={onExploitChallenge}>
            {isChallenge05 ? "Create Bad Init Cap" : isChallenge04 ? "Claim Leaked Cap" : isChallenge03 ? "Exploit Fake Owner" : "Exploit Withdraw"}
          </button>
        ) : null}
        {isChallenge04 || isChallenge05 ? (
          <button type="button" disabled={!actionState.canUseCapability} title={actionState.useCapabilityReason} onClick={onUseCapability}>
            {isChallenge05 ? "Initialize State" : "Use Admin Cap"}
          </button>
        ) : null}
        <button type="button" disabled={!actionState.canSolve} title={actionState.solveReason} onClick={onSolveChallenge}>
          Solve Challenge
        </button>
      </div>

      <p className="action-hint">{visibleReason(actionState)}</p>
      <p className={statusMessage.toLowerCase().includes("fail") ? "status-line error" : "status-line"}>{statusMessage}</p>
      {warnings.map((warning) => (
        <p className="status-line warning" key={warning}>
          {warning}
        </p>
      ))}
      {lastDigest ? (
        <a className="digest-link" href={`https://suiexplorer.com/txblock/${lastDigest}?network=testnet`} target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" />
          {shortDigest(lastDigest)}
        </a>
      ) : null}
      {!packageId ? <p className="status-line error">Missing frontend deployment configuration.</p> : null}
      {objectError ? <p className="status-line error">{objectError.message}</p> : null}
      <section className="docs-panel">
        <h3>Statement</h3>
        <MarkdownRenderer sourceUrl={challenge.sourceUrl} />
      </section>
    </article>
  );
}

function visibleReason(actionState: ChallengeActionState): string {
  if (actionState.canCreateProgress) return actionState.createProgressReason;
  if (actionState.canClaim) return actionState.claimReason;
  if (actionState.canExploit) return actionState.exploitReason;
  if (actionState.canUseCapability) return actionState.useCapabilityReason;
  if (actionState.canSolve) return actionState.solveReason;
  if (actionState.runtimeState === "solved") return actionState.solveReason;
  if (actionState.runtimeState === "ready-to-solve") return actionState.solveReason;
  if (actionState.runtimeState === "not-claimed") return actionState.claimReason;
  if (actionState.runtimeState === "claimed") return actionState.exploitReason;
  return actionState.createProgressReason;
}

function shortDigest(digest: string): string {
  return `${digest.slice(0, 10)}...${digest.slice(-6)}`;
}
