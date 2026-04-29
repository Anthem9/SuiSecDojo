import { useDojo } from "../app/DojoContext";

type BadgeCardProps = {
  label: string;
  badgeType?: string;
  objectId?: string;
  issuedAtEpoch?: string;
  requirement?: string;
};

export function BadgeCard({ badgeType, issuedAtEpoch, label, objectId, requirement }: BadgeCardProps) {
  const { locale } = useDojo();
  return (
    <article className="badge-card">
      <strong>{label}</strong>
      {badgeType ? <span>{locale === "zh" ? `类型 ${badgeType}` : `Type ${badgeType}`}</span> : null}
      {objectId ? <small>{objectId}</small> : null}
      {issuedAtEpoch ? <small>{locale === "zh" ? `铸造 epoch ${issuedAtEpoch}` : `Minted epoch ${issuedAtEpoch}`}</small> : null}
      {requirement ? <small>{requirement}</small> : null}
    </article>
  );
}
