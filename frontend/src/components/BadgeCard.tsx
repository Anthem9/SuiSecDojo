type BadgeCardProps = {
  label: string;
  badgeType?: string;
  objectId?: string;
  issuedAtEpoch?: string;
  requirement?: string;
};

export function BadgeCard({ badgeType, issuedAtEpoch, label, objectId, requirement }: BadgeCardProps) {
  return (
    <article className="badge-card">
      <strong>{label}</strong>
      {badgeType ? <span>Type {badgeType}</span> : null}
      {objectId ? <small>{objectId}</small> : null}
      {issuedAtEpoch ? <small>Issued epoch {issuedAtEpoch}</small> : null}
      {requirement ? <small>{requirement}</small> : null}
    </article>
  );
}
