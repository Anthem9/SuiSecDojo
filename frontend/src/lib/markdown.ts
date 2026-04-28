export function markdownSourceUrl(sourceUrl?: string): string | undefined {
  if (!sourceUrl) return undefined;
  return sourceUrl.startsWith("/") ? sourceUrl : `/${sourceUrl}`;
}

export function externalLinkProps(href?: string): { target?: string; rel?: string } {
  if (!href || href.startsWith("/") || href.startsWith("#")) return {};
  return { target: "_blank", rel: "noreferrer" };
}

