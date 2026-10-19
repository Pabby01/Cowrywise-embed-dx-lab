export interface PortfolioSummary {
  customerReference: string;
  currency: "NGN";
  availableBalance: number;
  investedValue: number;
  asOf: string;
  source: "synthetic-demo-data";
}

export interface EmbedDemoClient {
  getPortfolioSummary(): Promise<PortfolioSummary>;
}
