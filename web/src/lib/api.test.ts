import { describe, expect, it, vi, afterEach } from "vitest";
import { getDashboardOverview, getTopologyServices } from "./api";

describe("dashboard api client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests dashboard overview from the versioned api route", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ summary: { total_incidents: 3 } })
    });
    (globalThis as any).fetch = fetchMock;

    await getDashboardOverview();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/dashboard/overview",
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it("throws a useful error when topology fetch fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503
    });
    (globalThis as any).fetch = fetchMock;

    await expect(getTopologyServices()).rejects.toThrow("HTTP 503");
  });
});
