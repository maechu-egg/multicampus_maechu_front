# 1. 빌드 단계: Node.js를 사용하여 정적 파일 생성
FROM node:18-alpine AS build

WORKDIR /app

# 의존성 설치 및 소스 복사
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

# 기존 심볼릭 링크 제거 및 정적 파일 빌드
RUN find . -type l -delete && rm -rf node_modules && npm install --legacy-peer-deps && npm run build

# 2. 배포 단계: Nginx로 정적 파일 제공
FROM nginx:1.20-alpine

# 빌드된 정적 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
