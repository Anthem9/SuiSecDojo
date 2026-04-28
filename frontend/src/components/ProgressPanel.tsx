import { CheckCircle2 } from "lucide-react";
import type { ProgressSummary } from "../lib/progress";

type ProgressPanelProps = {
  accountAddress?: string;
  progress: ProgressSummary;
};

export function ProgressPanel({ accountAddress, progress }: ProgressPanelProps) {
  return (
    <aside className="progress-panel" id="profile">
      <div className="panel-icon">
        <CheckCircle2 aria-hidden="true" />
      </div>
      <p className="panel-label">Current Progress</p>
      <strong>
        {progress.completed}/{progress.total}
      </strong>
      <span>{progress.percent}% completed</span>
      <small>{accountAddress ? shortAddress(accountAddress) : "Wallet not connected"}</small>
    </aside>
  );
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
