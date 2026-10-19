import type {
  Account,
  AccountCreationParams,
  EmbedDemoClient,
  IdentityUpdateParams,
  IdentityVerificationResult,
  InvestmentAsset,
  PortfolioSummary,
  SavingsPlan,
  CreateSavingsPlanParams,
  Wallet,
  WithdrawalParams,
  WithdrawalRecord,
  WebhookPayload,
  WebhookVerificationResult
} from "./types.js";
import {
  InvalidBvnError,
  UnverifiedAccountError,
  InsufficientWalletBalanceError,
  WithdrawalLockedError
} from "./errors.js";
import {
  verifyCowrywiseWebhookSignature,
  createMockWebhookPayload
} from "./webhook-verifier.js";

export interface CowrywiseEmbedClient extends EmbedDemoClient {
  accounts: {
    createAccount(params: AccountCreationParams): Promise<Account>;
    getAccount(accountId: string): Promise<Account>;
    updateIdentity(accountId: string, params: IdentityUpdateParams): Promise<IdentityVerificationResult>;
  };
  wallets: {
    getWallets(accountId?: string): Promise<Wallet[]>;
    getWallet(walletId: string): Promise<Wallet>;
    fundWallet(walletId: string, amount: number): Promise<Wallet>;
  };
  assets: {
    getAssets(): Promise<InvestmentAsset[]>;
    getAsset(assetId: string): Promise<InvestmentAsset>;
    investInAsset(params: {
      accountId: string;
      assetId: string;
      amount: number;
    }): Promise<{ transaction_id: string; asset_id: string; amount: number; units: number }>;
  };
  savings: {
    getSavings(accountId?: string): Promise<SavingsPlan[]>;
    createSavingsPlan(params: CreateSavingsPlanParams): Promise<SavingsPlan>;
  };
  withdrawals: {
    requestWithdrawal(params: WithdrawalParams): Promise<WithdrawalRecord>;
    getWithdrawal(withdrawalId: string): Promise<WithdrawalRecord>;
  };
  webhooks: {
    verifySignature(params: {
      clientId: string;
      clientSecret: string;
      receivedSignature?: string;
    }): WebhookVerificationResult;
    createMockPayload<T extends Record<string, unknown>>(
      eventType: string,
      data: T,
      clientId?: string,
      clientSecret?: string
    ): WebhookPayload<T>;
  };
}

/**
 * Curated catalog of synthetic investment assets matching Cowrywise Embed product tiers.
 */
export const SYNTHETIC_ASSETS: InvestmentAsset[] = [
  {
    asset_id: "ast_mmf_001",
    name: "Cowrywise Money Market Fund",
    provider: "United Capital Asset Management",
    category: "mutual_fund",
    currency: "NGN",
    risk_level: "conservative",
    estimated_return_annual_pct: 16.5,
    minimum_investment: 1_000,
    unit_price: 100.0,
    is_liquid: true
  },
  {
    asset_id: "ast_tbill_002",
    name: "Federal Government Treasury Bills (182-Day)",
    provider: "Debt Management Office (DMO)",
    category: "treasury_bill",
    currency: "NGN",
    risk_level: "conservative",
    estimated_return_annual_pct: 18.2,
    minimum_investment: 50_000,
    unit_price: 1_000.0,
    is_liquid: false
  },
  {
    asset_id: "ast_eurobond_003",
    name: "Nigeria Sovereign Eurobond Fund",
    provider: "Stanbic IBTC Asset Management",
    category: "eurobond",
    currency: "USD",
    risk_level: "moderate",
    estimated_return_annual_pct: 8.75,
    minimum_investment: 100,
    unit_price: 10.0,
    is_liquid: true
  },
  {
    asset_id: "ast_growth_004",
    name: "Nigerian Equity Growth Index",
    provider: "Meristem Wealth Management",
    category: "mutual_fund",
    risk_level: "aggressive",
    currency: "NGN",
    estimated_return_annual_pct: 24.0,
    minimum_investment: 5_000,
    unit_price: 250.0,
    is_liquid: true
  }
];

/**
 * Creates an in-memory mock implementation of Cowrywise Embed API.
 * Safely models all documented asynchronous and verification flows without requiring real credentials.
 */
export function createMockEmbedClient(): CowrywiseEmbedClient {
  // In-memory state storage for the simulated lifecycle
  const accountsMap = new Map<string, Account>();
  const walletsMap = new Map<string, Wallet>();
  const savingsMap = new Map<string, SavingsPlan>();
  const withdrawalsMap = new Map<string, WithdrawalRecord>();

  // Pre-seed a default demo customer for instant out-of-the-box exploration
  const defaultAccount: Account = {
    account_id: "acc_demo_001",
    first_name: "Chidi",
    last_name: "Okonkwo",
    email: "chidi.okonkwo@example.com",
    phone_number: "+2348012345678",
    status: "verified",
    created_at: "2026-10-18T10:00:00.000Z",
    is_bvn_verified: true
  };
  accountsMap.set(defaultAccount.account_id, defaultAccount);

  const defaultWallet: Wallet = {
    wallet_id: "wlt_demo_001",
    account_id: defaultAccount.account_id,
    currency: "NGN",
    balance: 125_000,
    locked_balance: 350_000,
    created_at: "2026-10-18T10:05:00.000Z"
  };
  walletsMap.set(defaultWallet.wallet_id, defaultWallet);

  return {
    // Legacy method preserved for compatibility
    async getPortfolioSummary(): Promise<PortfolioSummary> {
      return {
        customerReference: "demo-customer-001",
        currency: "NGN",
        availableBalance: 125_000,
        investedValue: 350_000,
        asOf: new Date().toISOString(),
        source: "synthetic-demo-data"
      };
    },

    accounts: {
      async createAccount(params: AccountCreationParams): Promise<Account> {
        if (!params.terms_of_use_accepted) {
          throw new Error("Terms of use must be accepted to create an investment account.");
        }

        const accountId = `acc_${Date.now()}`;
        const newAccount: Account = {
          account_id: accountId,
          first_name: params.first_name,
          last_name: params.last_name,
          email: params.email,
          phone_number: params.phone_number,
          status: "pending_verification",
          created_at: new Date().toISOString(),
          is_bvn_verified: false
        };

        accountsMap.set(accountId, newAccount);
        return newAccount;
      },

      async getAccount(accountId: string): Promise<Account> {
        const acc = accountsMap.get(accountId);
        if (!acc) {
          throw new Error(`Account not found: ${accountId}`);
        }
        return acc;
      },

      async updateIdentity(
        accountId: string,
        params: IdentityUpdateParams
      ): Promise<IdentityVerificationResult> {
        const account = accountsMap.get(accountId);
        if (!account) {
          throw new Error(`Account not found: ${accountId}`);
        }

        const cleanVal = params.identity_value.trim();
        // Validation: BVN must be 11 digits
        if (params.identity_type === "bvn" && !/^\d{11}$/.test(cleanVal)) {
          throw new InvalidBvnError(cleanVal);
        }

        account.is_bvn_verified = true;
        account.status = "verified";

        // Auto-provision wallet on successful verification (matching Cowrywise behavior)
        const walletId = `wlt_${account.account_id}`;
        if (!walletsMap.has(walletId)) {
          walletsMap.set(walletId, {
            wallet_id: walletId,
            account_id: account.account_id,
            currency: "NGN",
            balance: 0,
            locked_balance: 0,
            created_at: new Date().toISOString()
          });
        }

        return {
          account_id: accountId,
          identity_type: params.identity_type,
          is_verified: true,
          message: "Identity verified successfully. Investment wallet auto-created.",
          verified_at: new Date().toISOString()
        };
      }
    },

    wallets: {
      async getWallets(accountId?: string): Promise<Wallet[]> {
        const all = Array.from(walletsMap.values());
        return accountId ? all.filter((w) => w.account_id === accountId) : all;
      },

      async getWallet(walletId: string): Promise<Wallet> {
        const wallet = walletsMap.get(walletId);
        if (!wallet) {
          throw new Error(`Wallet not found: ${walletId}`);
        }
        return wallet;
      },

      async fundWallet(walletId: string, amount: number): Promise<Wallet> {
        if (amount <= 0) {
          throw new Error("Funding amount must be greater than zero.");
        }
        const wallet = walletsMap.get(walletId);
        if (!wallet) {
          throw new Error(`Wallet not found: ${walletId}`);
        }
        wallet.balance += amount;
        return wallet;
      }
    },

    assets: {
      async getAssets(): Promise<InvestmentAsset[]> {
        return SYNTHETIC_ASSETS;
      },

      async getAsset(assetId: string): Promise<InvestmentAsset> {
        const asset = SYNTHETIC_ASSETS.find((a) => a.asset_id === assetId);
        if (!asset) {
          throw new Error(`Asset not found: ${assetId}`);
        }
        return asset;
      },

      async investInAsset(params: {
        accountId: string;
        assetId: string;
        amount: number;
      }): Promise<{ transaction_id: string; asset_id: string; amount: number; units: number }> {
        const account = accountsMap.get(params.accountId);
        if (!account || !account.is_bvn_verified) {
          throw new UnverifiedAccountError(params.accountId);
        }

        const asset = SYNTHETIC_ASSETS.find((a) => a.asset_id === params.assetId);
        if (!asset) {
          throw new Error(`Asset not found: ${params.assetId}`);
        }

        if (params.amount < asset.minimum_investment) {
          throw new Error(
            `Investment amount ${asset.currency} ${params.amount} is below minimum required ${asset.currency} ${asset.minimum_investment}.`
          );
        }

        // Check wallet
        const wallet = Array.from(walletsMap.values()).find((w) => w.account_id === params.accountId);
        if (!wallet || wallet.balance < params.amount) {
          throw new InsufficientWalletBalanceError(
            wallet ? wallet.wallet_id : "unknown",
            params.amount,
            wallet ? wallet.balance : 0,
            asset.currency
          );
        }

        // Deduct from available balance, add to locked
        wallet.balance -= params.amount;
        wallet.locked_balance += params.amount;

        const units = Number((params.amount / asset.unit_price).toFixed(4));
        return {
          transaction_id: `txn_${Date.now()}`,
          asset_id: asset.asset_id,
          amount: params.amount,
          units
        };
      }
    },

    savings: {
      async getSavings(accountId?: string): Promise<SavingsPlan[]> {
        const all = Array.from(savingsMap.values());
        return accountId ? all.filter((s) => s.account_id === accountId) : all;
      },

      async createSavingsPlan(params: CreateSavingsPlanParams): Promise<SavingsPlan> {
        const account = accountsMap.get(params.account_id);
        if (!account || !account.is_bvn_verified) {
          throw new UnverifiedAccountError(params.account_id);
        }

        if (params.duration_months < 3) {
          throw new Error("Cowrywise savings plans require a minimum duration of 3 months.");
        }

        const initialDeposit = params.initial_deposit ?? 0;
        if (initialDeposit > 0) {
          const wallet = Array.from(walletsMap.values()).find((w) => w.account_id === params.account_id);
          if (!wallet || wallet.balance < initialDeposit) {
            throw new InsufficientWalletBalanceError(
              wallet ? wallet.wallet_id : "unknown",
              initialDeposit,
              wallet ? wallet.balance : 0
            );
          }
          wallet.balance -= initialDeposit;
          wallet.locked_balance += initialDeposit;
        }

        const now = new Date();
        const maturity = new Date(now);
        maturity.setMonth(maturity.getMonth() + params.duration_months);

        const plan: SavingsPlan = {
          plan_id: `sp_${Date.now()}`,
          account_id: params.account_id,
          name: params.name,
          target_amount: params.target_amount,
          current_balance: initialDeposit,
          duration_months: params.duration_months,
          interest_rate_annual_pct: params.interest_enabled ? 12.0 : 0.0,
          interest_enabled: params.interest_enabled,
          start_date: now.toISOString(),
          maturity_date: maturity.toISOString(),
          status: "active"
        };

        savingsMap.set(plan.plan_id, plan);
        return plan;
      }
    },

    withdrawals: {
      async requestWithdrawal(params: WithdrawalParams): Promise<WithdrawalRecord> {
        const wallet = walletsMap.get(params.wallet_id);
        if (!wallet) {
          throw new Error(`Wallet not found: ${params.wallet_id}`);
        }

        if (wallet.balance < params.amount) {
          throw new InsufficientWalletBalanceError(wallet.wallet_id, params.amount, wallet.balance);
        }

        // Deduct from balance
        wallet.balance -= params.amount;

        // 24-hour cooling-off period rule documented in Cowrywise Embed guides
        const now = new Date();
        const coolingOffExpires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const withdrawal: WithdrawalRecord = {
          withdrawal_id: `wth_${Date.now()}`,
          wallet_id: params.wallet_id,
          amount: params.amount,
          currency: wallet.currency,
          bank_code: params.bank_code,
          account_number: params.account_number,
          status: "cooling_off_period",
          cooling_off_expires_at: coolingOffExpires.toISOString(),
          created_at: now.toISOString()
        };

        withdrawalsMap.set(withdrawal.withdrawal_id, withdrawal);
        return withdrawal;
      },

      async getWithdrawal(withdrawalId: string): Promise<WithdrawalRecord> {
        const record = withdrawalsMap.get(withdrawalId);
        if (!record) {
          throw new Error(`Withdrawal record not found: ${withdrawalId}`);
        }
        return record;
      }
    },

    webhooks: {
      verifySignature(params) {
        return verifyCowrywiseWebhookSignature(params);
      },
      createMockPayload(eventType, data, clientId, clientSecret) {
        return createMockWebhookPayload(eventType, data, clientId, clientSecret);
      }
    }
  };
}
