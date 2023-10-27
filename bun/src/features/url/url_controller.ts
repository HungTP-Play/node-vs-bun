import { Body, Headers, NvbController, Params, Queries, Route } from "../../app/interfaces";
import { NvbContainer, TYPES } from "../../container";
import { NvbUrlService } from "./url_service";

export class NvbUrlController implements NvbController {
    private container = NvbContainer.getInstance();
    private service: NvbUrlService = this.container.get<NvbUrlService>(TYPES.UrlService);

    async helloHandler(ctx: any, headers?: Headers, params?: Params, body?: Body, queries?: Queries) {
        return {
            data: 'OK',
            error: undefined
        }
    }

    async shortenHandler(ctx: any, headers?: Headers, params?: Params, body?: Body, queries?: Queries) {
        return {
            data: 'Shorten OK',
            error: undefined
        }
    }

    async originalHandler(ctx: any, headers?: Headers, params?: Params, body?: Body, queries?: Queries) {
        return {
            data: 'Original OK',
            error: undefined
        }
    }

    routes(): Route[] {
        return [
            {
                template: '/hello',
                handler: this.helloHandler,
                method: 'GET'
            },
            {
                template: '/shorten',
                handler: this.shortenHandler,
                method: 'POST'
            },
            {
                template: '/original/:id',
                handler: this.originalHandler,
                method: 'GET'
            }
        ]
    }
}