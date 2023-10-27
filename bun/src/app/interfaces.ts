import { NvbResult } from "../domain/result";

export type Headers = { [key: string]: string }
export type Params = any[];
export type Body = string | Buffer | Uint8Array;
export type Queries = { [key: string]: string }

export type AppHandlerFunc = (ctx: any, headers?: Headers, params?: Params, body?: Body, queries?: Queries) => Promise<NvbResult<any>>;
export type Route = {
    template: string;
    method: string;
    handler: AppHandlerFunc
}

export interface NvbApp {
    routes(): Route[];
    addController(controller: NvbController): void
}

export interface NvbController {
    routes(): Route[];
}