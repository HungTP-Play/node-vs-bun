import { NvbAppImpl } from "./app/implement";
import { NvbContainer, TYPES } from "./container";
import { NvbUrlController } from "./features/url/url_controller";
import { NvbUrlRepo, RedisUrlRepo } from "./features/url/url_repo";
import { NvbUrlService } from "./features/url/url_service";
import { Logger, WinstonLogger } from "./logger";
import { NvbServer } from "./server/server";

/**
 * Simple setup dependencies, order matter
 */
function setUpContainer() {
    const container = NvbContainer.getInstance();
    container.set<Logger>(TYPES.Logger, new WinstonLogger());

    container.set<NvbUrlRepo>(TYPES.UrlRepo, RedisUrlRepo.getInstance());
    container.set<NvbUrlService>(TYPES.UrlService, new NvbUrlService());
}

function main() {
    setUpContainer();

    const app = new NvbAppImpl();
    app.addController(new NvbUrlController());

    const server = new NvbServer(app);
    server.start();
}

main();
