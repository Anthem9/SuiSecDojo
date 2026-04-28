import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { BookOpen, Shield, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { ChallengeDetailPanel } from "./components/ChallengeDetailPanel";
import { ProgressPanel } from "./components/ProgressPanel";
import { challenges } from "./data/challenges";
import { useChallenge01Actions } from "./hooks/useChallenge01Actions";
import { useDojoObjects } from "./hooks/useDojoObjects";
import { getChallenge01ActionState } from "./lib/challengeRuntime";
import { CONTRACTS } from "./lib/constants";
import { filterChallenges } from "./lib/challengeFilters";
import { summarizeProgress } from "./lib/progress";
import type { ChallengeDifficulty } from "./types";

const challenge01Id = "1";
const challenge01 = challenges.find((challenge) => challenge.id === challenge01Id) ?? challenges[0];

export function App() {
  const account = useCurrentAccount();
  const packageId = CONTRACTS.PACKAGE_ID;
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [selectedSlug, setSelectedSlug] = useState(challenges[0]?.slug ?? "");
  const { chainState, chainProgress, isSolved, ownedObjectsQuery, challenge02VaultQuery, refetchObjects } = useDojoObjects(
    account?.address,
    packageId,
  );
  const challengeActions = useChallenge01Actions(packageId, chainState, refetchObjects);
  const progress = summarizeProgress(challenges, chainProgress);
  const visibleChallenges = useMemo(() => filterChallenges(challenges, { difficulty }), [difficulty]);
  const selectedChallenge = challenges.find((challenge) => challenge.slug === selectedSlug) ?? challenge01;
  const isChallenge02Selected = selectedChallenge.id === "2";
  const actionState = getChallenge01ActionState({
    accountAddress: account?.address,
    packageId,
    selectedChallengeId: selectedChallenge.id,
    chainState,
    actionBusy: challengeActions.isPending || ownedObjectsQuery.isFetching || challenge02VaultQuery.isFetching,
  });

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

        <ProgressPanel accountAddress={account?.address} progress={progress} />
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

        <ChallengeDetailPanel
          actionState={actionState}
          chainState={chainState}
          challenge={selectedChallenge}
          lastDigest={challengeActions.lastDigest}
          objectError={ownedObjectsQuery.error ?? challenge02VaultQuery.error}
          onExploitChallenge={challengeActions.withdrawChallenge02}
          onClaimInstance={isChallenge02Selected ? challengeActions.claimChallenge02 : challengeActions.claimInstance}
          onCreateProgress={challengeActions.createProgress}
          onSolveChallenge={isChallenge02Selected ? challengeActions.solveChallenge02 : challengeActions.solveChallenge}
          packageId={packageId}
          statusMessage={isSolved && !isChallenge02Selected ? "Challenge 01 completed on-chain." : challengeActions.statusMessage}
        />
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
