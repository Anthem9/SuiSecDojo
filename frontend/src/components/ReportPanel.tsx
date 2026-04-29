import { Download, FilePenLine } from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { copyMarkdownToClipboard, reportFilename, reportTemplates } from "../lib/reportTemplates";

export function ReportPanel() {
  const [templateId, setTemplateId] = useState(reportTemplates[0].id);
  const template = useMemo(() => reportTemplates.find((item) => item.id === templateId) ?? reportTemplates[0], [templateId]);
  const [body, setBody] = useState(template.body);
  const [copyMessage, setCopyMessage] = useState("");

  function selectTemplate(nextTemplateId: string) {
    const next = reportTemplates.find((item) => item.id === nextTemplateId) ?? reportTemplates[0];
    setTemplateId(next.id);
    setBody(next.body);
    setCopyMessage("");
  }

  function downloadReport() {
    const blob = new Blob([body], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = reportFilename(template.title);
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="tool-panel" id="reports">
      <div className="section-heading">
        <FilePenLine aria-hidden="true" />
        <h2>Report Training</h2>
      </div>
      <p className="section-copy">Draft locally in your browser. Reports are not uploaded and are not automatically scored.</p>
      <div className="report-controls">
        <select value={templateId} onChange={(event) => selectTemplate(event.target.value)}>
          {reportTemplates.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={async () => {
            const result = await copyMarkdownToClipboard(body);
            setCopyMessage(
              result === "copied"
                ? "Markdown copied."
                : "Copy failed: browser denied clipboard permission. Select the text and copy manually.",
            );
          }}
        >
          Copy Markdown
        </button>
        <button type="button" onClick={downloadReport}>
          <Download aria-hidden="true" />
          Download
        </button>
      </div>
      {copyMessage ? <p className="status-line">{copyMessage}</p> : null}
      <div className="report-grid">
        <textarea value={body} onChange={(event) => setBody(event.target.value)} />
        <div className="markdown-body report-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
