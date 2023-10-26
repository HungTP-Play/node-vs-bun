FROM node:20.9.0-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]