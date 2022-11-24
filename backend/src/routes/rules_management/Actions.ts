import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class ActionsRoute extends Route {
    constructor() {
        super("actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}