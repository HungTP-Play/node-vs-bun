import { NvbContainer, TYPES } from "../../container";
import { NvbResult } from "../../domain/result";
import { EMPTY_URL, NvbUrl } from "../../domain/url";
import { NvbUrlRepo } from "./url_repo";

export class NvbUrlService {
    private container = NvbContainer.getInstance();
    private repo = this.container.get<NvbUrlRepo>(TYPES.UrlRepo);
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
                return {
                    data: EMPTY_URL,
                    error: currentCountResult.error
                };
            }

            const newId = this.newId(currentCountResult.data + 1);
            const shortenUrl = this.shortenUrl(newId);

            original.setShorten = shortenUrl;

            const saveOk = await this.repo.setUrl(original);
            if (saveOk.error !== undefined) {
                return {
                    data: EMPTY_URL,
                    error: saveOk.error
                }
            }

            return {
                data: original,
                error: undefined,
            }
        }
        catch (e) {
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
                return {
                    data: EMPTY_URL,
                    error: urlFromDb.error
                }
            }

            return {
                data: urlFromDb.data,
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
}