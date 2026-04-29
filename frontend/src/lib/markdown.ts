export function markdownSourceUrl(sourceUrl?: string): string | undefined {
  if (!sourceUrl) return undefined;
  return sourceUrl.startsWith("/") ? sourceUrl : `/${sourceUrl}`;
}

export function externalLinkProps(href?: string): { target?: string; rel?: string } {
  if (!href || href.startsWith("/") || href.startsWith("#")) return {};
  return { target: "_blank", rel: "noreferrer" };
}

export function isMarkdownPayload(text: string, contentType?: string | null): boolean {
  const normalizedType = contentType?.toLowerCase() ?? "";
  const trimmed = text.trimStart().toLowerCase();

  if (normalizedType.includes("text/html")) return false;
  if (trimmed.startsWith("<!doctype html") || trimmed.startsWith("<html")) return false;
  if (trimmed.includes("/@vite/client") || trimmed.includes("/src/main.tsx")) return false;

  return true;
}
