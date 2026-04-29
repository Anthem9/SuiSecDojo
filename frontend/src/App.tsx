import { Navigate, Route, Routes } from "react-router-dom";
import { DojoProvider } from "./app/DojoContext";
import { AppShell } from "./components/AppShell";
import { AboutRoute } from "./routes/AboutRoute";
import { ChallengeDetailRoute } from "./routes/ChallengeDetailRoute";
import { ChallengesRoute } from "./routes/ChallengesRoute";
import { DocsRoute } from "./routes/DocsRoute";
import { HomeRoute } from "./routes/HomeRoute";
import { IncidentDetailRoute, IncidentsRoute } from "./routes/IncidentsRoute";
import { LeaderboardRoute, PassportRoute, ProfileRoute, ReportsRoute } from "./routes/ProfileRoute";

export function App() {
  return (
    <DojoProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomeRoute />} />
          <Route path="challenges" element={<ChallengesRoute />} />
          <Route path="challenges/:slug" element={<ChallengeDetailRoute />} />
          <Route path="incidents" element={<IncidentsRoute />} />
          <Route path="incidents/:slug" element={<IncidentDetailRoute />} />
          <Route path="docs" element={<DocsRoute />} />
          <Route path="leaderboard" element={<LeaderboardRoute />} />
          <Route path="profile" element={<ProfileRoute />} />
          <Route path="passport" element={<PassportRoute />} />
          <Route path="reports" element={<ReportsRoute />} />
          <Route path="about" element={<AboutRoute />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </DojoProvider>
  );
}
