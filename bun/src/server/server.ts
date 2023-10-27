import Koa from 'koa';
import { NvbApp, Params, Route } from "../app/interfaces";
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

    private pathParams(path: string, template: string): Params {
        const pathNoTrailing = path.split("/").filter((e) => e !== "");
        const templateNoTrailing = template.split("/");
        const params: Params = [];

        for (const i in templateNoTrailing) {
            if (templateNoTrailing[i].startsWith(":")) {
                params.push(pathNoTrailing[i]);
            }
        }

        return params;
    }

    private isMatch(path: string, template: string): boolean {
        const pathNoTrailing = path.split("/").filter((e) => e !== "");
        const templateNoTrailing = template.split("/");

        if (templateNoTrailing.length !== pathNoTrailing.length) return false;

        for (const i in templateNoTrailing) {
            if (templateNoTrailing[i].startsWith(":")) continue;

            if (templateNoTrailing[i] !== pathNoTrailing[i]) return false;
        }

        return true;
    }

    private bindRoutes(routes: Route[]) {
        this.server.use((ctx) => {
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

                    const params = this.pathParams(path, r.template);
                    this.logger.info(`[[NvbServer]] -- params=${JSON.stringify(params)}`);
                }
            }
        });
    }

    start() {
        this.bindRoutes(this.app.routes());

        const port = process.env.APP_PORT ?? "3333"
        this.server.listen(port);
        this.logger.info(`[NvbServer] -- Server listens on port ${port}`);
    }
}