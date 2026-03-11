import { describe, expect, it, vi, afterEach } from "vitest";

import { getDashboardOverview, getTopologyServices } from "./api";

const originalFetch = global.fetch;

describe("dashboard api client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("requests dashboard overview from the versioned api route", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ summary: { total_incidents: 3 } })
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await getDashboardOverview();

    expect(fetchMock).toHaveBeenCalledWith("/api/v1/dashboard/overview", expect.any(Object));
  });

  it("throws a useful error when topology fetch fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await expect(getTopologyServices()).rejects.toThrow("HTTP 503");
  });
});
