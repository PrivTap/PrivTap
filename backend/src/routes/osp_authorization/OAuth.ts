import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class OAuthRoute extends Route {
    constructor() {
        super("oauth");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}
