import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  tone: "critical" | "warning" | "stable" | "neutral";
  detail?: string;
  icon?: ReactNode;
}

export function SummaryCard({ label, value, tone, detail, icon }: Props) {
  return (
    <article className={`summary-card summary-card--${tone}`}>
      <div className="summary-card__header">
        <span className="summary-card__label">{label}</span>
        {icon ? <span className="summary-card__icon">{icon}</span> : null}
      </div>
      <div className="summary-card__value">{value}</div>
      {detail ? <p className="summary-card__detail">{detail}</p> : null}
    </article>
  );
}
