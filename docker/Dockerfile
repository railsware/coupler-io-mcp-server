FROM oven/bun:1.2.10-slim AS base

ENV NODE_ENV=development
ENV STORAGE_HOST=http://storage.test:4443
ENV COUPLER_API_HOST=http://host.docker.internal:3000

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
