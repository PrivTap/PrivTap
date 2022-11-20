import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import Rule from "../../model/Rule";

export default class RulesRoute extends Route {
    constructor() {
        super("rules", true, true);
    }

    // Implement filter option
    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userID = request.userId;
        const rules = await Rule.findByUserID(userID);
        const responseContent = { "rules": rules };
        success(response, responseContent);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}
