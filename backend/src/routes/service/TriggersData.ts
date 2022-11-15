import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class TriggersDataRoute extends Route {
    // TODO: figure out how to restrict this to only authorized services

    constructor() {
        super("triggers-data");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}
