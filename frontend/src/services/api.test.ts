import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  aiApi,
  authApi,
  leaderboardApi,
  notificationsApi,
  reportsApi,
  statsApi,
  usersApi,
} from "./api";

// Node 22+ provides a broken built-in localStorage; stub with a proper implementation
const store: Record<string, string> = {};
const storageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { for (const k of Object.keys(store)) delete store[k]; },
  get length() { return Object.keys(store).length; },
  key: (i: number) => Object.keys(store)[i] ?? null,
};

describe("api client", () => {
  beforeEach(() => {
    storageMock.clear();
    vi.stubGlobal("localStorage", storageMock);
    vi.restoreAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("sends login request with expected payload", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ accessToken: "abc" }),
    });

    const result = await authApi.login("demo@mail.com", "secret");

    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "demo@mail.com", password: "secret" }),
      }),
    );
    expect(result).toEqual({ accessToken: "abc" });
  });

  it("adds bearer token when token exists", async () => {
    localStorage.setItem("cw_token", "token-123");
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "usr_1" }),
    });

    await usersApi.getMe();

    expect(fetch).toHaveBeenCalledWith(
      "/api/users/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
        }),
      }),
    );
  });

  it("builds report query string and skips nullish values", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    });

    await reportsApi.list({ status: "open", district: null as unknown as string, page: "1" });

    expect(fetch).toHaveBeenCalledWith(
      "/api/reports?status=open&page=1",
      expect.any(Object),
    );
  });

  it("returns null for 204 responses", async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 204,
    });

    const result = await authApi.logout();

    expect(result).toBeNull();
  });

  it("throws backend error message for non-ok responses", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: "Invalid payload" }),
    });

    await expect(authApi.register({} as Record<string, string>)).rejects.toThrow("Invalid payload");
  });

  it("clears token and exits early on unauthorized responses", async () => {
    storageMock.setItem("cw_token", "expired");
    const removeSpy = vi.spyOn(storageMock, "removeItem");
    vi.stubGlobal("location", { ...window.location, reload: vi.fn() });
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
      json: vi.fn(),
    });

    const result = await usersApi.getMe();

    expect(removeSpy).toHaveBeenCalledWith("cw_token");
    expect(result).toBeUndefined();
  });

  it("calls report claim endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ ok: true }),
    } as unknown as Response);

    await reportsApi.claim(123);

    expect(fetch).toHaveBeenCalledWith(
      "/api/reports/123/claim",
      expect.objectContaining({ method: "PATCH" }),
    );
  });

  it("calls report complete endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ ok: true }),
    } as unknown as Response);

    const payload = new FormData();
    await reportsApi.complete(44, payload);

    expect(fetch).toHaveBeenCalledWith(
      "/api/reports/44/complete",
      expect.objectContaining({ method: "POST", body: payload }),
    );
  });

  it("calls leaderboard endpoint with defaults", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ content: [] }),
    } as unknown as Response);

    await leaderboardApi.get();

    expect(fetch).toHaveBeenCalledWith(
      "/api/leaderboard?period=week&page=0&size=20",
      expect.any(Object),
    );
  });

  it("calls stats endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ totalCleaned: 1 }),
    } as unknown as Response);

    await statsApi.getGlobal();

    expect(fetch).toHaveBeenCalledWith(
      "/api/stats/global",
      expect.any(Object),
    );
  });

  it("calls notifications unread filter endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue([]),
    } as unknown as Response);

    await notificationsApi.list(true);

    expect(fetch).toHaveBeenCalledWith(
      "/api/notifications?unread=true",
      expect.any(Object),
    );
  });

  it("calls AI verify image endpoint", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ valid: true }),
    } as unknown as Response);

    const payload = new FormData();
    await aiApi.verifyImage(payload);

    expect(fetch).toHaveBeenCalledWith(
      "/api/verifications/check-image",
      expect.objectContaining({ method: "POST", body: payload }),
    );
  });
});
