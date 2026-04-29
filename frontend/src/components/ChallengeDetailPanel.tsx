import { ExternalLink } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useDojo } from "../app/DojoContext";
import type { ChainChallengeState } from "../lib/chainState";
import type { ChallengeActionState } from "../lib/challengeRuntime";
import { challengeDescription, challengeTags, challengeTitle, formatDifficulty } from "../lib/challengeText";
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
  const { locale } = useDojo();
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
  const isChallenge11 = challenge.id === "11";
  const isChallenge12 = challenge.id === "12";
  const isChallenge13 = challenge.id === "13";
  const isChallenge14 = challenge.id === "14";
  const isChallenge15 = challenge.id === "15";
  const isChallenge16 = challenge.id === "16";
  const isChallenge17 = challenge.id === "17";
  const isChallenge18 = challenge.id === "18";
  const isChallenge19 = challenge.id === "19";
  const isChallenge20 = challenge.id === "20";
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
                    : isChallenge11
                      ? chainState.challenge11Instance
                      : isChallenge12
                        ? chainState.challenge12Instance
                        : isChallenge13
                          ? chainState.challenge13Instance
                          : isChallenge14
                            ? chainState.challenge14Instance
                            : isChallenge15
                              ? chainState.challenge15Instance
                              : isChallenge16
                                ? chainState.challenge16Instance
                                : isChallenge17
                                  ? chainState.challenge17Instance
                                  : isChallenge18
                                    ? chainState.challenge18Instance
                                    : isChallenge19
                                      ? chainState.challenge19Instance
                                      : isChallenge20
                                        ? chainState.challenge20Instance
                                        : chainState.challenge01Instance;
  const isSolved =
    selectedInstance?.solved === true || chainState.progress?.completedChallengeIds.includes(challenge.id) === true;
  const cliTemplate = cliPracticeTemplate({ challenge, packageId, chainState, values: practiceInputs });

  return (
    <article className="detail-panel">
      <span className="difficulty">{formatDifficulty(challenge.difficulty)}</span>
      <h2>{challengeTitle(challenge, locale)}</h2>
      <p>{challengeDescription(challenge, locale)}</p>
      <p className="safety-notice">
        本平台仅用于安全教育、审计训练和防御研究。所有漏洞案例均为最小化模拟版本，禁止用于攻击真实协议、真实资产或未授权系统。
      </p>

      <dl>
        <div>
          <dt>{localLabel(locale, "合约包", "Package")}</dt>
          <dd>{packageId || "missing VITE_PACKAGE_ID"}</dd>
        </div>
        <div>
          <dt>{localLabel(locale, "进度对象", "Progress Object")}</dt>
          <dd>{chainState.progress?.objectId ?? localLabel(locale, "尚未创建", "not created")}</dd>
        </div>
        <div>
          <dt>{localLabel(locale, "题目实例", "Challenge Instance")}</dt>
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
            isChallenge10 ||
            isChallenge11 ||
            isChallenge12 ||
            isChallenge13 ||
            isChallenge14 ||
            isChallenge15 ||
            isChallenge16 ||
            isChallenge17 ||
            isChallenge18 ||
            isChallenge19 ||
            isChallenge20
              ? selectedInstance?.objectId ?? localLabel(locale, "尚未领取", "not claimed")
              : localLabel(locale, "暂未启用", "not enabled yet")}
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
        {isChallenge11 ? (
          <div>
            <dt>Custodian</dt>
            <dd>{chainState.challenge11Instance?.custodian ?? "not assigned"}</dd>
          </div>
        ) : null}
        {isChallenge12 ? (
          <div>
            <dt>Pollution Count</dt>
            <dd>{chainState.challenge12Instance?.pollutionCount ?? "0"}</dd>
          </div>
        ) : null}
        {isChallenge13 ? (
          <>
            <div>
              <dt>Delegated Cap</dt>
              <dd>{chainState.challenge13DelegatedCap?.objectId ?? "not delegated"}</dd>
            </div>
            <div>
              <dt>Privileged Flag</dt>
              <dd>{chainState.challenge13Instance?.privilegedFlag === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge14 ? (
          <>
            <div>
              <dt>Observed Epoch</dt>
              <dd>{chainState.challenge14Instance?.observedEpoch ?? "not used"}</dd>
            </div>
            <div>
              <dt>Stale Price Used</dt>
              <dd>{chainState.challenge14Instance?.stalePriceUsed === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge15 ? (
          <>
            <div>
              <dt>Deposits</dt>
              <dd>{chainState.challenge15Instance?.deposits ?? "0"}</dd>
            </div>
            <div>
              <dt>Credits</dt>
              <dd>{chainState.challenge15Instance?.credits ?? "0"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge16 ? (
          <>
            <div>
              <dt>Trusted Signer</dt>
              <dd>{chainState.challenge16Instance?.trustedSigner ?? "not set"}</dd>
            </div>
            <div>
              <dt>Intent Accepted</dt>
              <dd>{chainState.challenge16Instance?.intentAccepted === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge17 ? (
          <>
            <div>
              <dt>Trusted / Shadow Key</dt>
              <dd>
                {chainState.challenge17Instance
                  ? `${chainState.challenge17Instance.trustedKey} / ${chainState.challenge17Instance.shadowKey}`
                  : "not claimed"}
              </dd>
            </div>
            <div>
              <dt>Shadow Written</dt>
              <dd>{chainState.challenge17Instance?.shadowWritten === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge18 ? (
          <>
            <div>
              <dt>Last Epoch</dt>
              <dd>{chainState.challenge18Instance?.lastEpoch ?? "0"}</dd>
            </div>
            <div>
              <dt>Rewards</dt>
              <dd>{chainState.challenge18Instance?.rewards ?? "0"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge19 ? (
          <>
            <div>
              <dt>Old Witness</dt>
              <dd>{chainState.challenge19OldWitness?.objectId ?? "not minted"}</dd>
            </div>
            <div>
              <dt>Old Witness Used</dt>
              <dd>{chainState.challenge19Instance?.oldWitnessUsed === true ? "true" : "false"}</dd>
            </div>
          </>
        ) : null}
        {isChallenge20 ? (
          <>
            <div>
              <dt>Collateral / Debt</dt>
              <dd>
                {chainState.challenge20Instance
                  ? `${chainState.challenge20Instance.collateral} / ${chainState.challenge20Instance.debt}`
                  : "not claimed"}
              </dd>
            </div>
            <div>
              <dt>Health / Liquidated</dt>
              <dd>
                {chainState.challenge20Instance
                  ? `${chainState.challenge20Instance.health} / ${chainState.challenge20Instance.liquidated ? "true" : "false"}`
                  : "not claimed"}
              </dd>
            </div>
          </>
        ) : null}
        <div>
          <dt>{localLabel(locale, "完成状态", "Completion")}</dt>
          <dd>{isSolved ? localLabel(locale, "已完成", "solved") : localLabel(locale, "未完成", "not solved")}</dd>
        </div>
      </dl>

      <div className="tag-row">
        {challengeTags(challenge, locale).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <section className="docs-panel">
        <h3>{locale === "zh" ? "题面" : "Statement"}</h3>
        <MarkdownRenderer locale={locale} sourceUrl={challenge.sourceUrl} />
      </section>

      {!isSolved ? (
        <section className="practice-panel">
          <div className="mode-toggle" aria-label="Training mode">
            {(["challenge", "guided"] as const).map((mode) => (
              <button key={mode} className={trainingMode === mode ? "active" : ""} type="button" onClick={() => onTrainingModeChange(mode)}>
                {localizedTrainingMode(mode, locale)}
              </button>
            ))}
          </div>
          <dl className="score-grid">
            <div>
              <dt>{localLabel(locale, "模式", "Mode")}</dt>
              <dd>{localizedTrainingMode(trainingMode, locale)}</dd>
            </div>
            <div>
              <dt>{localLabel(locale, "提示", "Assistance")}</dt>
              <dd>{localizedAssistance(assistanceLevel, locale)}</dd>
            </div>
            <div>
              <dt>{localLabel(locale, "预计分数", "Score Preview")}</dt>
              <dd>{scorePreview}</dd>
            </div>
          </dl>
          <p className="section-copy">
            {trainingMode === "challenge"
              ? locale === "zh"
                ? "挑战模式：页面会隐藏辅助执行按钮。请根据下方对象 ID 和 CLI/PTB 模板，自己构造交易。"
                : "Challenge Mode: helper execution buttons are hidden. Use the object ids and CLI/PTB template below to construct the transaction yourself."
              : locale === "zh"
                ? "引导模式：页面会显示练习按钮，方便上手；最终 solve 事件会记录较低分数。"
                : "Guided Mode: helper buttons are enabled for practice, but the solve event records a lower score."}
          </p>
          <h3>{localLabel(locale, "CLI / PTB 练习", "CLI / PTB Practice")}</h3>
          {trainingMode === "guided" ? (
            <PracticeInputs
              actionState={actionState}
              challengeId={challenge.id}
              inputs={practiceInputs}
              locale={locale}
              onChange={onPracticeInputChange}
              onRun={onRunPracticeAction}
              owner={isChallenge16 ? chainState.challenge16Instance?.owner : chainState.challenge03Instance?.owner}
            />
          ) : (
            <p className="empty-state">
              {locale === "zh"
                ? "挑战模式隐藏辅助执行按钮。请修改 CLI/PTB 模板中的参数，并使用钱包或 Sui CLI 自行执行。"
                : "Challenge Mode hides helper execution. Fill values by editing the CLI/PTB template and run it with your wallet or Sui CLI."}
            </p>
          )}
          <pre>{cliTemplate}</pre>
        </section>
      ) : (
        <p className="status-line">
          {localLabel(locale, "题目已完成。请查看题面、修复说明和最终分数，不需要重复提交。", "Challenge solved. Review the statement, fix notes, and your final score instead of resubmitting.")}
        </p>
      )}

      <div className="detail-actions">
        <button
          type="button"
          disabled={!actionState.canCreateProgress}
          title={localizedReason(actionState.createProgressReason, locale)}
          onClick={onCreateProgress}
        >
          {localLabel(locale, "创建进度", "Create Progress")}
        </button>
        <button type="button" disabled={!actionState.canClaim} title={localizedReason(actionState.claimReason, locale)} onClick={onClaimInstance}>
          {localLabel(locale, "领取实例", "Claim Instance")}
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
        isChallenge10 ||
        isChallenge11 ||
        isChallenge12 ||
        isChallenge13 ||
        isChallenge14 ||
        isChallenge15 ||
        isChallenge16 ||
        isChallenge17 ||
        isChallenge18 ||
        isChallenge19 ||
        isChallenge20) ? (
          <button type="button" disabled={!actionState.canExploit} title={localizedReason(actionState.exploitReason, locale)} onClick={onExploitChallenge}>
            {guidedActionLabel(challenge.id, locale)}
          </button>
        ) : null}
        {trainingMode === "guided" && (isChallenge04 || isChallenge05 || isChallenge13 || isChallenge19) ? (
          <button type="button" disabled={!actionState.canUseCapability} title={localizedReason(actionState.useCapabilityReason, locale)} onClick={onUseCapability}>
            {capabilityActionLabel(challenge.id, locale)}
          </button>
        ) : null}
        {!isSolved ? (
          <button type="button" disabled={!actionState.canSolve} title={localizedReason(actionState.solveReason, locale)} onClick={onSolveChallenge}>
            {localLabel(locale, "提交判题", "Submit Solve")}
          </button>
        ) : null}
      </div>

      <p className="action-hint">{localizedReason(visibleReason(actionState), locale)}</p>
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
  locale,
  onChange,
  onRun,
  owner,
}: {
  actionState: ChallengeActionState;
  challengeId: string;
  inputs: PracticeDefaults;
  locale: "en" | "zh";
  onChange: <Key extends keyof PracticeDefaults>(key: Key, value: PracticeDefaults[Key]) => void;
  onRun: () => void;
  owner?: string;
}) {
  const runLabel = practiceRunLabel(challengeId, locale);
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
      {challengeId === "14" ? (
        <>
          <label>
            checked_epoch
            <input value={inputs.checkedEpoch} onChange={(event) => onChange("checkedEpoch", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            price_epoch
            <input value={inputs.priceEpoch} onChange={(event) => onChange("priceEpoch", event.target.value)} inputMode="numeric" />
          </label>
        </>
      ) : null}
      {challengeId === "15" ? (
        <label>
          credit_amount
          <input value={inputs.creditAmount} onChange={(event) => onChange("creditAmount", event.target.value)} inputMode="numeric" />
        </label>
      ) : null}
      {challengeId === "16" ? (
        <label>
          claimed_signer
          <input
            value={inputs.claimedSigner || owner || ""}
            onChange={(event) => onChange("claimedSigner", event.target.value)}
            placeholder={owner ?? "0x..."}
          />
        </label>
      ) : null}
      {challengeId === "17" ? (
        <label>
          shadow_key
          <input value={inputs.shadowKey} onChange={(event) => onChange("shadowKey", event.target.value)} inputMode="numeric" />
        </label>
      ) : null}
      {challengeId === "18" ? (
        <>
          <label>
            observed_epoch
            <input value={inputs.rewardEpoch} onChange={(event) => onChange("rewardEpoch", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            repeats
            <input value={inputs.rewardRepeats} onChange={(event) => onChange("rewardRepeats", event.target.value)} inputMode="numeric" />
          </label>
        </>
      ) : null}
      {challengeId === "20" ? (
        <>
          <label>
            price
            <input value={inputs.liquidationPrice} onChange={(event) => onChange("liquidationPrice", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            threshold
            <input
              value={inputs.liquidationThreshold}
              onChange={(event) => onChange("liquidationThreshold", event.target.value)}
              inputMode="numeric"
            />
          </label>
        </>
      ) : null}
      <button
        type="button"
        disabled={!canRunPractice}
        title={localizedReason(challengeId === "1" ? actionState.solveReason : actionState.exploitReason, locale)}
        onClick={onRun}
      >
        {runLabel}
      </button>
    </div>
  );
}

function practiceRunLabel(challengeId: string, locale: "en" | "zh"): string {
  if (locale === "zh") return guidedActionLabel(challengeId, locale);
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
    case "11":
      return "Accept Custody";
    case "12":
      return "Pollute State";
    case "13":
      return "Delegate Cap";
    case "14":
      return "Use Stale Price";
    case "15":
      return "Create Mismatch";
    case "16":
      return "Accept Intent";
    case "17":
      return "Write Shadow Key";
    case "18":
      return "Accrue Rewards";
    case "19":
      return "Mint Old Witness";
    case "20":
      return "Run Edge Liquidation";
    default:
      return "Run Practice Call";
  }
}

function guidedActionLabel(challengeId: string, locale: "en" | "zh"): string {
  if (locale !== "zh") {
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
      case "11":
        return "Accept Custody";
      case "12":
        return "Pollute State";
      case "13":
        return "Delegate Cap";
      case "14":
        return "Use Stale Price";
      case "15":
        return "Create Mismatch";
      case "16":
        return "Accept Intent";
      case "17":
        return "Write Shadow Key";
      case "18":
        return "Accrue Rewards";
      case "19":
        return "Mint Old Witness";
      case "20":
        return "Run Edge Liquidation";
      case "8":
        return "Use Old Path";
      case "7":
        return "Run Guarded Value";
      case "6":
        return "Run Rounded Buys";
      case "5":
        return "Create Bad Init Cap";
      case "4":
        return "Claim Leaked Cap";
      default:
        return "Run Practice Call";
    }
  }

  switch (challengeId) {
    case "1":
      return "执行铸币调用";
    case "2":
      return "执行提现调用";
    case "3":
      return "执行伪 owner 调用";
    case "4":
      return "领取泄露 Cap";
    case "5":
      return "创建错误初始化 Cap";
    case "6":
      return "执行舍入购买";
    case "7":
      return "提交边界数值";
    case "8":
      return "调用旧入口";
    case "9":
      return "执行 PTB";
    case "10":
      return "执行 AMM Swap";
    case "11":
      return "接收托管对象";
    case "12":
      return "污染共享状态";
    case "13":
      return "委托 Capability";
    case "14":
      return "使用过期价格";
    case "15":
      return "制造记账不一致";
    case "16":
      return "接受伪造意图";
    case "17":
      return "写入 Shadow Key";
    case "18":
      return "累计奖励";
    case "19":
      return "铸造旧 Witness";
    case "20":
      return "执行边界清算";
    default:
      return "执行练习调用";
  }
}

function capabilityActionLabel(challengeId: string, locale: "en" | "zh"): string {
  if (locale !== "zh") {
    if (challengeId === "19") return "Use Old Witness";
    if (challengeId === "13") return "Use Delegated Cap";
    if (challengeId === "5") return "Initialize State";
    return "Use Admin Cap";
  }
  if (challengeId === "19") return "使用旧 Witness";
  if (challengeId === "13") return "使用委托 Cap";
  if (challengeId === "5") return "初始化状态";
  return "使用 AdminCap";
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

function localLabel(locale: "en" | "zh", zh: string, en: string): string {
  return locale === "zh" ? zh : en;
}

function localizedTrainingMode(mode: TrainingMode, locale: "en" | "zh"): string {
  if (locale !== "zh") return formatTrainingMode(mode);
  return mode === "challenge" ? "挑战模式" : "引导模式";
}

function localizedAssistance(level: AssistanceLevel, locale: "en" | "zh"): string {
  if (locale !== "zh") return assistanceLabels[level];
  switch (level) {
    case 0:
      return "未查看提示";
    case 1:
      return "概念提示";
    case 2:
      return "方向提示";
    case 3:
      return "检查清单提示";
    case 4:
      return "已查看答案";
  }
}

function localizedReason(reason: string, locale: "en" | "zh"): string {
  if (locale !== "zh") return reason;
  if (reason === "Connect a wallet first.") return "请先连接钱包。";
  if (reason === "Missing package configuration.") return "缺少合约包配置。";
  if (reason === "Create a progress object first.") return "请先创建进度对象。";
  if (reason === "Progress object already exists.") return "进度对象已创建。";
  if (reason === "Claim an instance first.") return "请先领取题目实例。";
  if (reason === "Instance already claimed.") return "题目实例已领取。";
  if (reason === "Run your mint before submitting solve.") return "提交判题前，请先执行 mint 调用。";
  if (reason === "Run the PTB combo first.") return "请先执行 PTB 组合调用。";
  if (reason.includes("already completed")) return "这道题已经完成。";
  if (reason.includes("Ready to solve")) return "已经满足判题条件，可以提交。";
  if (reason.includes("not yet connected to an on-chain instance")) return "这道题还没有接入链上实例。";
  if (reason.includes("Claim the leaked admin capability first")) return "请先领取泄露的 AdminCap。";
  if (reason.includes("Create the bad init admin capability first")) return "请先创建错误初始化 AdminCap。";
  if (reason.includes("Use the capability before solving")) return "请先使用 capability 完成受限操作。";
  return reason;
}
