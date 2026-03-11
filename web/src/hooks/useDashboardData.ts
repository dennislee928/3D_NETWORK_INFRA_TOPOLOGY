import { useEffect, useState } from "react";
import { getDashboardOverview } from "../lib/api";
import type { DashboardOverviewResponse } from "../types/dashboard";

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
        setState({ data: null, loading: false, error: message });
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return state;
}
