# 使用官方 Node.js 镜像作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 VitePress 项目
RUN npm run build

# 使用 Nginx 作为生产服务器
FROM nginx:alpine

# 从构建阶段复制构建好的文件到 Nginx
COPY --from=builder /app/docs/.vitepress/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]