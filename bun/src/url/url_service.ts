import { injectable } from "inversify";
import { NvbUrl } from "../domain/url";

export interface NvbUrlService {
    shorten(url: NvbUrl): Promise<NvbUrl>;
    get(shortenId: string): Promise<NvbUrl>;
}

@injectable()
export class NvbUrlServiceImpl implements NvbUrlService {
    get(shortenId: string): Promise<NvbUrl> {
        throw new Error("Method not implemented.");
    }
    shorten(url: NvbUrl): Promise<NvbUrl> {
        throw new Error("Method not implemented.");
    }
}