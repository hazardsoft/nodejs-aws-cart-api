# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

FROM base AS install-dev
WORKDIR /tmp/dev
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS install-prod
WORKDIR /tmp/prod
COPY package.json package-lock.json ./
RUN npm ci --omit dev

FROM install-dev AS prisma
COPY prisma ./prisma
COPY migrations ./migrations
RUN npm run prisma:generate

FROM prisma AS build
ENV NODE_ENV=production
COPY tsconfig* webpack.config.js ./
COPY src ./src
RUN npm run build

FROM base
WORKDIR /app
COPY --from=install-prod /tmp/prod/node_modules/@prisma ./node_modules/@prisma/
COPY --from=install-prod /tmp/prod/node_modules/prisma ./node_modules/prisma/
COPY --from=install-prod /tmp/prod/node_modules/.bin ./node_modules/.bin/

COPY --from=prisma /tmp/dev/node_modules/.prisma ./node_modules/.prisma/
COPY --from=prisma /tmp/dev/migrations ./migrations/
COPY --from=prisma /tmp/dev/prisma ./prisma/

# Query Engine for linux
# COPY --from=prisma /tmp/dev/node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-3.0.x.so.node ./
COPY --from=build /tmp/dev/dist/main.js ./dist/
COPY --from=build /tmp/dev/dist/seed.js ./dist/
COPY --from=build /tmp/dev/package.json ./
CMD ["dist/main.js"]