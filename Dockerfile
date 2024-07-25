# syntax=docker/dockerfile:1
FROM node:20-alpine
WORKDIR /app
COPY . /app/
RUN npm ci
RUN npx prisma generate --schema ./prisma \
    && npm run build
CMD ["dist/main.js"]