FROM node:lts
LABEL repo=https://github.com/hynnot/PERN-stack-boilerplate

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./backend/package.json ./backend/tsconfig.json ./
COPY ./backend/.env.txt ./backend/.env
COPY ./backend/src ./src
COPY ./types /usr/types
RUN npm install
RUN npm run build

CMD ["npm", "run", "dev"]