# Solution – Candidate Instructions

**Create this file as part of your submission.** Replace this placeholder with your own content.

## 1. Setup & run

- How to install dependencies and run the local chain.
- How to deploy the contract and which address to use.
- How to configure and run the **backend** (CONTRACT_ADDRESS, CHAIN_ID, PORT).
- How to configure and run the web app (NEXT_PUBLIC_API_URL or NEXT_PUBLIC_CONTRACT_ADDRESS).

## 2. Decisions

- Solidity version and any contract design choices.
- Front-end: why you chose wagmi/ethers, any structural decisions.

## 3. Improvements

- What you would add or improve with more time (tests, UI, error handling, multi-chain, etc.).

# SOLUTION

## 1) Setup & run

```bash
cd contracts
npm install
```

## Compile
```bash
npm run compile
```

### Terminal 1 - Run Local Node (Hardhat)
```bash
npm run node
```

### Terminal 2 - Contracts Deploy (Hardhat)
```bash
npm run deploy:local
```
- Copy `Deployed to: 0x...` from the deploy output.
    - Backend: set it as `CONTRACT_ADDRESS` in `backend/.env`
    - Frontend (env-only): set it as `NEXT_PUBLIC_CONTRACT_ADDRESS` in `frontend/.env`


### Test (extra):
```bash
npm test
```

### Coverage (extra):
```bash
npm run coverage
```
### Backend (Node.js + Express)
##  Setup
```bash
cd backend
npm install
cp .env.example .env
```
- Edit backend/.env:
  `CONTRACT_ADDRESS=0x...` # from deploy output.

##  Run
```bash
npm run dev
```

## Verify
```bash
curl -s http://localhost:4000/api/health
curl -s http://localhost:4000/api/config

```

## Frontend (Next.js + TypeScript + wagmi)

### Frontend (Next.js + TypeScript + wagmi)
```bash
cd frontend
npm install
cp .env.example .env
```

- Option A (recommended): load config from backend
  - NEXT_PUBLIC_API_URL=http://localhost:4000
- Option B (env-only): set contract config directly
   - NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   - NEXT_PUBLIC_CHAIN_ID=31337
  
## Run
```bash
npm run dev
```
- Open `http://localhost:3000`  and connect MetaMask to Hardhat local network:
  - Chain ID: 31337
  - RPC: http://127.0.0.1:8545

## 2) Decisions

- Solidity `^0.8.20` with an explicit guard in `decrement()` to prevent underflow (`require(_count > 0, "Counter: underflow")`).
- `unchecked` is used only where it is safe (after the `require`) to reduce gas.
- Hardhat with `@nomicfoundation/hardhat-toolbox` for a standard DX and straightforward deploy/test scripts.
- `solidity-coverage` added as an extra to generate a readable coverage report for review.
- Frontend built with wagmi/viem for wallet connection and typed contract reads/writes.
- Config loading is centralized in a small `useAppConfig` hook:
  - if `NEXT_PUBLIC_API_URL` is set, it fetches `contractAddress` and `chainId` from the backend (`GET /api/config`)
  - otherwise it falls back to `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_CHAIN_ID`
    This keeps the app environment-driven and avoids hardcoding values in the UI code.

## 3) Improvements

- Guided network switching and clearer UI error handling (wrong network, rejected tx, reverted tx).
- Contract events + UI subscriptions (no manual refetch needed).
- Backend tests and a basic CI pipeline (lint + test on PR).
- Multi-chain (testnet) support with more flexible configuration and deployment scripts.
- Dedicated wallet integration service abstracting providers such as MetaMask and WalletConnect, allowing unified support for both browser and mobile wallets while improving maintainability and future extensibility.






