import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class TriggersRoute extends Route {
    constructor() {
        super("triggers", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }

}