# Ethereum Balance App
https://ethereum-balance.netlify.app/

A monorepo application for checking Ethereum token balances with a NestJS backend API and React frontend.

## Prerequisites

- Node.js v20+
- Yarn v4+

## Quick Start

```bash
# Install dependencies
yarn install

# Start both API and frontend in development mode
yarn dev

# Or run them separately
yarn dev:api     # Backend only
yarn dev:frontend # Frontend only
```

## Required Environment Variables

### Backend (packages/balance-api/.env)

```
# Required for API ("/packages/balance-api/.env")
INFURA_URL=your_infura_endpoint_url
```

### Frontend (packages/frontend/.env.local)

```
VITE_API_URL=http://localhost:3000 # URL to your backend API
```

## Build for Production

```bash
# Build both applications
yarn build

# Run production build
yarn workspace balance-api start:prod
yarn workspace frontend preview
```

## Testing

```bash
# Integration tests
yarn workspace balance-api test:integration

# E2E tests (requires both API and frontend running)
yarn dev
yarn test:e2e
```
