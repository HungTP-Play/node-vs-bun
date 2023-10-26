import { injectable } from "inversify";
import 'reflect-metadata';

export interface Logger {
    log: (...args: any[]) => void
}

@injectable()
export class ConsoleLogger implements Logger {
    log(...args: any[]) {
        console.log(...args);
    }
}