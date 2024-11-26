# 1. 빌드 단계: Node.js를 사용하여 정적 파일 생성
FROM node:18-alpine AS build

WORKDIR /app

# package.json과 lock 파일만 복사
COPY package*.json ./

# 의존성 설치
RUN npm install --legacy-peer-deps --force

# 애플리케이션 소스 복사
COPY . .

# 정적 파일 빌드
RUN npm install react-scripts --save
RUN npm run build

# 2. 배포 단계: Nginx로 정적 파일 제공
FROM nginx:1.20-alpine

# Nginx 설정 파일 복사 (필요한 경우)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# 컨테이너 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
