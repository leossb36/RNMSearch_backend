FROM node:22.21.1-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm ci
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "node dist/main.js"]