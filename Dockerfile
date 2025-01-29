FROM node:22-slim

RUN apt-get update -y && apt-get install -y build-essential python3 openssl

ENV DATABASE_URL="file:./dev.db"

WORKDIR /app
COPY src/ ./src
COPY package.json pnpm-lock.yaml ./
COPY prisma/ ./prisma
RUN npm i -g pnpm && pnpm i --frozen-lockfile --prod && pnpm db:migrate

EXPOSE 3000

CMD pnpm db:fetch_coins && pnpm start
