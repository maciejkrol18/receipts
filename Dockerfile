FROM node:latest

RUN npm install -g pnpm
RUN npm install -g typescript

RUN mkdir /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY config.ts ./
COPY src ./src

# (1) List contents of /usr/src/bot for debugging
RUN ls -la /usr/src/bot

# Compile TypeScript to JavaScript
RUN pnpm run build

COPY . /usr/src/bot

# (2) List contents of /usr/src/bot for debugging
RUN ls -la /usr/src/bot

ENV NODE_ENV production

CMD ["node", "index.js"]