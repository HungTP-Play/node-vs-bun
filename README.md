# NODE VS BUN

Simple comparison between NodeJs and BunJs runtime.

How to run

```bash
docker-compose up
```

## Benchmark Architecture

![Benchmark Architecture](https://i.ibb.co/fXPnWB1/2023-10-28-10-40.png)

## Application Architecture

![Application Architecture](https://i.ibb.co/ns37z9W/2023-10-28-10-48.png)

## How the test run?

I run the test on 3 routes:

- `/hello (GET)`: simple json "OK" response
- `/shorten (PUSH)`: push with simple payload {"original": "<https://google.com"}>
- `/original/:id (GET)`: get original url from id

I will run each route 1M times, calculate the total time, then divide for 1M to get avgProcessingTime and to calculate request per second (RPS)

a processing time is calculate by: `requested_timestamp - response_received_timestamp`
