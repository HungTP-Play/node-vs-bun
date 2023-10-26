import { describe, expect, test } from 'bun:test';
import { NvbUrl, NvbUrlInvalidUrlException } from './url'; // Update with the correct path to your code

describe('NvbUrl', () => {
    describe('fromJsonString', () => {
        test('should create NvbUrl object from valid JSON string', () => {
            const jsonString = '{"original": "https://example.com", "shorten": "https://short.com"}';

            const result = NvbUrl.fromJsonString(jsonString);

            expect(result.original).toBe('https://example.com');
            expect(result.shorten).toBe('https://short.com');
        });

        test('should throw error for invalid JSON string', () => {
            const jsonString = '{invalid json}';

            expect(() => {
                NvbUrl.fromJsonString(jsonString);
            }).toThrow();
        });
    });

    describe('constructor', () => {
        test('should create NvbUrl object with valid original URL', () => {
            const originalUrl = 'https://example.com';

            const result = new NvbUrl(originalUrl);

            expect(result.original).toBe(originalUrl);
            expect(result.shorten).toBeUndefined();
        });

        test('should throw error for invalid original URL', () => {
            const originalUrl = 'invalid-url';

            try{
                new NvbUrl(originalUrl);
            }
            catch(e){
                expect(e).toBe(new NvbUrlInvalidUrlException())
            }
        });
    });

    describe('toObj', () => {
        test('should return the object representation of NvbUrl', () => {
            const originalUrl = 'https://example.com';
            const shortenUrl = 'https://short.com';
            const nvbUrl = new NvbUrl(originalUrl, shortenUrl);

            const result = nvbUrl.toObj();

            expect(result).toEqual({
                original: originalUrl,
                shorten: shortenUrl,
            });
        });
    });

    describe('toJson', () => {
        test('should return the JSON representation of NvbUrl', () => {
            const originalUrl = 'https://example.com';
            const shortenUrl = 'https://short.com';
            const nvbUrl = new NvbUrl(originalUrl, shortenUrl);

            const result = nvbUrl.toJson();

            expect(result).toBe(`{"original":"${originalUrl}","shorten":"${shortenUrl}"}`);
        });
    });

    describe('toString', () => {
        test('should return the string representation of NvbUrl', () => {
            const originalUrl = 'https://example.com';
            const shortenUrl = 'https://short.com';
            const nvbUrl = new NvbUrl(originalUrl, shortenUrl);

            const result = nvbUrl.toString();

            expect(result).toBe(`[NvbUrl] -- {"original":"${originalUrl}","shorten":"${shortenUrl}"}`);
        });
    });
});