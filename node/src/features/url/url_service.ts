import { NvbContainer, TYPES } from "../../container";
import { NvbResult } from "../../domain/result";
import { EMPTY_URL, NvbUrl } from "../../domain/url";
import { Logger } from "../../logger";
import { NvbUrlRepo } from "./url_repo";

export class NvbUrlService {
    private container = NvbContainer.getInstance();
    private repo = this.container.get<NvbUrlRepo>(TYPES.UrlRepo);
    private logger: Logger = this.container.get<Logger>(TYPES.Logger);
    private BASE_URL = process.env.APP_BASE_URL ?? `http://localhost:${process.env.APP_PORT}`

    newId(count: number): string {
        const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let output = '';

        while (count > 0) {
            output = base62Chars.charAt(count % 62) + output;
            count = Math.floor(count / 62);
        }

        return output;

    }

    shortenUrl(newId: string): string {
        return `${this.BASE_URL}/${newId}`;
    }

    async shorten(originalUrl: string): Promise<NvbResult<NvbUrl>> {
        try {
            const original = new NvbUrl(originalUrl);

            const currentCountResult = await this.repo.totalRecord();
            if (currentCountResult.error !== undefined) {
                this.logger.error(`[NvbUrlService] -- shorten -- error=${currentCountResult.error}`);
                return {
                    data: EMPTY_URL,
                    error: currentCountResult.error
                };
            }

            const newId = this.newId(currentCountResult.data + 1);
            const shortenUrl = this.shortenUrl(newId);

            original.setShorten = shortenUrl;
            original.setId = newId;

            const saveOk = await this.repo.setUrl(original);
            if (saveOk.error !== undefined) {
                this.logger.error(`[NvbUrlService] -- shorten -- error=${saveOk.error}`);
                return {
                    data: EMPTY_URL,
                    error: saveOk.error
                }
            }

            this.logger.info(`[NvbUrlService] -- shorten -- Ok`);
            return {
                data: original,
                error: undefined,
            }
        }
        catch (e) {
            this.logger.error(`[NvbUrlService] -- shorten -- error=${e}`);
            return {
                data: EMPTY_URL,
                error: e as Error
            }
        }
    }

    async original(shortenId: string): Promise<NvbResult<NvbUrl>> {
        try {
            const urlFromDb = await this.repo.getUrl(shortenId);
            if (urlFromDb.error !== undefined) {
                this.logger.error(`[NvbUrlService] -- original -- error=${urlFromDb.error}`);
                return {
                    data: EMPTY_URL,
                    error: urlFromDb.error
                }
            }

            this.logger.info(`[NvbUrlService] -- original -- Ok`);
            return {
                data: urlFromDb.data,
                error: undefined
            }
        }
        catch (e) {
            this.logger.error(`[NvbUrlService] -- original -- error=${e}`);
            return {
                data: EMPTY_URL,
                error: e as Error
            }
        }
    }
}