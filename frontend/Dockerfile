FROM node:lts
LABEL repo=https://github.com/hynnot/PERN-stack-boilerplate

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY ./frontend/package.json ./frontend/tsconfig.json ./
COPY ./frontend/.env.txt ./.env
COPY ./frontend/components ./components
COPY ./frontend/layouts ./layouts
COPY ./frontend/pages ./pages
COPY ./frontend/public ./public
COPY ./frontend/store ./store
COPY ./frontend/styles ./styles
COPY ./frontend/tests ./tests
COPY ./frontend/types ./types
COPY ./frontend/utils ./utils
RUN npm install
RUN npm run build
RUN npx playwright install chromium
RUN mv /root/.cache/ms-playwright/chromium-1067 /root/.cache/ms-playwright/chromium-1040
RUN ls -la /root/.cache/ms-playwright
# RUN npm run start

CMD ["npm", "run", "dev"]