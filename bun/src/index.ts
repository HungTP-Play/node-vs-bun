import Koa from 'koa';
import { TYPES, nvbContainer } from './container';
import { Logger } from './logger';

const logger = nvbContainer.get<Logger>(TYPES.Logger);

const app = new Koa();

logger.log(`APP IS RUNNING ON PORT 3333`);
app.listen(3333);