declare module "@cowrywise/embed-node" {
  export interface ClientConfig {
    client_id: string;
    client_secret: string;
    embed_api_base_url?: string;
  }

  export class Client {
    constructor(config: ClientConfig);
    accounts: any;
    wallets: any;
    savings: any;
    assets: any;
    investments: any;
    transactions: any;
    withdrawals: any;
  }

  export default Client;
}
