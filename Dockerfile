# Multi-stage Dockerfile for Next.js (optimal for production)
# Stage 1: install deps and build
FROM node:24.11.1-alpine3.22 AS base

# Install build tools for optional native deps
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# cache node_module
COPY --from=deps /app/node_modules ./node_modules 
COPY . .
ARG NEXT_PUBLIC_URL='http://localhost:3000'
ARG NEXT_PUBLIC_BACKEND_URL=''
ENV NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Build the Next.js app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copy the standalone Next.js build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Correct entry point
CMD ["node", "server.js"]
