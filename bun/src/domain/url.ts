export class NvbUrlInvalidUrlException extends Error{
    message = '[NvbUrlInvalidUrlException] -- invalid url format'
}

export class NvbUrl {
    static fromJsonString(jsonString: string): NvbUrl {
        const json = JSON.parse(jsonString);
        return new NvbUrl(json['original'], json['shorten']);
    }

    constructor(private originalUrl: string, private shortenUrl?: string) {
        this.validate(this.originalUrl);
    }

    private validate(url: string) {
        const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:\w+(?:\.(?:\w+))*)(?:(?:\/|\/(?:[\w#!:.?+=&%@!\-\/]))?(?:[^\s]*))?$/;
        const isValid = urlRegex.test(url);
        if (!isValid) {
            throw new NvbUrlInvalidUrlException();
        }
    }

    get original(): string {
        return this.originalUrl;
    }

    get shorten(): string | undefined {
        return this.shortenUrl;
    }

    toObj() {
        return {
            original: this.originalUrl,
            shorten: this.shortenUrl
        }
    }

    toJson() {
        return JSON.stringify(this.toObj());
    }

    toString() {
        return `[NvbUrl] -- ${this.toJson()}`
    }
}