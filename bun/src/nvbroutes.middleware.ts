import Koa from 'koa';
import { AppRouteHandleFunc } from "./app/app";
import { Logger } from './logger';

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

export function nvbRoutesMiddleware(routes: Record<string, AppRouteHandleFunc<any>>, logger?: Logger, prefix?: string) {
    return async (ctx: Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>) => {
        const path = ctx.request.path;
        for (const r in routes) {
            if (isRouteMatch(path, r)) {
                logger?.info(`[${prefix ? prefix : 'NbvServer'}] -- Enter route=${r}`);
                const result = await routes[r](ctx, [], []);
                if (result.error !== undefined) {
                    exceptionFilterMiddleware(ctx, result.error);
                    logger?.info(`[${prefix ? prefix : 'NbvServer'}] -- Route=${r} -- Error ${JSON.stringify({ err: result.error })}`);
                } else {
                    responsePrepareMiddleware(ctx, result.data);
                    logger?.info(`[${prefix ? prefix : 'NbvServer'}] -- Route=${r} -- Data`);
                }
            }
        }
    }
}