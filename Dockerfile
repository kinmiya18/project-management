# --- Stage 1: Install dependencies only ---
FROM node:18 AS deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

# --- Stage 2: Runtime ---
FROM node:18-slim AS runtime

WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . . 

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
