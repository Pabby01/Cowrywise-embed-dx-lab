/**
 * Domain types for Cowrywise Embed API & DX Starter Lab.
 * Modeled after official @cowrywise/embed-node SDK conventions.
 */

export type Currency = "NGN" | "USD";

export interface PortfolioSummary {
  customerReference: string;
  currency: Currency;
  availableBalance: number;
  investedValue: number;
  asOf: string;
  source: "synthetic-demo-data";
}

export interface AccountCreationParams {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  terms_of_use_accepted: boolean;
}

export interface Account {
  account_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: "pending_verification" | "verified" | "suspended";
  created_at: string;
  is_bvn_verified: boolean;
}

export interface IdentityUpdateParams {
  identity_type: "bvn" | "nin";
  identity_value: string;
}

export interface IdentityVerificationResult {
  account_id: string;
  identity_type: "bvn" | "nin";
  is_verified: boolean;
  message: string;
  verified_at: string;
}

export interface Wallet {
  wallet_id: string;
  account_id: string;
  currency: Currency;
  balance: number;
  locked_balance: number;
  created_at: string;
}

export type AssetCategory = "mutual_fund" | "treasury_bill" | "eurobond" | "fixed_income";
export type RiskLevel = "conservative" | "moderate" | "aggressive";

export interface InvestmentAsset {
  asset_id: string;
  name: string;
  provider: string;
  category: AssetCategory;
  currency: Currency;
  risk_level: RiskLevel;
  estimated_return_annual_pct: number;
  minimum_investment: number;
  unit_price: number;
  is_liquid: boolean;
}

export interface CreateSavingsPlanParams {
  account_id: string;
  name: string;
  target_amount: number;
  duration_months: number;
  interest_enabled: boolean;
  initial_deposit?: number;
}

export interface SavingsPlan {
  plan_id: string;
  account_id: string;
  name: string;
  target_amount: number;
  current_balance: number;
  duration_months: number;
  interest_rate_annual_pct: number;
  interest_enabled: boolean;
  start_date: string;
  maturity_date: string;
  status: "active" | "matured" | "liquidated";
}

export interface WithdrawalParams {
  wallet_id: string;
  amount: number;
  bank_code: string;
  account_number: string;
}

export interface WithdrawalRecord {
  withdrawal_id: string;
  wallet_id: string;
  amount: number;
  currency: Currency;
  bank_code: string;
  account_number: string;
  status: "intent_initiated" | "cooling_off_period" | "processing" | "completed" | "failed";
  cooling_off_expires_at: string; // 24-hour waiting period
  created_at: string;
}

export interface WebhookEvent<T = Record<string, unknown>> {
  event: string;
  data: T;
  timestamp: string;
}

export interface WebhookPayload<T = Record<string, unknown>> {
  signature: string;
  event: WebhookEvent<T>;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  computedHash: string;
  receivedSignature?: string;
  reason?: string;
}

export interface EmbedDemoClient {
  getPortfolioSummary(): Promise<PortfolioSummary>;
}
