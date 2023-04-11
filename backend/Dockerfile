FROM node:lts
LABEL repo=https://github.com/hynnot/PERN-stack-boilerplate

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./backend/package.json ./backend/tsconfig.json ./
COPY ./backend/.env.txt ./.env
COPY ./backend/src ./src
COPY ./backend/src/contexts/voting/infrastructure/persistence/VotingCycles.txt ./src/contexts/voting/infrastructure/persistence/VotingCycles.json
COPY ./backend/src/contexts/voting/infrastructure/persistence/VotingCycles.txt ./src/VotingCycles.json
COPY ./types /usr/types
RUN npm install
RUN npm run build

CMD ["npm", "run", "dev"]