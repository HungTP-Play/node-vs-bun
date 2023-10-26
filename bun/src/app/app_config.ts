import { injectable } from "inversify";
import 'reflect-metadata';
import { TYPES, nvbContainer } from "../container";
import { Logger } from "../logger";
import { DEFAULT_PORT } from "./constants";

export interface ConfigManager {
    hello(): void
    port(): number;
}

@injectable()
export class NvBAppConfigManager implements ConfigManager {
    private logger: Logger = nvbContainer.get<Logger>(TYPES.Logger);
    
    port(): number {
        if(process.env.PORT){
            return Number.parseInt(process.env.PORT);
        }

        return DEFAULT_PORT;
    }
    
    hello() {
        this.logger.info('[NvBAppConfigManager] -- hello')
    }
}