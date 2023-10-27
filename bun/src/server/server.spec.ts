import { beforeEach, describe, expect, test } from "bun:test";
import { Body, Headers, NvbApp, NvbController, Params, Queries, Route } from "../app/interfaces";
import { NvbResult } from "../domain/result";
import { NvbServer } from "./server";

describe('NvbServer', () => {
    let server: NvbServer;
    beforeEach(() => {
        // Mock the required dependencies
        const mockRoutes: Route[] = [
            {
                template: '/hello', method: 'GET', handler: async (ctx: any, headers?: Headers, params?: Params, body?: Body, queries?: Queries): Promise<NvbResult<any>> => {
                    return {
                        data: 'OK',
                        error: undefined
                    }
                }
            }
        ];
        const mockApp: NvbApp = {
            routes: () => mockRoutes,
            addController: (controller: NvbController) => { }
        };

        server = new NvbServer(mockApp);
    });

    describe("Test pathParams", () => {
        const cases = [{
            name: "Should return params (Empty)",
            path: "/hello",
            template: "/hello",
            params: [],
        }, {
            name: "Should return params with values",
            path: "/hello/1123/haha/2234",
            template: "/hello/:id/haha/:id2",
            params: ['1123', '2234'],
        }, {
            name: "Should return params ignore trailing splash",
            path: "/hello/1111/",
            template: "/hello/:id",
            params: ['1111'],
        }];

        for (const c of cases) {
            test(c.name, () => {
                const params = server.pathParams(c.path, c.template);
                expect(params).toEqual(c.params)
            });
        }
    });

    describe("Test isMatch", () => {
        const cases = [{
            name: "Should match -- 0 params",
            path: "/hello",
            template: "/hello",
            isMatch: true,
        }, {
            name: "Should match -- 1 params",
            path: "/hello/1123",
            template: "/hello/:id",
            isMatch: true,
        }, {
            name: "Should match -- 1 params trailing splash",
            path: "/hello/1111/",
            template: "/hello/:id",
            isMatch: true
        }, {
            name: "Should not match -- 2 params",
            path: "/hello/1111/vvv/2222",
            template: "/hello/:id/vvv",
            isMatch: false
        }];

        for (const c of cases) {
            test(c.name, () => {
                const params = server.isMatch(c.path, c.template);
                expect(params).toEqual(c.isMatch)
            });
        }
    });

    describe("Test queriesParse", () => {
        const cases: {
            name:string,
            path:string,
            queries: Queries
        }[] = [{
            name: "Should give empty queries",
            path: "/hello",
            queries: {},
        }, {
            name: "Should give 1 queries",
            path: "/hello?hello=haha",
            queries: {
                "hello": "haha"
            },
        }, {
            name: "Should match -- 2 queries",
            path: "/hello/1111?hello=haha&haha=hello",
            queries: {
                "hello": "haha",
                "haha": "hello"
            },
        }];

        for (const c of cases) {
            test(c.name, () => {
                const queries = server.queriesParse(c.path);
                expect(queries).toEqual(c.queries)
            });
        }
    });
});