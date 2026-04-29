export function docUrlForChallenge(slug: string, doc: "statement" | "walkthrough" | "fix" | "checklist" | "source"): string {
  return `content/challenges/${slug}/${doc}.md`;
}
