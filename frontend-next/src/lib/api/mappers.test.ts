import { describe, expect, it } from "vitest";
import { mapApiUser, mapApiReport, deriveLevel } from "./mappers";

describe("deriveLevel", () => {
  it("returns НОВИЧ for 0-499 points", () => {
    expect(deriveLevel(0)).toMatchObject({ level: "НОВИЧ", levelIcon: "sprout", nextLevelPts: 500 });
    expect(deriveLevel(499)).toMatchObject({ level: "НОВИЧ" });
  });
  it("returns АКТИВЕН for 500-1499", () => {
    expect(deriveLevel(500).level).toBe("АКТИВЕН");
    expect(deriveLevel(1499).level).toBe("АКТИВЕН");
  });
  it("returns ПРО / МАСТЪР / ЛЕГЕНДА at the right thresholds", () => {
    expect(deriveLevel(1500).level).toBe("ПРО");
    expect(deriveLevel(3000).level).toBe("МАСТЪР");
    expect(deriveLevel(5000).level).toBe("ЛЕГЕНДА");
  });
});

describe("mapApiUser", () => {
  it("maps API user fields and derives level", () => {
    const u = mapApiUser({
      id: "u1",
      username: "TestUser",
      email: "t@x",
      points: 250,
      streak: 3,
      role: "VerifiedUser",
      cleanings: 2,
      reports: 4,
      createdAt: "2025-09-12T10:00:00Z",
    });
    expect(u.id).toBe("u1");
    expect(u.name).toBe("TestUser");
    expect(u.points).toBe(250);
    expect(u.level).toBe("НОВИЧ");
    expect(u.verified).toBe(true);
    expect(u.avatar).toBe("TE");
  });

  it("falls back gracefully when fields missing", () => {
    const u = mapApiUser({});
    expect(u.id).toBe("");
    expect(u.name).toBe("");
    expect(u.avatar).toBe("??");
    expect(u.points).toBe(0);
    expect(u.verified).toBe(false);
  });
});

describe("mapApiReport", () => {
  it("maps fields and normalizes status", () => {
    const r = mapApiReport({
      reportId: "r-1",
      description: "Препълнен контейнер пред блок 24, отпадъци разпилени по тротоара",
      latitude: 42.7,
      longitude: 23.3,
      district: "Лозенец",
      status: "IN_PROGRESS",
      severity: "high",
      reporterName: "EcoMaria",
      createdAt: "2026-05-17T09:12:00Z",
    });
    expect(r.id).toBe("r-1");
    expect(r.status).toBe("in-progress");
    expect(r.severity).toBe("high");
    expect(r.lat).toBeCloseTo(42.7);
    expect(r.gps).toEqual({ lat: 42.7, lng: 23.3 });
    expect(r.title.length).toBeLessThanOrEqual(50);
    expect(r.reporterAvatar).toBe("EC");
  });

  it("normalizes DONE -> done, OPEN -> open, defaults to open", () => {
    expect(mapApiReport({ reportId: "x", status: "DONE" }).status).toBe("done");
    expect(mapApiReport({ reportId: "x", status: "OPEN" }).status).toBe("open");
    expect(mapApiReport({ reportId: "x", status: "WEIRD" }).status).toBe("open");
  });
});
