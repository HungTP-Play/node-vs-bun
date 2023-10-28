import { beforeAll, beforeEach, describe, expect, it, mock, test } from "bun:test";
import { NvbContainer, TYPES } from "../../container";
import { NvbResult } from "../../domain/result";
import { EMPTY_URL, NvbUrl } from "../../domain/url";
import { NvbUrlRepo } from "./url_repo";
import { NvbUrlService } from "./url_service";

describe('Test UrlService', () => {
    let service: NvbUrlService;
    let mockUrlRepo: NvbUrlRepo = {
        totalRecord: mock(async (): Promise<NvbResult<number>> => {
            return {
                data: 1,
                error: undefined
            }
        }),
        getUrl: mock(async (id: string): Promise<NvbResult<NvbUrl>> => {
            if (id === '1') {
                return {
                    data: new NvbUrl('http://google.com', 'http://some.domain/1'),
                    error: undefined
                }
            }

            if (id === '2') {
                return {
                    data: EMPTY_URL,
                    error: new Error('Cannot get url of id=2')
                }
            }

            return {
                data: new NvbUrl('http://google.com'),
                error: undefined
            }
        }),

        setUrl: mock(async (url: NvbUrl): Promise<NvbResult<any>> => {
            if (url.originalUrl === 'http://google.com/1') {
                return {
                    data: 1,
                    error: undefined
                }
            }

            if (url.originalUrl === 'http://google.com/2') {
                return {
                    data: 1,
                    error: new Error('Cannot set url to db')
                }
            }

            return {
                data: 1,
                error: undefined
            }
        })
    }

    beforeAll(() => {
        const container = NvbContainer.getInstance();
        container.set<NvbUrlRepo>(TYPES.UrlRepo, mockUrlRepo);
    });

    beforeEach(() => {
        service = new NvbUrlService();
    });

    describe('Test newId', () => {
        it('Should return the correct Base62-encoded string for a given count', () => {
            const count = 63;
            const expectedOutput = '11';

            const result = service.newId(count);

            expect(result).toBe(expectedOutput);
        });

        it('Should return an empty string when the count is 0', () => {
            const count = 0;
            const expectedOutput = '';

            const result = service.newId(count);

            expect(result).toBe(expectedOutput);
        });

    });

    describe('shortenUrl', () => {

        test('APP_PORT', () => {
            process.env.APP_PORT = '2222';
            it('Should return the shortened URL with the provided newId -- use default host and APP_PORT', () => {
                const newId = '3D7';
                const expectedOutput = 'http://localhost:2222/3D7';

                const result = service.shortenUrl(newId);

                expect(result).toBe(expectedOutput);
            });
        })

        test('APP_BASE_URL', () => {
            process.env.APP_BASE_URL = 'http://nvb.com'
            it('Should return the shortened URL with the provided newId -- use APP_BASE_URL', () => {
                const newId = '3D7';
                const expectedOutput = 'http://nvb.com/3D7';

                const result = service.shortenUrl(newId);

                expect(result).toBe(expectedOutput);
            });
        })
    });

    describe('shorten', () => {
        process.env.APP_BASE_URL = 'http://nvb.com'
        it('Should return the shortened URL with the provided originalUrl', async () => {
            const originalUrl = 'http://example.com';
            const expectedShortenUrl = 'http://nvb.com/2';

            const result = await service.shorten(originalUrl);

            expect(result.data.originalUrl).toBe(originalUrl);
            expect(result.data.shortenUrl).toBe(expectedShortenUrl);
            expect(result.error).toBeUndefined();
        });


        it('Should return set nvb OK', async () => {
            const originalUrl = 'http://google.com/1';

            const result = await service.shorten(originalUrl);

            expect(result.data.originalUrl).toBe(originalUrl);
            expect(result.error).toBeUndefined()
        });

        it('Should return set nvb with error', async () => {
            const originalUrl = 'http://google.com/2';

            const result = await service.shorten(originalUrl);

            expect(result.data.originalUrl).toBe(EMPTY_URL.originalUrl);
            expect(result.error?.message).toBe('Cannot set url to db')
        });
    });

    describe('original', () => {
        it('Should return the original URL with the provided shortenId', async () => {
            const id = '1';

            const result = await service.original(id);

            expect(result.data.originalUrl).toBe('http://google.com');
            expect(result.data.shortenUrl).toBe('http://some.domain/1');
            expect(result.error).toBeUndefined();
        });


        it('Should return the error', async () => {
            const id = '2';
            const result = await service.original(id);

            expect(result.data.originalUrl).toBe('http://empty.url');
            expect(result.data.shortenUrl).toBeUndefined();
            expect(result.error?.message).toBe('Cannot get url of id=2');
        });
    });
});