import { NvbResult } from "../../domain/result";
import { NvbUrl } from "../../domain/url";

export interface NvbUrlRepo {
    totalRecord(): Promise<NvbResult<number>>;

    getUrl(id: string): Promise<NvbResult<NvbUrl>>;
    setUrl(url: NvbUrl): Promise<NvbResult<any>>;
}

export class RedisUrlRepo implements NvbUrlRepo {

    private static instance: NvbUrlRepo;

    private constructor() { }

    static getInstance(): NvbUrlRepo {
        if (RedisUrlRepo.instance === undefined) {
            RedisUrlRepo.instance = new RedisUrlRepo();
        }
        return RedisUrlRepo.instance;
    }

    totalRecord(): Promise<NvbResult<number>> {
        throw new Error("Method not implemented.");
    }
    
    getUrl(id: string): Promise<NvbResult<NvbUrl>> {
        throw new Error("Method not implemented.");
    }
    
    setUrl(url: NvbUrl): Promise<NvbResult<any>> {
        throw new Error("Method not implemented.");
    }

}