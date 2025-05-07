FROM oven/bun:1.2.12-slim AS base

ARG NODE_ENV=development

ENV NODE_ENV=$NODE_ENV

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

RUN chmod +x /app/docker/entrypoint.sh

USER bun

ENTRYPOINT ["/app/docker/entrypoint.sh"]
