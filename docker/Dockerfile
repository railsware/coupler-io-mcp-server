FROM oven/bun:1.2.10-slim AS base

ARG NODE_ENV=production
ARG COUPLER_API_HOST=https://api.coupler.io
ARG STORAGE_HOST

ENV NODE_ENV=$NODE_ENV
ENV COUPLER_API_HOST=$COUPLER_API_HOST
ENV STORAGE_HOST=$STORAGE_HOST

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
