import { describe, expect, it } from "vitest";
import { createMockEmbedClient } from "../src/embed-client.js";
import { loadConfig } from "../src/config.js";

describe("mock Embed adapter", () => {
  it("returns clearly labelled synthetic portfolio data", async () => {
    const result = await createMockEmbedClient().getPortfolioSummary();
    expect(result.source).toBe("synthetic-demo-data");
    expect(result.currency).toBe("NGN");
    expect(result.availableBalance).toBeGreaterThanOrEqual(0);
    expect(result.investedValue).toBeGreaterThanOrEqual(0);
  });

  it("defaults to mock mode without requiring credentials", () => {
    expect(loadConfig({}).mode).toBe("mock");
  });

  it("rejects unimplemented live mode rather than implying live support", () => {
    expect(() => loadConfig({ DEMO_MODE: "live" })).toThrow(/only supports DEMO_MODE="mock"/);
  });
});
