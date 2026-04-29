import { Link, useParams } from "react-router-dom";
import { useDojo } from "../app/DojoContext";
import { ChallengeDetailPanel } from "../components/ChallengeDetailPanel";
import { TutorPanel } from "../components/TutorPanel";
import { challenges } from "../data/challenges";
import { getChallengeBySlug } from "../lib/challengeFilters";

export function ChallengeDetailRoute() {
  const { slug = challenges[0]?.slug ?? "" } = useParams();
  const challenge = getChallengeBySlug(challenges, slug) ?? challenges[0];
  const dojo = useDojo();
  const statusMessage =
    dojo.isSolved && challenge.id === "1" ? "Challenge 01 completed on-chain." : dojo.challengeActions.statusMessage;

  if (challenge.status === "coming-soon") {
    return (
      <section className="page-section">
        <Link className="back-link" to="/challenges">
          Back to challenges
        </Link>
        <article className="detail-panel">
          <span className="difficulty">{challenge.difficulty}</span>
          <h1>{challenge.title}</h1>
          <p>{challenge.description}</p>
          <p className="status-line warning">
            This challenge is on the public roadmap. It is intentionally not claimable until the Move module, tests, frontend
            parser, transaction builder, docs, and testnet deployment are complete.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="page-section challenge-detail-page">
      <Link className="back-link" to="/challenges">
        Back to challenges
      </Link>
      <ChallengeDetailPanel
        actionState={dojo.actionStateFor(challenge)}
        assistanceLevel={dojo.assistanceLevel}
        chainState={dojo.chainState}
        challenge={challenge}
        lastDigest={dojo.challengeActions.lastDigest}
        objectError={dojo.ownedObjectsQuery.error ?? dojo.challenge02VaultQuery.error}
        onAssistanceLevelChange={dojo.setAssistanceLevel}
        onClaimInstance={() => dojo.claimChallenge(challenge)}
        onCreateProgress={dojo.challengeActions.createProgress}
        onExploitChallenge={() => dojo.runPracticeAction(challenge)}
        onPracticeInputChange={dojo.setPracticeInput}
        onRunPracticeAction={() => dojo.runPracticeAction(challenge)}
        onSolveChallenge={() => dojo.solveChallenge(challenge)}
        onTrainingModeChange={dojo.setTrainingMode}
        onUseCapability={() => dojo.useCapability(challenge)}
        packageId={dojo.packageId}
        practiceInputs={dojo.practiceInputs}
        scorePreview={dojo.scorePreviewFor(challenge)}
        statusMessage={statusMessage}
        trainingMode={dojo.trainingMode}
        warnings={dojo.warnings}
      />
      <TutorPanel
        assistanceLevel={dojo.assistanceLevel}
        challenge={challenge}
        locale={dojo.locale}
        onAssistanceLevelChange={dojo.setAssistanceLevel}
        scorePreview={dojo.scorePreviewFor(challenge)}
        trainingMode={dojo.trainingMode}
      />
    </section>
  );
}
