FROM oven/bun:1.2.12-slim AS base

ENV NODE_ENV=production
ENV COUPLER_API_HOST=https://app.coupler.io/mcp
ENV LOG_LEVEL=silent

WORKDIR /app

FROM base AS install
WORKDIR /temp/install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS final
COPY --from=install /temp/install/node_modules node_modules
COPY . .
# We may write logs to this dir
RUN chown -R bun:bun /app/log

USER bun

ENTRYPOINT ["bun", "start"]
