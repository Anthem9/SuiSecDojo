import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";
import { externalLinkProps, markdownSourceUrl } from "../lib/markdown";

type MarkdownRendererProps = {
  sourceUrl?: string;
};

type MarkdownState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; markdown: string }
  | { kind: "failed"; message: string };

export function MarkdownRenderer({ sourceUrl }: MarkdownRendererProps) {
  const [state, setState] = useState<MarkdownState>({ kind: "idle" });
  const normalizedUrl = markdownSourceUrl(sourceUrl);

  useEffect(() => {
    if (!normalizedUrl) {
      setState({ kind: "failed", message: "Challenge documentation is not configured." });
      return;
    }

    let cancelled = false;
    setState({ kind: "loading" });
    fetch(normalizedUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load ${normalizedUrl}`);
        return response.text();
      })
      .then((markdown) => {
        if (!cancelled) setState({ kind: "ready", markdown });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ kind: "failed", message: error instanceof Error ? error.message : "Failed to load documentation." });
      });

    return () => {
      cancelled = true;
    };
  }, [normalizedUrl]);

  if (state.kind === "loading") return <p className="markdown-status">Loading documentation...</p>;
  if (state.kind === "failed") return <p className="markdown-status error">{state.message}</p>;
  if (state.kind !== "ready" || !state.markdown.trim()) return <p className="markdown-status">No documentation available.</p>;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} {...externalLinkProps(href)}>
              {children}
            </a>
          ),
        }}
      >
        {state.markdown}
      </ReactMarkdown>
    </div>
  );
}

