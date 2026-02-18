FROM node:24-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    postgresql-client \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

EXPOSE 3333

CMD bash -c "\
    until pg_isready -h db -p 5432; do \
    echo 'Waiting for database...'; \
    sleep 2; \
    done; \
    echo 'Database ready! Running Prisma migrate...'; \
    pnpm prisma migrate deploy; \
    echo 'Starting backend server...'; \
    node dist/server.js \
    "
