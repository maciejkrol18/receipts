FROM node:latest

RUN npm install -g pnpm

RUN mkdir /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . /usr/src/bot

ENV NODE_ENV production

CMD ["node", "index.js"]