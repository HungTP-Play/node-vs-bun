import { createLogger, format, transports } from "winston"

export interface Logger {
    log(...args: any[]): void
    info(...args: any[]): void
    debug(...args: any[]): void
    warn(...args: any[]): void
    error(...args: any[]): void
}

export class WinstonLogger implements Logger {
    private logger = createLogger({
        level: process.env.LOG_LEVEL?.toLowerCase() ?? "info",
        transports: [
            new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.label({
                        label: 'NvB'
                    }),
                    format.timestamp(),
                    format.printf(content => {
                        const { level, message, label, timestamp } = content
                        return `${timestamp} [${level}] [${label}]: ${message}`
                    })
                )
            })
        ]
    });

    log(...args: any[]): void {
        this.logger.info(args.join(" "))
    }

    info(...args: any[]): void {
        this.logger.info(args.join(" "))
    }

    debug(...args: any[]): void {
        this.logger.debug(args.join(" "))
    }

    warn(...args: any[]): void {
        this.logger.warn(args.join(" "))
    }

    error(...args: any[]): void {
        this.logger.error(args.join(" "))
    }
}