export type ReportTemplateId = "challenge-writeup" | "incident-replay" | "audit-finding";

export type ReportTemplate = {
  id: ReportTemplateId;
  title: string;
  body: string;
};

export const reportTemplates: ReportTemplate[] = [
  {
    id: "challenge-writeup",
    title: "Challenge Writeup",
    body: "# Challenge Writeup\n\n## Summary\n\n## Vulnerability Pattern\n\n## Exploit Path\n\n## Fix Strategy\n\n## Tests\n",
  },
  {
    id: "incident-replay",
    title: "Incident Replay Note",
    body: "# Incident Replay Note\n\n## Background\n\n## Root Cause\n\n## Simplified Model\n\n## Defense Checklist\n\n## Related Challenges\n",
  },
  {
    id: "audit-finding",
    title: "Audit Finding",
    body: "# Audit Finding\n\n## Impact\n\n## Proof of Concept\n\n## Recommendation\n\n## Negative Tests\n",
  },
];

export function reportFilename(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "suisec-report"}.md`;
}

export async function copyMarkdownToClipboard(
  body: string,
  clipboard: Pick<Clipboard, "writeText"> | undefined = navigator.clipboard,
): Promise<"copied" | "denied"> {
  if (!clipboard?.writeText) {
    return "denied";
  }

  try {
    await clipboard.writeText(body);
    return "copied";
  } catch {
    return "denied";
  }
}
