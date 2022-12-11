import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class LogoutRoute extends Route {
    constructor() {
        super("logout", true, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        response.clearCookie("__session");
        success(response, {}, "Logged out");
    }
}
