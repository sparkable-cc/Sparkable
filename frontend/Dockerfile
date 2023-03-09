FROM node:lts
LABEL Tony Morellá Llácer <hynnot@gmail.com>
LABEL repo=https://github.com/hynnot/PERN-stack-boilerplate

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./frontend/components ./components
COPY ./frontend/layouts ./layouts
COPY ./frontend/pages ./pages
COPY ./frontend/public ./public
COPY ./frontend/store ./store
COPY ./frontend/styles ./styles
COPY ./frontend/tests ./tests
COPY ./frontend/types ./types
COPY ./frontend/utils ./utils
COPY ./frontend/package.json ./frontend/tsconfig.json ./
COPY ./frontend/.env.txt ./.env
COPY ./types /usr/types
RUN npm install
RUN npm run build
RUN npm run start

CMD ["npm", "run", "dev"]