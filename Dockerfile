FROM node:latest

RUN mkdir /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usrc/src/bot
RUN pnpm install

COPY . /usr/src/bot

ENV NODE_ENV production

CMD ["node", "index.js"]