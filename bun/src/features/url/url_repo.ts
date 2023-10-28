import { createClient } from "redis";
import { NvbResult } from "../../domain/result";
import { EMPTY_URL, NvbUrl } from "../../domain/url";

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

    private client = createClient({
        url: `redis://${process.env.APP_REDIS_HOST ?? "redis"}:${process.env.APP_REDIS_PORT ?? "6379"}`
    });

    private async redis() {
        if (!this.client.isReady && !this.client.isOpen) {
            this.client.connect();
        }
        return this.client;
    }

    private KEYS = {
        TOTAL_RECORD: 'total_record',
        URL: 'url'
    }

    private totalRecordKey(): string {
        return this.KEYS.TOTAL_RECORD
    }

    private urlKey(id: string): string {
        return `${this.KEYS.URL}::${id}`;
    }

    async totalRecord(): Promise<NvbResult<number>> {
        try {
            const redis = await this.redis();
            const currentTotal = await redis.get(this.totalRecordKey());
            if (currentTotal === null) {
                // Not set yet
                await redis.set(this.totalRecordKey(), 0);

                return {
                    data: 0,
                    error: undefined
                }
            }

            return {
                data: Number.parseInt(currentTotal),
                error: undefined
            }
        }
        catch (e) {
            return {
                data: -1,
                error: e as Error
            }
        }
    }

    async getUrl(id: string): Promise<NvbResult<NvbUrl>> {
        try {
            const redis = await this.redis();
            const key = this.urlKey(id);
            const cachedData = await redis.get(key);
            if (cachedData === null) {
                return {
                    data: EMPTY_URL,
                    error: new Error(`No data for id=${id} is set`)
                }
            }

            return {
                data: NvbUrl.fromJson(cachedData),
                error: undefined
            }
        }
        catch (e) {
            return {
                data: EMPTY_URL,
                error: e as Error
            }
        }
    }

    async setUrl(url: NvbUrl): Promise<NvbResult<any>> {
        try {
            const redis = await this.redis();
            const id = url.urlId;
            if (id === undefined) {
                return {
                    data: -1,
                    error: new Error('Url doesn\'t have id to set')
                }
            }

            const key = this.urlKey(id);
            await Promise.all([
                redis.incr(this.totalRecordKey()),
                redis.set(key, url.toJson()),
            ]);

            return {
                data: 1,
                error: undefined,
            }
        }
        catch (e) {
            return {
                data: undefined,
                error: e as Error
            }
        }
    }

}