import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "./App";

vi.mock("./components/3d/SceneCanvas", async () => {
  await new Promise(resolve => setTimeout(resolve, 25));
  return {
    SceneCanvas: () => <div data-testid="scene-canvas">Topology Canvas</div>
  };
});

const originalFetch = global.fetch;

describe("App", () => {
  beforeEach(() => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/api/v1/dashboard/overview")) {
        return {
          ok: true,
          json: async () => ({
            generated_at: "2026-03-11T00:00:00Z",
            summary: {
              total_incidents: 12,
              open_incidents: 4,
              resolved_incidents: 6,
              false_positive_incidents: 2,
              total_commands: 9,
              pending_commands: 3,
              guarded_assets: 18,
              total_decisions: 15,
              automation_rate: 75
            },
            severity_breakdown: { critical: 2, high: 5, medium: 3, low: 2 },
            command_status_breakdown: { PENDING: 3, COMPLETED: 6 },
            recent_incidents: [
              {
                id: "inc-1",
                title: "Suspicious credential replay",
                severity: "critical",
                status: "OPEN",
                rule_id: "rule-17",
                device_id: "device-a",
                created_at: "2026-03-11T00:00:00Z"
              }
            ],
            recent_commands: [],
            recent_decisions: [],
            model_metrics: [],
            recent_eval_runs: [],
            topology_highlights: [{ service_id: "axiom", label: "Axiom Rule Engine", status: "degraded", value: "ELEVATED" }],
            warnings: []
          })
        };
      }

      if (url.endsWith("/api/v1/topology/services")) {
        return {
          ok: true,
          json: async () => ({
            nodes: [
              {
                id: "axiom",
                name: "Axiom Rule Engine",
                type: "rule-engine",
                layer: 2,
                status: "degraded",
                risk_score: 0.64,
                position: { x: 0, y: 0, z: 0 }
              }
            ],
            links: []
          })
        };
      }

      return { ok: false, status: 404 };
    });

    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("renders live dashboard summary and recent incident data", async () => {
    render(<App />);

    expect(screen.getByText("Loading topology workspace...")).toBeInTheDocument();
    expect(await screen.findByText("Open Incidents")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Suspicious credential replay")).toBeInTheDocument();
    expect(await screen.findByTestId("scene-canvas")).toBeInTheDocument();
  });

  it("shows a degraded-data warning when overview loading fails", async () => {
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/api/v1/dashboard/overview")) {
        return { ok: false, status: 503 };
      }
      if (url.endsWith("/api/v1/topology/services")) {
        return {
          ok: true,
          json: async () => ({ nodes: [], links: [] })
        };
      }
      return { ok: false, status: 404 };
    }) as unknown as typeof fetch;

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard data is currently unavailable/i)).toBeInTheDocument();
    });
  });
});
