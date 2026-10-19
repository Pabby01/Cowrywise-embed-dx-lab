# Cowrywise Embed Architecture & Sequence Diagrams

This document visualizes the core asynchronous workflows and data boundaries when integrating Cowrywise Embed into your partner application.

---

## 1. Customer Onboarding & KYC Identity Flow

Regulatory compliance requires identity verification before wallets or investments can be initialized.

```mermaid
sequenceDiagram
    autonumber
    actor User as End User / Customer
    participant PartnerApp as Partner Frontend / Mobile App
    participant PartnerBackend as Partner Backend Server
    participant Cowrywise as Cowrywise Embed API
    participant NIBSS as Identity Provider (NIBSS / KYC)

    User->>PartnerApp: Fill registration form & accept terms
    PartnerApp->>PartnerBackend: POST /api/register-investor
    PartnerBackend->>Cowrywise: POST /v1/accounts (first_name, last_name, email, terms_accepted=true)
    Cowrywise-->>PartnerBackend: 201 Created (account_id, status="pending_verification")
    PartnerBackend-->>PartnerApp: Prompt for BVN verification

    User->>PartnerApp: Enters 11-digit BVN
    PartnerApp->>PartnerBackend: POST /api/verify-bvn
    PartnerBackend->>Cowrywise: POST /v1/accounts/{id}/identity (identity_type="bvn", identity_value)
    Cowrywise->>NIBSS: Validate BVN against biometric database
    NIBSS-->>Cowrywise: Verified: Name, DOB, Phone match
    Cowrywise->>Cowrywise: Auto-provision default Investment Wallet
    Cowrywise-->>PartnerBackend: 200 OK (status="verified", is_bvn_verified=true)
    PartnerBackend-->>PartnerApp: Verification successful! Wallet ready.
```

---

## 2. Wallet Funding & Mutual Fund Purchase Flow

Wallets serve as the sole funding source and withdrawal destination for all investment products.

```mermaid
sequenceDiagram
    autonumber
    actor User as Investor
    participant App as Partner App
    participant Backend as Partner Backend
    participant Cowrywise as Cowrywise Embed API
    participant Bank as Commercial Bank / Payment Gateway

    User->>App: Chooses to invest ₦50,000 in Money Market Fund
    App->>Backend: POST /api/invest (asset_id="ast_mmf_001", amount=50000)
    Backend->>Cowrywise: GET /v1/wallets (Check balance)
    Cowrywise-->>Backend: 200 OK (balance=10000, insufficient)
    
    Backend-->>App: Prompt user to top-up wallet by ₦40,000
    User->>App: Pays via Bank Transfer / Virtual Account
    Bank->>Cowrywise: Inbound settlement confirmation
    Cowrywise->>Backend: Webhook: wallet.funded (amount=40000)
    Backend->>Backend: Verify HMAC SHA-256 signature
    Backend-->>Cowrywise: 200 OK (Acknowledge webhook)

    Backend->>Cowrywise: POST /v1/investments (asset_id, amount=50000)
    Cowrywise->>Cowrywise: Deduct ₦50,000 from wallet, allocate fund units
    Cowrywise-->>Backend: 201 Created (txn_id, units=500, price=100)
    Backend-->>App: Investment confirmed! 500 units allocated.
```

---

## 3. Asynchronous Liquidation & 24-Hour Cooling-Off Period

To protect against account takeovers and accidental withdrawals, Cowrywise Embed enforces a regulatory 24-hour intent cooling-off period.

```mermaid
sequenceDiagram
    autonumber
    actor User as Investor
    participant App as Partner App
    participant Backend as Partner Backend
    participant Cowrywise as Cowrywise Embed API
    participant Bank as Investor's Bank Account

    User->>App: Requests payout of ₦40,000 to Bank Account
    App->>Backend: POST /api/withdraw
    Backend->>Cowrywise: POST /v1/withdrawals (wallet_id, amount=40000, bank_code, account_no)
    Cowrywise->>Cowrywise: Set status="cooling_off_period", expires_in=24h
    Cowrywise-->>Backend: 202 Accepted (withdrawal_id, cooling_off_expires_at)
    Backend-->>App: Withdrawal initiated. 24h safety review window active.

    Note over User,Cowrywise: During 24 hours: User can cancel if unauthorized.

    Note over Cowrywise: 24 hours elapse successfully.
    Cowrywise->>Bank: Dispatch NIP/ACH bank transfer
    Bank-->>Cowrywise: Transfer settled successfully
    Cowrywise->>Backend: Webhook: withdrawal.completed (withdrawal_id, amount=40000)
    Backend->>Backend: Verify HMAC signature & update user portfolio
    Backend->>User: Push notification: "₦40,000 has arrived in your bank account."
```

---

## 4. Webhook Event Loop with HMAC Verification

```mermaid
flowchart TD
    A[Cowrywise Event Occurs: wallet.funded, etc.] --> B[Cowrywise signs CLIENT_ID with CLIENT_SECRET]
    B --> C[HTTP POST to Partner Webhook Endpoint]
    C --> D{Partner Webhook Listener}
    D -->|Step 1| E[Compute HMAC-SHA256(CLIENT_ID, CLIENT_SECRET)]
    E -->|Step 2| F{crypto.timingSafeEqual?}
    F -->|Mismatch| G[Return HTTP 401: Unauthorized / Reject Request]
    F -->|Match| H[Check Event Idempotency in Redis/DB]
    H -->|Already Processed| I[Return HTTP 200: Ignore Duplicate]
    H -->|New Event| J[Update Local Database & Notify User]
    J --> K[Return HTTP 200 within 3 seconds]
```
