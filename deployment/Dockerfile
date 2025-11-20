# --------------------
# Build Stage
# --------------------
ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}-slim AS builder

WORKDIR /app

COPY .env .env

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
ENV NODE_OPTIONS='--max-old-space-size=4096'
RUN yarn build

# --------------------
# Production Stage
# --------------------
FROM node:${NODE_VERSION}-slim AS production

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
RUN yarn install --production --frozen-lockfile

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

EXPOSE 8080

# Optional healthcheck
HEALTHCHECK --interval=30s --timeout=5s \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["node", ".output/server/index.mjs"]
