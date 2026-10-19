declare module "@cowrywise/embed-node" {
  export interface ClientConfig {
    client_id: string;
    client_secret: string;
    embed_api_base_url?: string;
  }

  export interface AccountCreationData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    terms_of_use_accepted: boolean;
  }

  export interface IdentityUpdateData {
    identity_type: "bvn" | "nin";
    identity_value: string;
  }

  export interface InvestmentData {
    accountId: string;
    assetId: string;
    amount: number;
  }

  export interface SavingsPlanData {
    account_id: string;
    name: string;
    target_amount?: number;
    initial_deposit?: number;
    duration_months?: number;
    interest_enabled?: boolean;
  }

  export class Client {
    constructor(config: ClientConfig);
    accounts: {
      createAccount(data: AccountCreationData): Promise<any>;
      getAccounts(page?: number): Promise<any>;
      getAccount(accountId: string): Promise<any>;
      updateIdentity(accountId: string, data: IdentityUpdateData): Promise<any>;
    };
    wallets: {
      getWallets(accountId: string): Promise<any>;
      getWallet(walletId: string): Promise<any>;
    };
    savings: {
      createSavingsPlan(data: SavingsPlanData): Promise<any>;
      getSavingsPlans(accountId: string): Promise<any>;
    };
    assets: {
      getAssets(): Promise<any[]>;
      getAsset(assetId: string): Promise<any>;
      investInAsset(data: InvestmentData): Promise<any>;
    };
    investments: any;
    trade: any;
    prices: any;
    transactions: any;
    withdrawals: any;
    fixed_notes: any;
    flexible_savings: any;
    indices: any;
    misc: any;
    integrations: any;
  }

  export default Client;
}
