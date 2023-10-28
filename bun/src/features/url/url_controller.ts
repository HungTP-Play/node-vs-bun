import { Body, Headers, NvbController, Params, Queries, Route } from "../../app/interfaces";
import { NvbContainer, TYPES } from "../../container";
import { NvbUrlService } from "./url_service";

export type ShortenDto = {
    original: string
}

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
        if (!body) {
            return {
                data: '',
                error: new Error('Empty body - c:400')
            }
        }

        const dto = JSON.parse(body as string) as ShortenDto;
        if (!dto.original) {
            return {
                data: '',
                error: new Error('Empty original - c:400')
            }
        }

        const result = await this.service.shorten(dto.original);
        if (result.error !== undefined) {
            // TODO: Filter error here
            return {
                data: '',
                error: result.error
            }
        }

        return {
            data: result.data.toJson(),
            error: undefined
        }
    }

    async originalHandler(ctx: any, headers?: Headers, params?: Params, body?: Body, queries?: Queries) {
        if (!params || params?.length === 0) {
            return {
                data: '',
                error: new Error('No id to search - code:400')
            }
        }

        const id = params[0];
        const result = await this.service.original(id);
        if (result.error !== undefined) {
            // TODO: Filter error here
            return {
                data: '',
                error: result.error
            }
        }

        return {
            data: result.data.toJson(),
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