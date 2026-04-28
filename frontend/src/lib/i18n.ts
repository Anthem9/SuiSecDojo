export type Locale = "en" | "zh";

export const dictionaries = {
  en: {
    heroTitle: "Sui Move Security Dojo",
    heroCopy: "Browse challenges, claim on-chain instances, solve with Sui transactions, and keep progress on-chain.",
    startLearning: "Start Learning",
    viewProgress: "View Progress",
    docs: "Docs",
    leaderboard: "Leaderboard",
    tutor: "Tutor Mode",
    report: "Report Training",
    passport: "Security Passport",
  },
  zh: {
    heroTitle: "Sui Move 安全训练场",
    heroCopy: "浏览挑战、领取链上实例、通过 Sui 交易完成判题，并把学习进度写入链上对象。",
    startLearning: "开始学习",
    viewProgress: "查看进度",
    docs: "文档",
    leaderboard: "排行榜",
    tutor: "导师模式",
    report: "报告训练",
    passport: "安全护照",
  },
} satisfies Record<Locale, Record<string, string>>;

export function localizedContentCandidates(sourceUrl: string | undefined, locale: Locale): string[] {
  if (!sourceUrl) return [];
  const normalized = sourceUrl.startsWith("/") ? sourceUrl.slice(1) : sourceUrl;
  if (!normalized.startsWith("content/")) return [`/${normalized}`];
  const withoutContent = normalized.slice("content/".length);
  return [`/content/${locale}/${withoutContent}`, `/${normalized}`];
}

