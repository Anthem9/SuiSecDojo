export type RouteId = "home" | "challenges" | "incidents" | "docs" | "leaderboard" | "profile" | "about";

export type NavItem = {
  id: RouteId;
  labelKey: "navHome" | "navChallenges" | "navIncidents" | "navDocs" | "navLeaderboard" | "navProfile" | "navAbout";
  path: string;
};

export const navItems: NavItem[] = [
  { id: "home", labelKey: "navHome", path: "/" },
  { id: "challenges", labelKey: "navChallenges", path: "/challenges" },
  { id: "incidents", labelKey: "navIncidents", path: "/incidents" },
  { id: "docs", labelKey: "navDocs", path: "/docs" },
  { id: "leaderboard", labelKey: "navLeaderboard", path: "/leaderboard" },
  { id: "profile", labelKey: "navProfile", path: "/profile" },
  { id: "about", labelKey: "navAbout", path: "/about" },
];
