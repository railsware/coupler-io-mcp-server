FROM oven/bun:1.2.9-slim AS base

WORKDIR /app

FROM base AS install
WORKDIR /temp/install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS final
COPY --from=install /temp/install/node_modules node_modules
COPY . .

USER bun

CMD ["bun", "start"]
