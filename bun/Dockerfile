FROM oven/bun:1

WORKDIR /app

COPY . .

RUN bun install

ENTRYPOINT [ "bun", "--hot", "run", "index.ts" ]