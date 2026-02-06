# FROM node:24-alpine
# WORKDIR /app
# RUN corepack enable && corepack prepare pnpm@latest --activate
# COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# RUN pnpm install --frozen-lockfile
# COPY . .
# EXPOSE 3333
# CMD ["pnpm", "dev"]

FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "dev"]
