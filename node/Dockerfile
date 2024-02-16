FROM node:20.11.1-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]