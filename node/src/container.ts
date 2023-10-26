import { Container } from 'inversify';
import 'reflect-metadata';
import { ConsoleLogger, Logger } from './logger';

export const TYPES = {
    Logger: Symbol.for("Logger")
}

const nvbContainer = new Container();
nvbContainer.bind<Logger>(TYPES.Logger).to(ConsoleLogger)

export { nvbContainer };
