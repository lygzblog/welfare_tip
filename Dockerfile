# 构建阶段
FROM node:22.17.0 AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (如果存在)
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:1.25.3 AS production-stage

# 从构建阶段复制构建好的文件到 nginx 目录
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY public/config.js /usr/share/nginx/html/config.js
COPY public/logo.png /usr/share/nginx/html/logo.png
COPY public/ico.png /usr/share/nginx/html/ico.png

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]