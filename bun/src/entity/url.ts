import { BvnUrlInvalidException } from "./error";

export class BvnUrl {
    constructor(private original: string) {
        this.validateUrl(this.original);
    }

    private validateUrl(url: string) {
        const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:\w+(?:\.(?:\w+))*)(?:(?:\/|\/(?:[\w#!:.?+=&%@!\-\/]))?(?:[^\s]*))?$/;
        const isValidUrl = urlRegex.test(url);
        if (!isValidUrl) {
            throw new BvnUrlInvalidException();
        }
    }
}