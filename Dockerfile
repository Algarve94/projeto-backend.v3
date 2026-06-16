# ── Etapa 1: base ────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ── Etapa 2: dependências de produção ────────────────────────────
FROM base AS deps
RUN npm ci --only=production

# ── Etapa 3: imagem final ─────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Cria usuário não-root por segurança (boa prática em produção)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Remove arquivos desnecessários na imagem final
RUN rm -rf tests .env.example

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
