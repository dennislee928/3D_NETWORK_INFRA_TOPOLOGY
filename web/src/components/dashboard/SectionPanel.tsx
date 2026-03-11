import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function SectionPanel({ title, subtitle, aside, children }: Props) {
  return (
    <section className="section-panel">
      <header className="section-panel__header">
        <div>
          <h2 className="section-panel__title">{title}</h2>
          {subtitle ? <p className="section-panel__subtitle">{subtitle}</p> : null}
        </div>
        {aside ? <div className="section-panel__aside">{aside}</div> : null}
      </header>
      <div className="section-panel__body">{children}</div>
    </section>
  );
}
