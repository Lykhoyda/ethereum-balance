# ethereum-balance

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-NETLIFY-SITE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE-NAME/deploys)

A monorepo application for checking Ethereum token balances. This project consists of a NestJS backend API and a React frontend built with Vite.

## Project Structure

```
/
├── packages/
│   ├── balance-api/     # NestJS backend API
│   └── frontend/        # React frontend
└── tests/              # E2E tests with Playwright
```

## Development

```bash
# Install dependencies
yarn install

# Run both frontend and backend in development mode
yarn dev

# Run only backend
yarn dev:api

# Run only frontend
yarn dev:frontend

# Build both applications
yarn build

# Run E2E tests
yarn test:e2e
```

## Deployment

### GitHub Actions CI/CD

This project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/ci-cd.yml`.

The CI/CD pipeline:
1. Runs on pushes to `main` branch and pull requests
2. Installs dependencies
3. Runs linting
4. Builds both backend and frontend
5. Runs tests
6. Deploys the frontend to Netlify (only on `main` branch)

### Netlify Deployment

#### Setup

1. Create a new site on Netlify
2. Link your GitHub repository
3. Set the build command to `yarn build`
4. Set the publish directory to `packages/frontend/dist`
5. Add environment variables (see below)

#### Environment Variables

Add the following environment variables in Netlify:

- `VITE_API_URL`: URL of your backend API
- Additional variables as needed for your application

#### GitHub Secrets

Add these secrets to your GitHub repository for automatic deployments:

- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID

#### Manual Deployment

```bash
# Login to Netlify (first time)
yarn netlify:login

# Deploy to a preview URL
yarn deploy

# Deploy to production
yarn deploy:prod
```

### Backend Deployment

The NestJS backend can be deployed to various platforms:

1. **Render/Heroku/Railway**: Set the build command to `yarn workspace balance-api build` and start command to `yarn workspace balance-api start:prod`
2. **Docker**: Use the included Dockerfile for containerized deployment

Make sure to set appropriate environment variables for your backend deployment.
