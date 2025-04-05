FROM node:18-alpine

WORKDIR /app

# 先复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install

# 复制所有文件
COPY . .

# 暴露 VitePress 开发服务器端口
EXPOSE 3000

# 启动开发服务器
CMD ["npm", "run", "docs:dev"]