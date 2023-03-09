FROM node:lts
LABEL Tony Morellá Llácer <hynnot@gmail.com>
LABEL repo=https://github.com/hynnot/PERN-stack-boilerplate

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./frontend/* ./
COPY ./frontend/.env.txt ./.env
COPY ./types /usr/types
RUN npm install
RUN npm run build
RUN npm run start

CMD ["npm", "run", "dev"]