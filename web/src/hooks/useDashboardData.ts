import { useEffect, useState } from "react";
import { getDashboardOverview } from "../lib/api";
import type { DashboardOverviewResponse } from "../types/dashboard";

/** Fallback mock when /api/v1/dashboard/overview is unavailable (e.g. 404). */
const FALLBACK_DASHBOARD: DashboardOverviewResponse = {
  generated_at: new Date().toISOString(),
  summary: {
    total_incidents: 0,
    open_incidents: 0,
    resolved_incidents: 0,
    false_positive_incidents: 0,
    total_commands: 0,
    pending_commands: 0,
    guarded_assets: 0,
    total_decisions: 0,
    automation_rate: 0
  },
  severity_breakdown: {},
  command_status_breakdown: {},
  recent_incidents: [],
  recent_commands: [],
  recent_decisions: [],
  model_metrics: [],
  recent_eval_runs: [],
  topology_highlights: [],
  warnings: []
};

interface DashboardState {
  data: DashboardOverviewResponse | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardState {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const data = await getDashboardOverview();
        if (controller.signal.aborted) return;
        setState({ data, loading: false, error: null });
      } catch (error) {
        if (controller.signal.aborted) return;
        const message = error instanceof Error ? error.message : String(error);
        setState({
          data: FALLBACK_DASHBOARD,
          loading: false,
          error: message
        });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return state;
}
