FROM node:20.19.4-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm -g i pnpm@latest && pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SERVER_BASE=https://api.testkart.in

RUN pnpm run build

FROM node:20.19.4-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

RUN npm -g i pnpm@latest && pnpm install --production --frozen-lockfile --no-cache

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SERVER_BASE=https://api.testkart.in

EXPOSE 3000

CMD ["pnpm", "start"]
