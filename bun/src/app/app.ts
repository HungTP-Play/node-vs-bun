export class BvnApp {
    routes(): { [key: string]: (...args: any[]) => void } {
        return {
            "hello": (...arg: any[]) => { },
            "shorten": (...arg: any[]) => { },
            "original/:id": (...arg: any[]) => { },
        }
    }
}