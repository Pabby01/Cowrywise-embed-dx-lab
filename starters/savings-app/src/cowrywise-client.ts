/// <reference path="./embed-node.d.ts" />
import Client from "@cowrywise/embed-node";

export function createCowrywiseClient() {
  const clientId = process.env.COWRYWISE_CLIENT_ID || "sandbox_mock_client_id";
  const clientSecret = process.env.COWRYWISE_CLIENT_SECRET || "sandbox_mock_client_secret";
  const baseUrl = process.env.COWRYWISE_BASE_URL || "https://sandbox.embed.cowrywise.com/api/v1";

  return new Client({
    client_id: clientId,
    client_secret: clientSecret,
    embed_api_base_url: baseUrl
  });
}
