import type { EmbedDemoClient, PortfolioSummary } from "./types.js";

/**
 * Synthetic demo adapter.
 * This does not call Cowrywise. The interface is an architectural seam for a
 * future separately validated live adapter, not an official SDK/API method.
 */
export function createMockEmbedClient(): EmbedDemoClient {
  return {
    async getPortfolioSummary(): Promise<PortfolioSummary> {
      return {
        customerReference: "demo-customer-001",
        currency: "NGN",
        availableBalance: 125_000,
        investedValue: 350_000,
        asOf: "2026-10-18T12:00:00.000Z",
        source: "synthetic-demo-data"
      };
    }
  };
}
