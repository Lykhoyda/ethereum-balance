FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package.json and yarn.lock from root and workspace
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY packages/balance-api/package.json ./packages/balance-api/

# Install dependencies using Yarn 4+
RUN corepack enable && \
    yarn install --immutable

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/yarn.lock ./yarn.lock
COPY --from=deps /app/.yarnrc.yml ./.yarnrc.yml
COPY packages/balance-api ./packages/balance-api
COPY package.json tsconfig.json ./

# Build the application
RUN yarn workspace balance-api build

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy only necessary files from the builder stage
COPY --from=builder --chown=nestjs:nodejs /app/packages/balance-api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/balance-api/package.json ./

# Install only production dependencies
RUN corepack enable && \
    yarn workspaces focus --production && \
    yarn cache clean

# Set ownership and permissions
RUN chown -R nestjs:nodejs /app

# Use the non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["node", "dist/main.js"]
