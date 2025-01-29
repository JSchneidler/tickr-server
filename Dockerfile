FROM node:22-slim

RUN apt-get update -y && apt-get install -y build-essential python3 openssl

WORKDIR /app
COPY src/ ./src
COPY package.json pnpm-lock.yaml ./
COPY prisma/ ./prisma
RUN npm i -g pnpm && pnpm i --frozen-lockfile --prod

CMD ["pnpm", "start"]
