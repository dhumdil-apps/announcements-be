FROM node:24-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && apk del python3 make g++

COPY --from=builder /app/dist ./dist

RUN mkdir -p data

ENV PORT=3000
ENV DATABASE_PATH=data/announcements.db
ENV DATABASE_SYNC=true
ENV CORS_ORIGIN=*

EXPOSE 3000

CMD ["node", "dist/main.js"]
