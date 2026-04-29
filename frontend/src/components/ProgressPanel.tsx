import { CheckCircle2 } from "lucide-react";
import { useDojo } from "../app/DojoContext";
import type { ProgressSummary } from "../lib/progress";

type ProgressPanelProps = {
  accountAddress?: string;
  progress: ProgressSummary;
};

export function ProgressPanel({ accountAddress, progress }: ProgressPanelProps) {
  const { t } = useDojo();

  return (
    <aside className="progress-panel" id="profile">
      <div className="panel-icon">
        <CheckCircle2 aria-hidden="true" />
      </div>
      <p className="panel-label">{t.currentProgress}</p>
      <strong>
        {progress.completed}/{progress.total}
      </strong>
      <span>
        {progress.percent}% {t.percentCompleted}
      </span>
      <small>{accountAddress ? shortAddress(accountAddress) : t.walletNotConnected}</small>
    </aside>
  );
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
