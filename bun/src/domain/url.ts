import { NvbUrlInvalidUrlException } from "./error";


export class NvbUrl {
    static fromJson(str: string): NvbUrl {
        const o = JSON.parse(str);
        const original = o['original'];
        const shorten = o['shorten'];

        if (!original) {
            throw new NvbUrlInvalidUrlException();
        }

        return new NvbUrl(original, shorten);
    }

    constructor(private original: string, private shorten?: string) {
        this.validateUrl(this.original);
    }

    get originalUrl(): string {
        return this.original;
    }

    get shortenUrl(): string | undefined {
        return this.shorten
    }

    set setShorten(shortenUrl: string) {
        this.validateUrl(shortenUrl);

        this.shorten = shortenUrl;
    }

    private validateUrl(url: string) {
        let urlRegex = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?$/;

        const isValid = urlRegex.test(url);
        if (!isValid) {
            throw new NvbUrlInvalidUrlException();
        }
    }

    toJson(): string {
        return JSON.stringify({
            original: this.original,
            shorten: this.shorten,
        });
    }
}

export const EMPTY_URL = new NvbUrl('http://empty.url');
