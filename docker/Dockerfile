FROM node:22.15.1-slim AS base

ENV NODE_ENV=production
ENV COUPLER_API_HOST=https://app.coupler.io/mcp
ENV LOG_LEVEL=silent

WORKDIR /app

FROM base AS install
WORKDIR /temp/install
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS final
COPY --from=install /temp/install/node_modules node_modules
COPY . .
# We may write logs to this dir
RUN chown -R node:node /app/log

USER node

CMD ["npm", "run", "--silent", "start"]
