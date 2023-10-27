import { NvbResult } from "../domain/result";

export type Headers = { [key: string]: string }
export type Queries = { [key: string]: string }
export type Params = any[];
export type Body = string | Buffer | Uint8Array;
export type ControllerHandlerFunc = (ctx: any, headers?: Headers, params?: Params, queries?: Queries, body?: Body) => Promise<NvbResult<any>>
export enum RouteMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    HEAD = 'HEAD',
    DELETE = 'DELETE'
}

export type Route = {
    pattern: string;
    method: RouteMethods;
    handler: ControllerHandlerFunc
}

export interface Controller {
    routes(): Route[]
}