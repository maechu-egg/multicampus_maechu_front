FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 소스 파일 복사
COPY . .

# 의존성 설치 및 빌드
RUN npm install —legacy-peer-deps && npm run build

# 빌드된 결과물 제공 (예: nginx를 통해)
CMD ["npm", "start"]