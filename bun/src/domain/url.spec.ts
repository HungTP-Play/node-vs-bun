import { describe, expect, it } from "bun:test";
import { NvbUrlInvalidUrlException } from "./error";
import { NvbUrl } from "./url";

describe('NvbUrl', () => {
    describe('fromJson', () => {
        it('should create NvbUrl instance from valid JSON', () => {
            const json = '{"original": "https://www.example.com", "shorten": "https://short.com"}';
            const nvbUrl = NvbUrl.fromJson(json);

            expect(nvbUrl).toBeInstanceOf(NvbUrl);
            expect(nvbUrl.originalUrl).toBe('https://www.example.com');
            expect(nvbUrl.shortenUrl).toBe('https://short.com');
        });

        it('should throw NvbUrlInvalidUrlException when original URL is missing', () => {
            const json = '{"shorten": "https://short.com"}';

            try {
                NvbUrl.fromJson(json);
            }
            catch (e) {
                expect(e).toBeInstanceOf(NvbUrlInvalidUrlException);
            }

        });
    });

    describe('constructor', () => {
        it('should create NvbUrl instance with valid original URL', () => {
            const original = 'https://www.example.com';
            const nvbUrl = new NvbUrl(original);

            expect(nvbUrl).toBeInstanceOf(NvbUrl);
            expect(nvbUrl.originalUrl).toBe(original);
            expect(nvbUrl.shortenUrl).toBeUndefined();
        });

        it('should throw NvbUrlInvalidUrlException with invalid original URL', () => {
            const invalidUrl = 'invalidurl';
            try {
                new NvbUrl(invalidUrl)
            }
            catch (e) {
                expect(e).toBeInstanceOf(NvbUrlInvalidUrlException);
            }
        });
    });

    describe('toJson', () => {
        it('should return JSON representation of NvbUrl instance', () => {
            const original = 'https://www.example.com';
            const shorten = 'https://short.com';
            const nvbUrl = new NvbUrl(original, shorten);

            const json = nvbUrl.toJson();
            const parsedJson = JSON.parse(json);

            expect(parsedJson.original).toBe(original);
            expect(parsedJson.shorten).toBe(shorten);
        });
    });
});