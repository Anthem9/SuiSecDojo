import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { BookOpen, CheckCircle2, ExternalLink, Shield, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { challenges } from "./data/challenges";
import { parseChainChallengeState } from "./lib/chainState";
import { CONTRACTS } from "./lib/constants";
import { filterChallenges } from "./lib/challengeFilters";
import { summarizeProgress } from "./lib/progress";
import {
  claimChallenge01Transaction,
  createProgressTransaction,
  solveChallenge01Transaction,
} from "./lib/transactions";
import type { ChallengeDifficulty, ChallengeProgress } from "./types";

const challenge01Id = "1";
const challenge01 = challenges.find((challenge) => challenge.id === challenge01Id) ?? challenges[0];

export function App() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const packageId = CONTRACTS.PACKAGE_ID;
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [selectedSlug, setSelectedSlug] = useState(challenges[0]?.slug ?? "");
  const [statusMessage, setStatusMessage] = useState("Connect a wallet to start the on-chain dojo flow.");
  const [lastDigest, setLastDigest] = useState<string>();
  const signAndExecute = useSignAndExecuteTransaction();

  const ownedObjectsQuery = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address ?? "",
      filter: {
        MatchAny: [
          { StructType: `${packageId}::user_progress::UserProgress` },
          { StructType: `${packageId}::challenge_01_anyone_can_mint::ChallengeInstance` },
        ],
      },
      options: {
        showContent: true,
        showType: true,
        showOwner: true,
      },
      limit: 50,
    },
    {
      enabled: Boolean(account?.address && packageId),
    },
  );

  const chainState = useMemo(
    () => parseChainChallengeState(ownedObjectsQuery.data?.data ?? [], packageId),
    [ownedObjectsQuery.data?.data, packageId],
  );
  const chainProgress: ChallengeProgress = useMemo(
    () => ({
      completedChallengeIds: chainState.progress?.completedChallengeIds ?? [],
      badgeIds: [],
    }),
    [chainState.progress],
  );
  const progress = summarizeProgress(challenges, chainProgress);
  const visibleChallenges = useMemo(() => filterChallenges(challenges, { difficulty }), [difficulty]);
  const selectedChallenge = challenges.find((challenge) => challenge.slug === selectedSlug) ?? challenge01;
  const isChallenge01Selected = selectedChallenge.id === challenge01Id;
  const hasDeployment = Boolean(packageId);
  const hasProgress = Boolean(chainState.progress);
  const hasInstance = Boolean(chainState.challenge01Instance);
  const isSolved = chainState.challenge01Instance?.solved === true || chainState.progress?.completedChallengeIds.includes("1");
  const actionBusy = signAndExecute.isPending || ownedObjectsQuery.isFetching;

  async function executeAndRefresh(label: string, transactionFactory: () => ReturnType<typeof createProgressTransaction>) {
    if (!account) {
      setStatusMessage("Connect a wallet before sending a transaction.");
      return;
    }

    try {
      setStatusMessage(`${label} transaction is waiting for wallet approval...`);
      const result = await signAndExecute.mutateAsync({
        transaction: transactionFactory(),
      });
      setLastDigest(result.digest);
      setStatusMessage(`${label} transaction submitted. Waiting for finality...`);
      await client.waitForTransaction({ digest: result.digest });
      await ownedObjectsQuery.refetch();
      setStatusMessage(`${label} completed on testnet.`);
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : `${label} failed.`);
    }
  }

  const canCreateProgress = Boolean(account && hasDeployment && !hasProgress);
  const canClaim = Boolean(account && hasDeployment && hasProgress && !hasInstance);
  const canSolve = Boolean(account && hasDeployment && hasProgress && hasInstance && !isSolved);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Shield aria-hidden="true" />
          <span>SuiSec Dojo</span>
        </div>
        <ConnectButton className="wallet-button" connectText={<WalletLabel />} />
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
          <small>{account ? shortAddress(account.address) : "Wallet not connected"}</small>
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
              <dt>Package</dt>
              <dd>{packageId || "missing VITE_PACKAGE_ID"}</dd>
            </div>
            <div>
              <dt>Progress Object</dt>
              <dd>{chainState.progress?.objectId ?? "not created"}</dd>
            </div>
            <div>
              <dt>Challenge Instance</dt>
              <dd>{chainState.challenge01Instance?.objectId ?? "not claimed"}</dd>
            </div>
            <div>
              <dt>Completion</dt>
              <dd>{isSolved ? "solved" : "not solved"}</dd>
            </div>
          </dl>

          <div className="tag-row">
            {selectedChallenge.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <div className="detail-actions">
            <button
              type="button"
              disabled={!canCreateProgress || actionBusy}
              onClick={() => executeAndRefresh("Create progress", () => createProgressTransaction(packageId))}
            >
              Create Progress
            </button>
            <button
              type="button"
              disabled={!canClaim || actionBusy || !isChallenge01Selected}
              onClick={() =>
                executeAndRefresh("Claim instance", () => claimChallenge01Transaction(packageId, chainState.progress!.objectId))
              }
            >
              Claim Instance
            </button>
            <button
              type="button"
              disabled={!canSolve || actionBusy || !isChallenge01Selected}
              onClick={() =>
                executeAndRefresh("Solve challenge", () =>
                  solveChallenge01Transaction(
                    packageId,
                    chainState.progress!.objectId,
                    chainState.challenge01Instance!.objectId,
                  ),
                )
              }
            >
              Solve Challenge
            </button>
          </div>

          <p className={statusMessage.toLowerCase().includes("fail") ? "status-line error" : "status-line"}>
            {statusMessage}
          </p>
          {lastDigest ? (
            <a className="digest-link" href={`https://suiexplorer.com/txblock/${lastDigest}?network=testnet`} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              {shortDigest(lastDigest)}
            </a>
          ) : null}
          {!hasDeployment ? <p className="status-line error">Missing frontend deployment configuration.</p> : null}
          {ownedObjectsQuery.error ? <p className="status-line error">{ownedObjectsQuery.error.message}</p> : null}
        </article>
      </section>
    </main>
  );
}

function WalletLabel() {
  return (
    <>
      <Wallet aria-hidden="true" />
      Connect Wallet
    </>
  );
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function shortDigest(digest: string): string {
  return `${digest.slice(0, 10)}...${digest.slice(-6)}`;
}

