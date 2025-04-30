FROM oven/bun:1.2.10-slim AS base

ARG NODE_ENV=production
ARG COUPLER_API_HOST=https://api.coupler.io
ARG LOG_LEVEL=silent

ENV NODE_ENV=$NODE_ENV
ENV COUPLER_API_HOST=$COUPLER_API_HOST
ENV LOG_LEVEL=$LOG_LEVEL

WORKDIR /app

FROM base AS install
WORKDIR /temp/install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS final
COPY --from=install /temp/install/node_modules node_modules
COPY . .

# Ensure log directory exists with correct permissions
RUN mkdir -p /app/log && chown -R bun:bun /app/log && chmod 644 /app/log

USER bun

CMD ["bun", "start"]
