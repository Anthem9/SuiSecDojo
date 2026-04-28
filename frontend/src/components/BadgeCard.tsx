type BadgeCardProps = {
  label: string;
};

export function BadgeCard({ label }: BadgeCardProps) {
  return <span className="badge-card">{label}</span>;
}

