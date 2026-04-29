import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { BookOpen, FileText, Languages, Shield, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { ChallengeDetailPanel } from "./components/ChallengeDetailPanel";
import { LeaderboardPanel } from "./components/LeaderboardPanel";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { PassportPanel } from "./components/PassportPanel";
import { ProfilePanel } from "./components/ProfilePanel";
import { ProgressPanel } from "./components/ProgressPanel";
import { ReportPanel } from "./components/ReportPanel";
import { TutorPanel } from "./components/TutorPanel";
import { challenges } from "./data/challenges";
import { useChallenge01Actions } from "./hooks/useChallenge01Actions";
import { useDojoObjects } from "./hooks/useDojoObjects";
import { useLeaderboardEvents } from "./hooks/useLeaderboardEvents";
import { getChallenge01ActionState } from "./lib/challengeRuntime";
import { CONTRACTS, SUI_NETWORK } from "./lib/constants";
import { filterChallenges } from "./lib/challengeFilters";
import { dictionaries, type Locale } from "./lib/i18n";
import { defaultPracticeInputs, type PracticeDefaults } from "./lib/practice";
import { summarizeProgress } from "./lib/progress";
import { summarizeProfile } from "./lib/profile";
import { baseScoreForDifficulty, calculateScore, type AssistanceLevel, type TrainingMode } from "./lib/scoring";
import type { ChallengeDifficulty } from "./types";

const challenge01Id = "1";
const challenge01 = challenges.find((challenge) => challenge.id === challenge01Id) ?? challenges[0];
const replayDocs = [
  {
    title: "AMM Math Error Replay",
    sourceUrl: "content/replays/amm-math-error-replay/index.md",
  },
  {
    title: "Capability Leak Replay",
    sourceUrl: "content/replays/capability-leak-replay/index.md",
  },
  {
    title: "Shared Object Pollution Replay",
    sourceUrl: "content/replays/shared-object-pollution-replay/index.md",
  },
];

const safetyNotice =
  "本平台仅用于安全教育、审计训练和防御研究。所有漏洞案例均为最小化模拟版本，禁止用于攻击真实协议、真实资产或未授权系统。";

export function App() {
  const account = useCurrentAccount();
  const packageId = CONTRACTS.PACKAGE_ID;
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [locale, setLocale] = useState<Locale>("zh");
  const [selectedSlug, setSelectedSlug] = useState(challenges[0]?.slug ?? "");
  const [selectedDocUrl, setSelectedDocUrl] = useState("content/challenges/01-anyone-can-mint/statement.md");
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("challenge");
  const [assistanceLevel, setAssistanceLevel] = useState<AssistanceLevel>(0);
  const [practiceInputs, setPracticeInputs] = useState<PracticeDefaults>(defaultPracticeInputs);
  const t = dictionaries[locale];
  const { chainState, chainProgress, isSolved, ownedObjectsQuery, challenge02VaultQuery, suiBalanceMist, refetchObjects } = useDojoObjects(
    account?.address,
    packageId,
  );
  const challengeActions = useChallenge01Actions(packageId, chainState, refetchObjects);
  const leaderboardQuery = useLeaderboardEvents(packageId, account?.address);
  const progress = summarizeProgress(challenges, chainProgress);
  const visibleChallenges = useMemo(() => filterChallenges(challenges, { difficulty }), [difficulty]);
  const selectedChallenge = challenges.find((challenge) => challenge.slug === selectedSlug) ?? challenge01;
  const isChallenge02Selected = selectedChallenge.id === "2";
  const isChallenge03Selected = selectedChallenge.id === "3";
  const isChallenge04Selected = selectedChallenge.id === "4";
  const isChallenge05Selected = selectedChallenge.id === "5";
  const isChallenge06Selected = selectedChallenge.id === "6";
  const isChallenge07Selected = selectedChallenge.id === "7";
  const isChallenge08Selected = selectedChallenge.id === "8";
  const isChallenge09Selected = selectedChallenge.id === "9";
  const isChallenge10Selected = selectedChallenge.id === "10";
  const profile = summarizeProfile({
    accountAddress: account?.address,
    network: SUI_NETWORK,
    challenges,
    chainState,
    badges: chainState.badges ?? [],
    leaderboardEntry: leaderboardQuery.leaderboard.currentEntry,
  });
  const actionState = getChallenge01ActionState({
    accountAddress: account?.address,
    packageId,
    selectedChallengeId: selectedChallenge.id,
    chainState,
    actionBusy: challengeActions.isPending || ownedObjectsQuery.isFetching || challenge02VaultQuery.isFetching,
  });
  const warnings = [
    SUI_NETWORK !== "testnet" ? `Current network is ${SUI_NETWORK}; SuiSec Dojo challenges are configured for testnet.` : undefined,
    account?.address && suiBalanceMist === "0" ? "Wallet has no SUI available for gas. Fund it from the Sui testnet faucet." : undefined,
  ].filter((message): message is string => Boolean(message));
  const solveOptions = { mode: trainingMode, assistanceLevel };
  const scorePreview = calculateScore(baseScoreForDifficulty(selectedChallenge.difficulty), trainingMode, assistanceLevel);
  const setPracticeInput = <Key extends keyof PracticeDefaults>(key: Key, value: PracticeDefaults[Key]) => {
    setPracticeInputs((current) => ({ ...current, [key]: value }));
  };
  const runPracticeAction = () => {
    const asPositiveInt = (value: string, fallback: number) => {
      const parsed = Number.parseInt(value, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };

    if (isChallenge10Selected) {
      challengeActions.exploitChallenge10(asPositiveInt(practiceInputs.swapAmount, 100));
    } else if (isChallenge09Selected) {
      challengeActions.exploitChallenge09();
    } else if (isChallenge08Selected) {
      challengeActions.exploitChallenge08(practiceInputs.oldPath);
    } else if (isChallenge07Selected) {
      challengeActions.exploitChallenge07(asPositiveInt(practiceInputs.guardedValue, 1_000));
    } else if (isChallenge06Selected) {
      challengeActions.exploitChallenge06(asPositiveInt(practiceInputs.buyRepeats, 10), asPositiveInt(practiceInputs.buyPayment, 1));
    } else if (isChallenge05Selected) {
      challengeActions.exploitChallenge05();
    } else if (isChallenge04Selected) {
      challengeActions.exploitChallenge04();
    } else if (isChallenge03Selected) {
      challengeActions.exploitChallenge03(practiceInputs.claimedOwner || chainState.challenge03Instance?.owner);
    } else if (isChallenge02Selected) {
      challengeActions.withdrawChallenge02(asPositiveInt(practiceInputs.withdrawAmount, 100));
    } else {
      challengeActions.mintChallenge01(asPositiveInt(practiceInputs.mintAmount, 1_000));
    }
  };
  const solveSelectedChallenge = () => {
    if (isChallenge10Selected) {
      challengeActions.solveChallenge10(solveOptions);
    } else if (isChallenge09Selected) {
      challengeActions.solveChallenge09(solveOptions);
    } else if (isChallenge08Selected) {
      challengeActions.solveChallenge08(solveOptions);
    } else if (isChallenge07Selected) {
      challengeActions.solveChallenge07(solveOptions);
    } else if (isChallenge06Selected) {
      challengeActions.solveChallenge06(solveOptions);
    } else if (isChallenge05Selected) {
      challengeActions.solveChallenge05(solveOptions);
    } else if (isChallenge04Selected) {
      challengeActions.solveChallenge04(solveOptions);
    } else if (isChallenge03Selected) {
      challengeActions.solveChallenge03(solveOptions);
    } else if (isChallenge02Selected) {
      challengeActions.solveChallenge02(solveOptions);
    } else {
      challengeActions.solveChallenge(solveOptions);
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Shield aria-hidden="true" />
          <span>SuiSec Dojo</span>
        </div>
        <ConnectButton className="wallet-button" connectText={<WalletLabel />} />
      </header>
      <div className="locale-switch" aria-label="Language switch">
        <Languages aria-hidden="true" />
        {(["zh", "en"] as const).map((item) => (
          <button key={item} className={locale === item ? "active" : ""} type="button" onClick={() => setLocale(item)}>
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      <section className="hero">
        <div>
          <p className="eyebrow">Sui Move Security Training Ground</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroCopy}</p>
          <p className="safety-notice">{safetyNotice}</p>
          <div className="hero-actions">
            <a href="#challenges">{t.startLearning}</a>
            <a className="secondary" href="#profile">{t.viewProgress}</a>
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
          assistanceLevel={assistanceLevel}
          onAssistanceLevelChange={setAssistanceLevel}
          onExploitChallenge={
            isChallenge10Selected
              ? challengeActions.exploitChallenge10
              : isChallenge09Selected
                ? challengeActions.exploitChallenge09
                : isChallenge08Selected
                  ? challengeActions.exploitChallenge08
                  : isChallenge07Selected
                    ? challengeActions.exploitChallenge07
                    : isChallenge06Selected
              ? challengeActions.exploitChallenge06
              : isChallenge05Selected
              ? challengeActions.exploitChallenge05
              : isChallenge04Selected
              ? challengeActions.exploitChallenge04
              : isChallenge03Selected
                ? challengeActions.exploitChallenge03
                : challengeActions.withdrawChallenge02
          }
          onClaimInstance={
            isChallenge10Selected
              ? challengeActions.claimChallenge10
              : isChallenge09Selected
                ? challengeActions.claimChallenge09
                : isChallenge08Selected
                  ? challengeActions.claimChallenge08
                  : isChallenge07Selected
                    ? challengeActions.claimChallenge07
                    : isChallenge06Selected
              ? challengeActions.claimChallenge06
              : isChallenge05Selected
              ? challengeActions.claimChallenge05
              : isChallenge04Selected
              ? challengeActions.claimChallenge04
              : isChallenge03Selected
              ? challengeActions.claimChallenge03
              : isChallenge02Selected
                ? challengeActions.claimChallenge02
                : challengeActions.claimInstance
          }
          onCreateProgress={challengeActions.createProgress}
          onPracticeInputChange={setPracticeInput}
          onRunPracticeAction={runPracticeAction}
          onSolveChallenge={solveSelectedChallenge}
          onTrainingModeChange={setTrainingMode}
          onUseCapability={isChallenge05Selected ? challengeActions.setChallenge05Initialized : challengeActions.setChallenge04AdminFlag}
          packageId={packageId}
          practiceInputs={practiceInputs}
          scorePreview={scorePreview}
          statusMessage={isSolved && selectedChallenge.id === "1" ? "Challenge 01 completed on-chain." : challengeActions.statusMessage}
          trainingMode={trainingMode}
          warnings={warnings}
        />
      </section>
      <ProfilePanel summary={profile} />
      <LeaderboardPanel
        currentRank={leaderboardQuery.leaderboard.currentRank}
        entries={leaderboardQuery.leaderboard.entries}
        error={leaderboardQuery.query.error}
        isLoading={leaderboardQuery.query.isFetching}
        recent={leaderboardQuery.leaderboard.recent}
      />
      <TutorPanel
        assistanceLevel={assistanceLevel}
        challenge={selectedChallenge}
        locale={locale}
        onAssistanceLevelChange={setAssistanceLevel}
        scorePreview={scorePreview}
        trainingMode={trainingMode}
      />
      <ReportPanel />
      <PassportPanel profile={profile} />
      <section className="docs-hub" id="docs">
        <div className="section-heading">
          <FileText aria-hidden="true" />
          <h2>{t.docs}</h2>
        </div>
        <p className="safety-notice">{safetyNotice}</p>
        <div className="docs-layout">
          <div className="docs-nav">
            <h3>Challenge Statements</h3>
            {challenges.map((challenge) => (
              <button key={challenge.id} type="button" onClick={() => setSelectedDocUrl(challenge.sourceUrl ?? selectedDocUrl)}>
                {challenge.id}. {challenge.title}
              </button>
            ))}
            <h3>Incident Replays</h3>
            {replayDocs.map((doc) => (
              <button key={doc.sourceUrl} type="button" onClick={() => setSelectedDocUrl(doc.sourceUrl)}>
                {doc.title}
              </button>
            ))}
          </div>
          <div className="docs-reader">
            <MarkdownRenderer locale={locale} sourceUrl={selectedDocUrl} />
          </div>
        </div>
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
