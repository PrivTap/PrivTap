import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class LogoutRoute extends Route {
    constructor() {
        super("logout", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, undefined, "Not implemented");
    }
}