import Koa from 'koa';
import { NvbApp } from "../app/interfaces";
import { NvbContainer, TYPES } from '../container';
import { Logger } from '../logger';

export class NvbServer {
    private container = NvbContainer.getInstance();
    private server = new Koa();
    private logger: Logger = this.container.get<Logger>(TYPES.Logger);
    constructor(private app: NvbApp) { }

    start() {
        const port = process.env.APP_PORT ?? "3333"
        this.server.listen(port);
        this.logger.info(`[NvbServer] -- Server listens on port ${port}`);
    }
}