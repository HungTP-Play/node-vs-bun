
export const TYPES = {
    Logger: Symbol.for('Logger'),
    App: Symbol.for('App'),
    // URL
    UrlService: Symbol.for('UrlService')
}

/**
 * Simple dependency container
 */
export class NvbContainer {
    private static instance: NvbContainer | undefined = undefined;
    private constructor() { }
    private map: Record<string, any> = {};

    static getInstance(): NvbContainer {
        if (NvbContainer.instance === undefined) {
            NvbContainer.instance = new NvbContainer();
        }

        return NvbContainer.instance;
    }

    set<T>(key: Symbol, instance: T) {
        this.map[key.toString()] = instance;
    }

    get<T>(key: Symbol): T {
        return this.map[key.toString()] as T
    }
}