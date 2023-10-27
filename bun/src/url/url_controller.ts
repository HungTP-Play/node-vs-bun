import { Container, injectable } from "inversify";
import { Body, Controller, Headers, Params, Queries, Route, RouteMethods } from "../app/controller_interface";
import { TYPES } from "../container";
import { NvbResult } from "../domain/result";
import { NvbUrlService } from "./url_service";


@injectable()
export class UrlController implements Controller {
    private service: NvbUrlService | undefined;
    constructor(container: Container) {
        this.service = container.get<NvbUrlService>(TYPES.UrlService);
    }

    async handleHello(ctx: any, headers?: Headers, params?: Params, queries?: Queries, body?: Body): Promise<NvbResult<any>> {
        return {
            data: 'OK',
            error: undefined,
        }
    }

    async handleShorten(ctx: any, headers?: Headers, params?: Params, queries?: Queries, body?: Body): Promise<NvbResult<any>> {
        return {
            data: 'OK',
            error: undefined,
        }
    }

    async handleOriginal(ctx: any, headers?: Headers, params?: Params, queries?: Queries, body?: Body): Promise<NvbResult<any>> {
        return {
            data: 'OK',
            error: undefined,
        }
    }

    routes(): Route[] {
        return [
            {
                pattern: '/hello',
                handler: this.handleHello,
                method: RouteMethods.GET
            },
            {
                pattern: '/shorten',
                handler: this.handleShorten,
                method: RouteMethods.POST
            },
            {
                pattern: '/original/:id',
                handler: this.handleOriginal,
                method: RouteMethods.GET
            }
        ]
    }
}