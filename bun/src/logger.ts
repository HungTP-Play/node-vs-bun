import { injectable } from "inversify";
import 'reflect-metadata';
import winston from "winston";

export interface Logger {
    log(...args: any[]): void
    debug(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    error(...args: any[]): void;
}

@injectable()
export class ConsoleLogger implements Logger {
    log(...args: any[]) {
        console.log(...args);
    }

    debug(...args: any[]) {
        console.debug(...args);
    }

    info(...args: any[]) {
        console.info(...args);
    }

    warn(...args: any[]) {
        console.warn(...args);
    }

    error(...args: any[]) {
        console.error(...args);
    }
}

@injectable()
export class WinstonLogger implements Logger {
    private logger = winston.createLogger({
        level: 'debug',
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.label({
                        label: 'NvB',
                    }),
                    winston.format.timestamp(),
                    winston.format.printf((info: winston.Logform.TransformableInfo) => {
                        const { level, message, label, timestamp } = info
                        return `${timestamp} [${label}] [${level}]: ${message}`;
                    }),
                ),
            }),
        ],
    });

    constructor() {
        this.updateConfig();
    }

    private updateConfig() {
        if (process.env.LOG_LEVEL) {
            this.logger.level = process.env.LOG_LEVEL.toLowerCase();
        }
    }

    log(...args: any[]) {
        this.logger.info(args.join(" "));
    }

    info(...args: any[]) {
        this.logger.info(args.join(" "));
    }

    debug(...args: any[]) {
        this.logger.debug(args.join(" "));
    }

    warn(...args: any[]) {
        this.logger.warn(args.join(" "));
    }

    error(...args: any[]) {
        this.logger.error(args.join(" "));
    }
}