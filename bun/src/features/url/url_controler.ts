import { NvbController, Route } from "../../app/interfaces";
import { NvbContainer, TYPES } from "../../container";
import { NvbUrlService } from "./url_service";

export class NvbUrlController implements NvbController {
    private container = NvbContainer.getInstance();
    private service: NvbUrlService = this.container.get<NvbUrlService>(TYPES.UrlService);

    routes(): Route[] {
        throw new Error("Method not implemented.");
    }
}