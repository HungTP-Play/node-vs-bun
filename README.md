# NODE VS BUN

Simple comparison between NodeJs and BunJs runtime.

How to run

```bash
docker-compose up
```

## How the test run?

I run the test on 3 routes:

- `/hello (GET)`: simple json "OK" response
- `/shorten (PUSH)`: push with simple payload {"original": "<https://google.com"}>
- `/original/:id (GET)`: get original url from id

I will run each route 1M times, calculate the total time, then divide for 1M to get avgProcessingTime and to calculate request per second (RPS)

a processing time is calculate by: `requested_timestamp - response_received_timestamp`
