FROM node:lts
LABEL Tony Morellá Llácer <hynnot@gmail.com>
LABEL repo=https://github.com/hynnot/PERN-stack-boilerplate

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./frontend/package.json ./frontend/tsconfig.json ./
COPY ./frontend/.env.txt ./.env
RUN ls -la
RUN cat .env
COPY ./frontend/pages ./pages
COPY ./frontend/styles ./styles
COPY ./frontend/tests ./tests
COPY ./types /usr/types
RUN npm install
RUN npm run build
RUN npm run start

CMD ["npm", "run", "dev"]