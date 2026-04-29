export type RouteId = "home" | "challenges" | "incidents" | "docs" | "leaderboard" | "profile" | "about" | "faucet";

export type NavItem = {
  id: RouteId;
  labelKey:
    | "navHome"
    | "navChallenges"
    | "navIncidents"
    | "navDocs"
    | "navLeaderboard"
    | "navProfile"
    | "navFaucet"
    | "navAbout";
  path: string;
  external?: boolean;
};

export const navItems: NavItem[] = [
  { id: "home", labelKey: "navHome", path: "/" },
  { id: "challenges", labelKey: "navChallenges", path: "/challenges" },
  { id: "incidents", labelKey: "navIncidents", path: "/incidents" },
  { id: "docs", labelKey: "navDocs", path: "/docs" },
  { id: "leaderboard", labelKey: "navLeaderboard", path: "/leaderboard" },
  { id: "profile", labelKey: "navProfile", path: "/profile" },
  { id: "faucet", labelKey: "navFaucet", path: "https://faucet.sui.io/", external: true },
  { id: "about", labelKey: "navAbout", path: "/about" },
];
