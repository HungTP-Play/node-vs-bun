import { Container } from 'inversify';
import 'reflect-metadata';
import { App, NvBApp } from './app/app';
import { ConfigManager, NvBAppConfigManager } from './app/app_config';
import { Logger, WinstonLogger } from './logger';
import { NvbUrlService, NvbUrlServiceImpl } from './url/url_service';

export const TYPES = {
    Logger: Symbol.for("Logger"),
    AppConfigManager: Symbol.for('AppConfigManager'),
    UrlService: Symbol.for('UrlService'),
    App: Symbol.for('App'),
}

const nvbContainer = new Container();
nvbContainer.bind<Logger>(TYPES.Logger).to(WinstonLogger)
nvbContainer.bind<ConfigManager>(TYPES.AppConfigManager).to(NvBAppConfigManager);
nvbContainer.bind<App>(TYPES.App).to(NvBApp);
nvbContainer.bind<NvbUrlService>(TYPES.UrlService).to(NvbUrlServiceImpl);

export { nvbContainer };
