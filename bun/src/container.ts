import { Container } from 'inversify';
import 'reflect-metadata';
import { App, NvBApp } from './app/app';
import { ConfigManager, NvBAppConfigManager } from './app/app_config';
import { Logger, WinstonLogger } from './logger';
import { NvbUrlManager, RedisStackNvbUrlManager } from './service/url_manager';

export const TYPES = {
    Logger: Symbol.for("Logger"),
    AppConfigManager: Symbol.for('AppConfigManager'),
    App: Symbol.for('App'),
    UrlManager: Symbol.for('UrlManager'),
}

const nvbContainer = new Container();
nvbContainer.bind<Logger>(TYPES.Logger).to(WinstonLogger)
nvbContainer.bind<ConfigManager>(TYPES.AppConfigManager).to(NvBAppConfigManager);
nvbContainer.bind<App>(TYPES.App).to(NvBApp);
nvbContainer.bind<NvbUrlManager>(TYPES.UrlManager).to(RedisStackNvbUrlManager);

export { nvbContainer };
