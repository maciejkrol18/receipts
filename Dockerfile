FROM node:latest

RUN npm install -g pnpm
RUN mkdir -p /app

COPY package.json /app
COPY pnpm-lock.yaml /app
COPY . /app

WORKDIR /app

RUN pnpm install --frozen-lockfile
RUN pnpm build

CMD ["node", "dist/src/index.js"]