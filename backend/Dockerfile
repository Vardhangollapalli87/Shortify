FROM node:22-alpine AS base

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY src ./src
COPY scripts ./scripts

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node scripts/check-health.js

CMD ["node", "src/server.js"]
