export interface DashboardSummary {
  total_incidents: number;
  open_incidents: number;
  resolved_incidents: number;
  false_positive_incidents: number;
  total_commands: number;
  pending_commands: number;
  guarded_assets: number;
  total_decisions: number;
  automation_rate: number;
}

export interface DashboardIncident {
  id: string;
  title: string;
  severity: string;
  status: string;
  rule_id: string;
  device_id: string;
  created_at: string;
}

export interface DashboardCommand {
  id: string;
  command_type: string;
  status: string;
  risk_level: string;
  device_id: string;
  created_at: string;
}

export interface DashboardMetric {
  source: string;
  label: string;
  value: number;
  sample_size?: number;
  created_at: string;
}

export interface DashboardDecision {
  event_id: string;
  source: string;
  risk_score: number;
  incident_id?: string;
  matched_rule_ids?: string[];
  defense_commands?: Array<{
    command_id: string;
    command_type: string;
  }>;
  at: string;
}

export interface DashboardEvalRun {
  id: string;
  name: string;
  replay_file: string;
  started_at: string;
  finished_at: string;
  precision_val?: number;
  recall_val?: number;
  explanation_coverage?: number;
}

export interface TopologyHighlight {
  service_id: string;
  label: string;
  status: string;
  value: string;
}

export interface DashboardOverviewResponse {
  generated_at: string;
  summary: DashboardSummary;
  severity_breakdown: Record<string, number>;
  command_status_breakdown: Record<string, number>;
  recent_incidents: DashboardIncident[];
  recent_commands: DashboardCommand[];
  recent_decisions: DashboardDecision[];
  model_metrics: DashboardMetric[];
  recent_eval_runs: DashboardEvalRun[];
  topology_highlights: TopologyHighlight[];
  warnings: string[];
}
