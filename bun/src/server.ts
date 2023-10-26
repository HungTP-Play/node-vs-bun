import Koa from 'koa';
import { App } from './app/app';
import { TYPES, nvbContainer } from './container';
import { Logger } from './logger';
import { nvbRoutesMiddleware } from './nvbroutes.middleware';

export class NvbServer {
    private logger: Logger = nvbContainer.get<Logger>(TYPES.Logger);
    private app: App = nvbContainer.get<App>(TYPES.App);
    private server: Koa<Koa.DefaultState, Koa.DefaultContext> = new Koa();

    start(): void {
        const port = this.app.port();
        const routes = this.app.routes();

        this.server.use(nvbRoutesMiddleware(routes, this.logger));
        for (const r in routes) {
            this.logger.info(`[NvbServer] -- Setup route ${r}`);
        }

        this.server.listen(port);
        this.logger.info(`[NvbServer] -- The server listens on port ${port}`);
    }
}