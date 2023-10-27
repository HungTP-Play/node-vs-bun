import Koa from 'koa';
import { Logger } from './logger';
import { Route } from './url/url_controller';

export enum StatusCodes {
    // 2xx
    OK = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    // 4xx
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllow = 405,
    // 5xx
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502
}

export function exceptionFilterMiddleware(
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
    err: Error,
    code?: number,
) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify({
        err,
    })
}

export function responsePrepareMiddleware(
    ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>,
    data: any,
    code?: number
) {
    ctx.response.status = 200;
    ctx.response.body = data;
}

export function isRouteMatch(value: string, template: string): boolean {
    const valueParts = value.split('/').filter((e) => e !== "");
    const templateParts = template.split('/').filter((e) => e !== "");

    if (valueParts.length !== templateParts.length) {
        return false;
    }

    for (let i = 0; i < templateParts.length; i++) {
        const templatePart = templateParts[i];

        if (templatePart.startsWith(':')) {
            continue;
        }

        if (templatePart !== valueParts[i]) {
            return false;
        }
    }

    return true;
}

export function extractPathParam(path: string, pathTemplate: string) {
    const inputParts = path.split('/');
    const templateParts = pathTemplate.split('/');

    const extractedInfo = [];

    for (let i = 0; i < templateParts.length; i++) {
        const templatePart = templateParts[i];

        if (templatePart.startsWith(':')) {
            const infoValue = inputParts[i];
            extractedInfo.push(infoValue);
        }
    }

    return extractedInfo;
}

export function nvbRoutesMiddleware(routes: Route[], logger?: Logger, prefix?: string) {
    return async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>) => {
        const path = ctx.request.path;
        const method = ctx.request.method;

        for (const r of routes) {
            if (isRouteMatch(path, r.pattern)) {
                if (r.method.toString().toLowerCase() !== method.toLowerCase()) {
                    ctx.response.status = StatusCodes.MethodNotAllow;
                    ctx.response.body = JSON.stringify({
                        error: 'Wrong method'
                    });
                    return
                }

                const result = await r.handler(ctx);
                if (result.error !== undefined) {
                    exceptionFilterMiddleware(ctx, result.error);
                } else {
                    responsePrepareMiddleware(ctx, result.data);
                }
            }
        }
    }
}