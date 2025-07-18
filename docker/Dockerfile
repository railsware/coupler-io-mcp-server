FROM node:22.15.1-slim@sha256:ec318fe0dc46b56bcc1ca42a202738aeb4f3e347a7b4dd9f9f1df12ea7aa385a AS base

RUN apt-get -y update && apt-get install -y --no-install-recommends \
  tini \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS build

WORKDIR /temp/build
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS install

WORKDIR /temp/install
COPY --from=base /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

FROM base AS final

ARG APP_VERSION=development

ENV NODE_ENV=production
ENV COUPLER_API_HOST=https://app.coupler.io/mcp
ENV LOG_LEVEL=silent
ENV APP_VERSION=$APP_VERSION

WORKDIR /app

COPY --from=install /temp/install/node_modules ./node_modules
COPY --from=build /temp/build/dist ./dist
COPY . .
# We may write logs to this dir
RUN chown -R node:node /app/log

USER node

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/index.js"]
