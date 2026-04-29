export type RouteId = "home" | "challenges" | "incidents" | "docs" | "leaderboard" | "profile" | "passport" | "about";

export type NavItem = {
  id: RouteId;
  label: string;
  path: string;
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "challenges", label: "Challenges", path: "/challenges" },
  { id: "incidents", label: "Incidents", path: "/incidents" },
  { id: "docs", label: "Docs", path: "/docs" },
  { id: "leaderboard", label: "Leaderboard", path: "/leaderboard" },
  { id: "profile", label: "Profile", path: "/profile" },
  { id: "passport", label: "Passport", path: "/passport" },
  { id: "about", label: "About", path: "/about" },
];
