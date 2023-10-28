import Koa from 'koa';
import { Headers, NvbApp, Params, Queries, Route } from "../app/interfaces";
import { NvbContainer, TYPES } from '../container';
import { Logger } from '../logger';

enum StatusCode {
    // 2xx
    Ok = 200,
    Created = 201,
    Accepted = 202,
    // 4xx
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodIsNotAllow = 405,
    NotAccepted = 406,
    // 5xx
    InternalServerError = 500,
    NotImplement = 501,
    BadGateway = 502,
    Timeout = 504,
}

export class NvbServer {
    private container = NvbContainer.getInstance();
    private server = new Koa();
    private logger: Logger = this.container.get<Logger>(TYPES.Logger);
    constructor(private app: NvbApp) { }

    queriesParse(url: string): Queries {
        const queries: Queries = {};

        let queriesString: string | string[] = url.split("?");
        if (queriesString.length < 2) {
            return queries
        }

        queriesString = queriesString[queriesString.length - 1];
        const pairs = queriesString.split("&");
        for (const p of pairs) {
            const kv = p.split("=");
            queries[kv[0]] = kv[1];
        }

        return queries;
    }

    pathParams(path: string, template: string): Params {
        const pathNoTrailing = path.split("/").filter((e) => e !== "");
        const templateNoTrailing = template.split("/").filter((e) => e !== "");

        if (templateNoTrailing.length !== pathNoTrailing.length) return [];

        const params: Params = [];

        for (const i in templateNoTrailing) {
            if (templateNoTrailing[i].startsWith(":")) {
                params.push(pathNoTrailing[i]);
            }
        }

        return params;
    }

    isMatch(path: string, template: string): boolean {
        const pathNoTrailing = path.split("/").filter((e) => e !== "");
        const templateNoTrailing = template.split("/").filter((e) => e !== "");

        if (templateNoTrailing.length !== pathNoTrailing.length) return false;

        for (const i in templateNoTrailing) {
            if (templateNoTrailing[i].startsWith(":")) continue;

            if (templateNoTrailing[i] !== pathNoTrailing[i]) return false;
        }

        return true;
    }



    bindRoutes(routes: Route[]) {
        this.server.use(async (ctx) => {
            const path = ctx.request.path;
            const method = ctx.request.method;

            for (const r of routes) {
                if (this.isMatch(path, r.template)) {
                    if (method.toLowerCase() !== r.method.toLowerCase()) {
                        ctx.response.status = StatusCode.MethodIsNotAllow;
                        ctx.response.body = JSON.stringify({
                            error: "Method is not allow"
                        });
                    }

                    const params: Params = this.pathParams(path, r.template);
                    const headers: Headers = {}
                    const queries: Queries = this.queriesParse(path);
                    const body = JSON.stringify({
                        "original": "https://google.com"
                    })

                    this.logger.info(`[NvbServer] -- Enter route=${r.template}; headers=${JSON.stringify(headers)}; params=${JSON.stringify(params)}; queries=${JSON.stringify(queries)}`);

                    const result = await r.handler(ctx, headers, params, body, queries);

                    ctx.request.header['content-type'] = 'application/json'
                    if (result.error !== undefined) {
                        ctx.response.status = this.findCode(result.error.message);
                        ctx.response.body = {
                            error: result.error.message
                        }
                    } else {
                        ctx.response.status = StatusCode.Ok;
                        ctx.response.body = {
                            data: result.data
                        };
                    }
                }
            }
        });
    }

    findCode(message: string): number {
        const regex = /c:(\d{3})/; // Regular expression to match "c:" followed by three digits
        const match = message.match(regex);

        let wantCode = '';
        if (match && match[1]) {
            wantCode = match[1]; // Extract the captured digits
        }

        if (wantCode !== '') {
            switch (wantCode) {
                case "400":
                    return StatusCode.BadRequest
                case "401":
                    return StatusCode.Unauthorized
                case "403":
                    return StatusCode.Forbidden
                default:
                    return StatusCode.InternalServerError
            }
        }

        return StatusCode.InternalServerError;
    }

    start() {
        this.bindRoutes(this.app.routes());

        const port = process.env.APP_PORT ?? "3333"
        this.server.listen(port);
        this.logger.info(`[NvbServer] -- Server listens on port ${port}`);
    }
}