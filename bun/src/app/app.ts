import { injectable } from "inversify";
import 'reflect-metadata';
import { TYPES, nvbContainer } from "../container";
import { Route, UrlController } from "../url/url_controller";
import { ConfigManager } from "./app_config";

export interface App {
    routes(): Route[];
    port(): number;
}


@injectable()
export class NvBApp implements App {
    private configManager: ConfigManager = nvbContainer.get<ConfigManager>(TYPES.AppConfigManager);
    private urlController: UrlController = new UrlController(nvbContainer);


    routes(): Route[] {
        return [
            ...this.urlController.routes()
        ]
    }

    port(): number {
        return this.configManager.port();
    }
}