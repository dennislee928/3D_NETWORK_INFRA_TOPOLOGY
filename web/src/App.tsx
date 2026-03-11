import { lazy, Suspense } from "react";
import { SectionPanel } from "./components/dashboard/SectionPanel";
import { SummaryCard } from "./components/dashboard/SummaryCard";
import { useDashboardData } from "./hooks/useDashboardData";
import { useTopologyData } from "./hooks/useTopologyData";
import { ServiceDetailsPanel } from "./panels/ServiceDetailsPanel";

const SceneCanvas = lazy(async () => {
  const mod = await import("./components/3d/SceneCanvas");
  return { default: mod.SceneCanvas };
});

function formatCompact(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

function formatPercent(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";
  return `${Math.round(value)}%`;
}

function formatTimestamp(value?: string) {
  if (!value) return "No recent update";
  return new Date(value).toLocaleString();
}

export function App() {
  const dashboard = useDashboardData();
  const topology = useTopologyData();

  const summary = dashboard.data?.summary;
  const warnings = [
    ...(dashboard.data?.warnings ?? []),
    ...(dashboard.error ? [`Dashboard data is currently unavailable (${dashboard.error}).`] : []),
    ...(topology.error ? [`Topology fallback is active (${topology.error}).`] : [])
  ];

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">AXIOM SIEM</p>
          <h1>Operational command view for detections, automations, and service health.</h1>
          <p className="hero-copy">
            This console now pulls live dashboard and topology payloads from Axiom instead of relying on
            hardcoded scene data.
          </p>
        </div>
        <div className="hero-meta">
          <span className="hero-meta__label">Last refresh</span>
          <strong>{formatTimestamp(dashboard.data?.generated_at)}</strong>
        </div>
      </header>

      {warnings.length > 0 ? (
        <div className="status-banner" role="status">
          {warnings.map(warning => (
            <span key={warning}>{warning}</span>
          ))}
        </div>
      ) : null}

      <section className="summary-grid">
        <SummaryCard
          label="Open Incidents"
          value={dashboard.loading ? "..." : formatCompact(summary?.open_incidents)}
          tone="critical"
          detail="Investigations currently in motion across the fleet."
        />
        <SummaryCard
          label="Pending Commands"
          value={dashboard.loading ? "..." : formatCompact(summary?.pending_commands)}
          tone="warning"
          detail="Queued or awaiting acknowledgement from downstream responders."
        />
        <SummaryCard
          label="Guarded Assets"
          value={dashboard.loading ? "..." : formatCompact(summary?.guarded_assets)}
          tone="stable"
          detail="Distinct assets touched by recent incident activity."
        />
        <SummaryCard
          label="Automation Rate"
          value={dashboard.loading ? "..." : formatPercent(summary?.automation_rate)}
          tone="neutral"
          detail="Commands issued per incident over the current dashboard window."
        />
      </section>

      <main className="dashboard-grid">
        <div className="dashboard-main">
          <SectionPanel
            title="Incident Queue"
            subtitle="Most recent detections promoted into Axiom incidents."
            aside={<span className="panel-pill">{dashboard.data?.recent_incidents.length ?? 0} tracked</span>}
          >
            {dashboard.data?.recent_incidents.length ? (
              <div className="stack-list">
                {dashboard.data.recent_incidents.map(incident => (
                  <article key={incident.id} className="stack-list__item">
                    <div>
                      <h3>{incident.title}</h3>
                      <p>
                        {incident.device_id} · {incident.rule_id || "rule unavailable"}
                      </p>
                    </div>
                    <div className="stack-list__meta">
                      <span className={`status-chip status-chip--${incident.severity}`}>{incident.severity}</span>
                      <span>{incident.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No incident records are available from the dashboard endpoint yet.</p>
            )}
          </SectionPanel>

          <SectionPanel
            title="Command Pipeline"
            subtitle="Recently issued defense actions and their current execution state."
            aside={<span className="panel-pill">{summary?.total_commands ?? 0} total</span>}
          >
            {dashboard.data?.recent_commands.length ? (
              <div className="stack-list">
                {dashboard.data.recent_commands.map(command => (
                  <article key={command.id} className="stack-list__item">
                    <div>
                      <h3>{command.command_type}</h3>
                      <p>{command.device_id || "unassigned target"}</p>
                    </div>
                    <div className="stack-list__meta">
                      <span className="status-chip status-chip--neutral">{command.risk_level}</span>
                      <span>{command.status}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No recent command activity was returned by the API.</p>
            )}
          </SectionPanel>

          <SectionPanel
            title="Threat Topology"
            subtitle="Live service graph backed by the new topology endpoint."
            aside={<span className="panel-pill">{topology.nodes.length} services</span>}
          >
            <div className="topology-layout">
              <div className="topology-stage">
                <Suspense fallback={<div className="topology-loading">Loading topology workspace...</div>}>
                  <SceneCanvas
                    nodes={topology.nodes}
                    links={topology.links}
                    loading={topology.loading}
                    error={topology.error}
                  />
                </Suspense>
              </div>
              <div className="topology-sidebar">
                <ServiceDetailsPanel nodes={topology.nodes} />
              </div>
            </div>
          </SectionPanel>
        </div>

        <aside className="dashboard-side">
          <SectionPanel
            title="Severity Mix"
            subtitle="Distribution of current incident severities."
          >
            <div className="metric-bars">
              {Object.entries(dashboard.data?.severity_breakdown ?? {}).map(([severity, value]) => (
                <div key={severity} className="metric-bars__row">
                  <div className="metric-bars__label">
                    <span>{severity}</span>
                    <strong>{value}</strong>
                  </div>
                  <div className="metric-bars__track">
                    <div
                      className={`metric-bars__fill metric-bars__fill--${severity}`}
                      style={{ width: `${Math.min(100, value * 12)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>

          <SectionPanel
            title="Model Signals"
            subtitle="Latest model evaluation metrics surfaced from Axiom."
          >
            {dashboard.data?.model_metrics.length ? (
              <div className="signal-grid">
                {dashboard.data.model_metrics.map(metric => (
                  <article key={`${metric.source}-${metric.label}`} className="signal-card">
                    <span>{metric.source}</span>
                    <strong>{metric.label}</strong>
                    <div>{metric.value.toFixed(2)}</div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">Model evaluation metrics have not been recorded yet.</p>
            )}
          </SectionPanel>

          <SectionPanel
            title="Topology Highlights"
            subtitle="Fast scan of services with the strongest signals."
          >
            {dashboard.data?.topology_highlights.length ? (
              <div className="highlight-list">
                {dashboard.data.topology_highlights.map(item => (
                  <article key={item.service_id} className="highlight-list__item">
                    <div>
                      <h3>{item.label}</h3>
                      <p>{item.value}</p>
                    </div>
                    <span className={`status-chip status-chip--${item.status}`}>{item.status}</span>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state">No topology highlights are available yet.</p>
            )}
          </SectionPanel>
        </aside>
      </main>
    </div>
  );
}
