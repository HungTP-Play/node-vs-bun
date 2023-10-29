import * as agent from 'superagent';
let SCORE: {
    [key: string]: {
        bun: number,
        node: number,
    }
} = {
    hello: {
        bun: 0,
        node: 0,
    },
    shorten: {
        bun: 0,
        node: 0,
    },
    original: {
        bun: 0,
        node: 0,
    }
}

const NUM_RUN = 1000000;

async function doHello(bunUrl: string, nodeUrl: string) {
    for (let i = 0; i < NUM_RUN; i++) {
        const startTime = Date.now();
        await agent.get(`${bunUrl}/hello`);
        const endTime = Date.now();
        SCORE['hello'].bun += (endTime - startTime);
    }

    // Node first then Bun later
    for (let i = 0; i < NUM_RUN; i++) {
        const startTime = Date.now();
        await agent.get(`${nodeUrl}/hello`);
        const endTime = Date.now();
        SCORE['hello'].node += (endTime - startTime);
    }
}

async function doShorten(bunUrl: string, nodeUrl: string) {
    for (let i = 0; i < NUM_RUN; i++) {
        const startTime = Date.now();
        await agent.post(`${bunUrl}/shorten`);
        const endTime = Date.now();
        SCORE['shorten'].bun += (endTime - startTime);
    }

    // Node first then Bun later
    for (let i = 0; i < NUM_RUN; i++) {
        const startTime = Date.now();
        await agent.post(`${nodeUrl}/shorten`);
        const endTime = Date.now();
        SCORE['shorten'].node += (endTime - startTime);
    }
}

async function doOriginal(bunUrl: string, nodeUrl: string) {
    for (let i = 0; i < NUM_RUN; i++) {
        const startTime = Date.now();
        await agent.get(`${bunUrl}/original/1`);
        const endTime = Date.now();
        SCORE['original'].bun += (endTime - startTime);
    }

    // Node first then Bun later
    for (let i = 0; i < NUM_RUN; i++) {
        const startTime = Date.now();
        await agent.get(`${nodeUrl}/original/1`);
        const endTime = Date.now();
        SCORE['original'].node += (endTime - startTime);
    }
}

function printScore() {
    console.log(`--- Run ${NUM_RUN} times for each route ---`);
    for (const key of Object.keys(SCORE)) {
        const { bun, node } = SCORE[key];

        const bunAvgTimePerRequestMs = bun / NUM_RUN;
        const bunRqs = NUM_RUN / (bun / 1000);

        const nodeAvgTimePerRequestMs = node / NUM_RUN;
        const nodeRqs = NUM_RUN / (node / 1000);

        console.log(`--- Case=${key} ---`);
        console.log(`Bun Avg Time Per Request  = ${bunAvgTimePerRequestMs.toFixed(4)}`);
        console.log(`Bun Rps                   = ${bunRqs.toFixed(4)}`);
        console.log(`Node Avg Time Per Request = ${nodeAvgTimePerRequestMs.toFixed(4)}`);
        console.log(`Node Rps                  = ${nodeRqs.toFixed(4)}`);
    }
}

const sleep5 = () => new Promise((r, j) => setTimeout(() => { r(true) }, 5000));

async function main() {
    await sleep5();
    const bunUrl = process.env.BUN_APP_URL ?? "http://bun-app:2222";
    const nodeUrl = process.env.NODE_APP_URL ?? "http://node-app:3333";

    console.log(bunUrl, nodeUrl);
    let allReady = false;
    while (allReady === false) {
        const nodeResult = await agent.get(`${nodeUrl}/hello`);
        const bunResult = await agent.get(`${bunUrl}/hello`);
        allReady = nodeResult.status === 200 && bunResult.status === 200;
    }
    console.log('--- Node and Bun are ready for testing ---');

    doHello(bunUrl, nodeUrl).then(() => {
        doShorten(bunUrl, nodeUrl).then(() => {
            doOriginal(bunUrl, nodeUrl).then(() => {
                printScore();
            }).catch((e) => console.error(e))
        }).catch((e) => console.error(e))
    }).catch((e) => console.error(e))

}

main();