import { injectable } from "inversify";
import 'reflect-metadata';
import { TYPES, nvbContainer } from "../container";
import { NvbResult } from "../domain/result";
import { NvbUrlManager } from "../service/url_manager";
import { ConfigManager } from "./app_config";

export interface App {
    hello(): void
    routes(): Record<string, AppRouteHandleFunc<any>>;
    port(): number;
}

export type AppRouteHandleFunc<T> = (ctx: any, params?: string[], body?: any) => Promise<NvbResult<T>>

@injectable()
export class NvBApp implements App {
    private configManager: ConfigManager = nvbContainer.get<ConfigManager>(TYPES.AppConfigManager);
    private urlManager: NvbUrlManager = nvbContainer.get<NvbUrlManager>(TYPES.UrlManager);

    hello() {
        this.configManager.hello();
    }

    routes(): Record<string, AppRouteHandleFunc<any>> {
        return {
            "/shorten": async (ctx: any, params?: string[], body?: any) => {
                return <any>{
                    data: 'ok',
                    error: undefined,
                }
            },
            "/original/:shortenId": async (ctx: any, params?: string[], body?: any) => {
                return <any>{
                    data: undefined,
                    error: new Error('this is demo error'),
                }
            },
            "/hello": async (ctx: any, params?: string[], body?: any) => {
                return <any>{
                    data: "OK",
                    error: undefined,
                }
            }
        }
    }

    port(): number {
        return this.configManager.port();
    }
}