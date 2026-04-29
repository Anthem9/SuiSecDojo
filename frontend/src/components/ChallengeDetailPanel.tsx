import { ExternalLink } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { ChainChallengeState } from "../lib/chainState";
import type { ChallengeActionState } from "../lib/challengeRuntime";
import { cliPracticeTemplate, type PracticeDefaults } from "../lib/practice";
import { assistanceLabels, formatTrainingMode, type AssistanceLevel, type TrainingMode } from "../lib/scoring";
import type { ChallengeMetadata } from "../types";

type ChallengeDetailPanelProps = {
  actionState: ChallengeActionState;
  chainState: ChainChallengeState;
  challenge: ChallengeMetadata;
  lastDigest?: string;
  objectError?: Error | null;
  assistanceLevel: AssistanceLevel;
  onAssistanceLevelChange: (level: AssistanceLevel) => void;
  onExploitChallenge: () => void;
  onClaimInstance: () => void;
  onCreateProgress: () => void;
  onPracticeInputChange: <Key extends keyof PracticeDefaults>(key: Key, value: PracticeDefaults[Key]) => void;
  onRunPracticeAction: () => void;
  onSolveChallenge: () => void;
  onTrainingModeChange: (mode: TrainingMode) => void;
  onUseCapability: () => void;
  packageId: string;
  practiceInputs: PracticeDefaults;
  scorePreview: number;
  statusMessage: string;
  trainingMode: TrainingMode;
  warnings: string[];
};

export function ChallengeDetailPanel({
  actionState,
  chainState,
  challenge,
  lastDigest,
  objectError,
  assistanceLevel,
  onAssistanceLevelChange,
  onExploitChallenge,
  onClaimInstance,
  onCreateProgress,
  onPracticeInputChange,
  onRunPracticeAction,
  onSolveChallenge,
  onTrainingModeChange,
  onUseCapability,
  packageId,
  practiceInputs,
  scorePreview,
  statusMessage,
  trainingMode,
  warnings,
}: ChallengeDetailPanelProps) {
  const isChallenge01 = challenge.id === "1";
  const isChallenge02 = challenge.id === "2";
  const isChallenge03 = challenge.id === "3";
  const isChallenge04 = challenge.id === "4";
  const isChallenge05 = challenge.id === "5";
  const isChallenge06 = challenge.id === "6";
  const isChallenge07 = challenge.id === "7";
  const isChallenge08 = challenge.id === "8";
  const isChallenge09 = challenge.id === "9";
  const isChallenge10 = challenge.id === "10";
  const selectedInstance = isChallenge02
    ? chainState.challenge02Instance
    : isChallenge03
      ? chainState.challenge03Instance
      : isChallenge04
        ? chainState.challenge04Instance
        : isChallenge05
          ? chainState.challenge05Instance
          : isChallenge06
            ? chainState.challenge06Instance
            : isChallenge07
              ? chainState.challenge07Instance
              : isChallenge08
                ? chainState.challenge08Instance
                : isChallenge09
                  ? chainState.challenge09Instance
                  : isChallenge10
                    ? chainState.challenge10Instance
          : chainState.challenge01Instance;
  const isSolved =
    selectedInstance?.solved === true || chainState.progress?.completedChallengeIds.includes(challenge.id) === true;
  const cliTemplate = cliPracticeTemplate({ challenge, packageId, chainState, values: practiceInputs });

  return (
    <article className="detail-panel">
      <span className="difficulty">{challenge.difficulty}</span>
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>
      <p className="safety-notice">
        本平台仅用于安全教育、审计训练和防御研究。所有漏洞案例均为最小化模拟版本，禁止用于攻击真实协议、真实资产或未授权系统。
      </p>
      <section className="training-panel">
        <div className="mode-toggle" aria-label="Training mode">
          {(["challenge", "guided"] as const).map((mode) => (
            <button key={mode} className={trainingMode === mode ? "active" : ""} type="button" onClick={() => onTrainingModeChange(mode)}>
              {formatTrainingMode(mode)}
            </button>
          ))}
        </div>
        <dl className="score-grid">
          <div>
            <dt>Mode</dt>
            <dd>{formatTrainingMode(trainingMode)}</dd>
          </div>
          <div>
            <dt>Assistance</dt>
            <dd>{assistanceLabels[assistanceLevel]}</dd>
          </div>
          <div>
            <dt>Score Preview</dt>
            <dd>{scorePreview}</dd>
          </div>
        </dl>
        <p className="section-copy">
          Challenge Mode expects you to inspect the entry points and construct the call yourself. Guided Mode keeps helper buttons but records a lower score.
        </p>
      </section>

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
            {isChallenge01 ||
            isChallenge02 ||
            isChallenge03 ||
            isChallenge04 ||
            isChallenge05 ||
            isChallenge06 ||
            isChallenge07 ||
            isChallenge08 ||
            isChallenge09 ||
            isChallenge10
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
        {isChallenge06 ? (
          <>
            <div>
              <dt>Paid Amount</dt>
              <dd>{chainState.challenge06Instance?.paidAmount ?? "0"}</dd>
            </div>
            <div>
              <dt>Credits</dt>
              <dd>{chainState.challenge06Instance?.credits ?? "0"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge07 ? (
          <div>
            <dt>Guarded Value</dt>
            <dd>{chainState.challenge07Instance?.guardedValue ?? "0"}</dd>
          </div>
        ) : null}
        {isChallenge08 ? (
          <div>
            <dt>Legacy Flag</dt>
            <dd>{chainState.challenge08Instance?.legacyFlag === true ? "true" : "false"}</dd>
          </div>
        ) : null}
        {isChallenge09 ? (
          <div>
            <dt>Combo Ready</dt>
            <dd>{chainState.challenge09Instance?.comboReady === true ? "true" : "false"}</dd>
          </div>
        ) : null}
        {isChallenge10 ? (
          <>
            <div>
              <dt>Reserves</dt>
              <dd>
                {chainState.challenge10Instance
                  ? `${chainState.challenge10Instance.reserveX} / ${chainState.challenge10Instance.reserveY}`
                  : "not claimed"}
              </dd>
            </div>
            <div>
              <dt>Profit / Invariant</dt>
              <dd>
                {chainState.challenge10Instance
                  ? `${chainState.challenge10Instance.attackerProfit} / ${
                      chainState.challenge10Instance.invariantBroken ? "broken" : "intact"
                    }`
                  : "not claimed"}
              </dd>
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

      <section className="docs-panel">
        <h3>Statement</h3>
        <MarkdownRenderer sourceUrl={challenge.sourceUrl} />
      </section>

      {!isSolved ? (
        <section className="practice-panel">
          <h3>CLI / PTB Practice</h3>
          <PracticeInputs
            actionState={actionState}
            challengeId={challenge.id}
            inputs={practiceInputs}
            onChange={onPracticeInputChange}
            onRun={onRunPracticeAction}
            owner={chainState.challenge03Instance?.owner}
          />
          <pre>{cliTemplate}</pre>
        </section>
      ) : (
        <p className="status-line">Challenge solved. Review the statement, fix notes, and your final score instead of resubmitting.</p>
      )}

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
        {trainingMode === "guided" &&
        (isChallenge02 ||
        isChallenge03 ||
        isChallenge04 ||
        isChallenge05 ||
        isChallenge06 ||
        isChallenge07 ||
        isChallenge08 ||
        isChallenge09 ||
        isChallenge10) ? (
          <button type="button" disabled={!actionState.canExploit} title={actionState.exploitReason} onClick={onExploitChallenge}>
            {isChallenge10
              ? "Run AMM Swap"
              : isChallenge09
                ? "Execute PTB"
                : isChallenge08
                  ? "Use Old Path"
                  : isChallenge07
                    ? "Run Guarded Value"
                    : isChallenge06
              ? "Run Rounded Buys"
              : isChallenge05
                ? "Create Bad Init Cap"
                : isChallenge04
                  ? "Claim Leaked Cap"
                : isChallenge03
                    ? "Run Owner Claim"
                    : "Run Withdraw Call"}
          </button>
        ) : null}
        {isChallenge04 || isChallenge05 ? (
          <button type="button" disabled={!actionState.canUseCapability} title={actionState.useCapabilityReason} onClick={onUseCapability}>
            {isChallenge05 ? "Initialize State" : "Use Admin Cap"}
          </button>
        ) : null}
        {!isSolved ? (
          <button type="button" disabled={!actionState.canSolve} title={actionState.solveReason} onClick={onSolveChallenge}>
            Submit Solve
          </button>
        ) : null}
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
    </article>
  );
}

function PracticeInputs({
  actionState,
  challengeId,
  inputs,
  onChange,
  onRun,
  owner,
}: {
  actionState: ChallengeActionState;
  challengeId: string;
  inputs: PracticeDefaults;
  onChange: <Key extends keyof PracticeDefaults>(key: Key, value: PracticeDefaults[Key]) => void;
  onRun: () => void;
  owner?: string;
}) {
  const runLabel = practiceRunLabel(challengeId);
  const canRunPractice =
    challengeId === "1"
      ? actionState.runtimeState === "claimed" || actionState.runtimeState === "ready-to-solve"
      : actionState.canExploit;
  return (
    <div className="practice-grid">
      {challengeId === "1" ? (
        <label>
          mint_amount
          <input value={inputs.mintAmount} onChange={(event) => onChange("mintAmount", event.target.value)} inputMode="numeric" />
        </label>
      ) : null}
      {challengeId === "2" ? (
        <label>
          withdraw_amount
          <input value={inputs.withdrawAmount} onChange={(event) => onChange("withdrawAmount", event.target.value)} inputMode="numeric" />
        </label>
      ) : null}
      {challengeId === "3" ? (
        <label>
          claimed_owner
          <input
            value={inputs.claimedOwner || owner || ""}
            onChange={(event) => onChange("claimedOwner", event.target.value)}
            placeholder={owner ?? "0x..."}
          />
        </label>
      ) : null}
      {challengeId === "6" ? (
        <>
          <label>
            buy_repeats
            <input value={inputs.buyRepeats} onChange={(event) => onChange("buyRepeats", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            payment
            <input value={inputs.buyPayment} onChange={(event) => onChange("buyPayment", event.target.value)} inputMode="numeric" />
          </label>
        </>
      ) : null}
      {challengeId === "7" ? (
        <label>
          guarded_value
          <input value={inputs.guardedValue} onChange={(event) => onChange("guardedValue", event.target.value)} inputMode="numeric" />
        </label>
      ) : null}
      {challengeId === "8" ? (
        <label>
          path
          <select value={inputs.oldPath} onChange={(event) => onChange("oldPath", event.target.value as PracticeDefaults["oldPath"])}>
            <option value="old">old_vulnerable_path</option>
            <option value="new">new_checked_path</option>
          </select>
        </label>
      ) : null}
      {challengeId === "10" ? (
        <label>
          swap_amount
          <input value={inputs.swapAmount} onChange={(event) => onChange("swapAmount", event.target.value)} inputMode="numeric" />
        </label>
      ) : null}
      <button type="button" disabled={!canRunPractice} title={challengeId === "1" ? actionState.solveReason : actionState.exploitReason} onClick={onRun}>
        {runLabel}
      </button>
    </div>
  );
}

function practiceRunLabel(challengeId: string): string {
  switch (challengeId) {
    case "1":
      return "Run Your Mint";
    case "2":
      return "Run Withdraw Call";
    case "3":
      return "Run Owner Claim";
    case "9":
      return "Execute PTB";
    case "10":
      return "Run AMM Swap";
    default:
      return "Run Practice Call";
  }
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
