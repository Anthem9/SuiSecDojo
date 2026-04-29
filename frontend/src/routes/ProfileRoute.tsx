import { LeaderboardPanel } from "../components/LeaderboardPanel";
import { PassportPanel } from "../components/PassportPanel";
import { ProfilePanel } from "../components/ProfilePanel";
import { ReportPanel } from "../components/ReportPanel";
import { useDojo } from "../app/DojoContext";

export function ProfileRoute() {
  const { dojoPassNetworkMessage, mintBadge, profile } = useDojo();
  return (
    <section className="page-section profile-passport-page">
      <ProfilePanel dojoPassNetworkMessage={dojoPassNetworkMessage} onMintBadge={mintBadge} summary={profile} />
      <PassportPanel profile={profile} />
    </section>
  );
}

export function LeaderboardRoute() {
  const { leaderboardQuery } = useDojo();
  return (
    <section className="page-section">
      <LeaderboardPanel
        currentRank={leaderboardQuery.leaderboard.currentRank}
        entries={leaderboardQuery.leaderboard.entries}
        error={leaderboardQuery.query.error}
        isLoading={leaderboardQuery.query.isFetching}
        recent={leaderboardQuery.leaderboard.recent}
      />
    </section>
  );
}

export function PassportRoute() {
  const { dojoPassNetworkMessage, mintBadge, profile } = useDojo();
  return (
    <section className="page-section profile-passport-page">
      <ProfilePanel dojoPassNetworkMessage={dojoPassNetworkMessage} onMintBadge={mintBadge} summary={profile} />
      <PassportPanel profile={profile} />
    </section>
  );
}

export function ReportsRoute() {
  return (
    <section className="page-section">
      <ReportPanel />
    </section>
  );
}
