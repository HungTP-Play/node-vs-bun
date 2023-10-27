import { NvbApp, NvbController, Route } from "./interfaces";

export class NvbAppImpl implements NvbApp {
    private controllers: NvbController[] = [];

    addController(controller: NvbController): void {
        this.controllers.push(controller);
    }

    routes(): Route[] {
        const allRoutes: Route[] = [];
        this.controllers.forEach((c: NvbController) => allRoutes.push(...c.routes()))
        return allRoutes;
    }
}