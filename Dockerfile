# Этап сборки
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Продакшен-образ
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Открываем порт (если есть HTTP)
# EXPOSE 3000

# Запуск
CMD ["node", "dist/main.js"]