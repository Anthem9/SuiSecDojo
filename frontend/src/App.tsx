import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DojoProvider } from "./app/DojoContext";
import { AppShell } from "./components/AppShell";

const AboutRoute = lazy(() => import("./routes/AboutRoute").then((module) => ({ default: module.AboutRoute })));
const ChallengeDetailRoute = lazy(() => import("./routes/ChallengeDetailRoute").then((module) => ({ default: module.ChallengeDetailRoute })));
const ChallengesRoute = lazy(() => import("./routes/ChallengesRoute").then((module) => ({ default: module.ChallengesRoute })));
const DocsRoute = lazy(() => import("./routes/DocsRoute").then((module) => ({ default: module.DocsRoute })));
const HomeRoute = lazy(() => import("./routes/HomeRoute").then((module) => ({ default: module.HomeRoute })));
const IncidentDetailRoute = lazy(() => import("./routes/IncidentsRoute").then((module) => ({ default: module.IncidentDetailRoute })));
const IncidentsRoute = lazy(() => import("./routes/IncidentsRoute").then((module) => ({ default: module.IncidentsRoute })));
const LeaderboardRoute = lazy(() => import("./routes/ProfileRoute").then((module) => ({ default: module.LeaderboardRoute })));
const PassportRoute = lazy(() => import("./routes/ProfileRoute").then((module) => ({ default: module.PassportRoute })));
const ProfileRoute = lazy(() => import("./routes/ProfileRoute").then((module) => ({ default: module.ProfileRoute })));
const ReportsRoute = lazy(() => import("./routes/ProfileRoute").then((module) => ({ default: module.ReportsRoute })));

export function App() {
  return (
    <DojoProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<LazyPage><HomeRoute /></LazyPage>} />
          <Route path="challenges" element={<LazyPage><ChallengesRoute /></LazyPage>} />
          <Route path="challenges/:slug" element={<LazyPage><ChallengeDetailRoute /></LazyPage>} />
          <Route path="incidents" element={<LazyPage><IncidentsRoute /></LazyPage>} />
          <Route path="incidents/:slug" element={<LazyPage><IncidentDetailRoute /></LazyPage>} />
          <Route path="docs" element={<LazyPage><DocsRoute /></LazyPage>} />
          <Route path="leaderboard" element={<LazyPage><LeaderboardRoute /></LazyPage>} />
          <Route path="profile" element={<LazyPage><ProfileRoute /></LazyPage>} />
          <Route path="passport" element={<LazyPage><PassportRoute /></LazyPage>} />
          <Route path="reports" element={<LazyPage><ReportsRoute /></LazyPage>} />
          <Route path="about" element={<LazyPage><AboutRoute /></LazyPage>} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </DojoProvider>
  );
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="route-loading">Loading...</div>}>{children}</Suspense>;
}
