# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html
COPY docker/release/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80