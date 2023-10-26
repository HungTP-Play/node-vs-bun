import { injectable } from "inversify";
import { NvbUrl } from "../domain/url";

export interface NvbUrlManager {
    shorten(url: NvbUrl): Promise<NvbUrl>;
    get(shortenId: string): Promise<NvbUrl>;
}

@injectable()
export class RedisStackNvbUrlManager implements NvbUrlManager {
    get(shortenId: string): Promise<NvbUrl> {
        throw new Error("Method not implemented.");
    }
    shorten(url: NvbUrl): Promise<NvbUrl> {
        throw new Error("Method not implemented.");
    }
}