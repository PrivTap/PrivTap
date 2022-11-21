import User from "../../model/User";
import { badRequest, checkUndefinedParams, success } from "../../helper/http";
import Route from "../../Route";
import { Request, Response } from "express";

export default class ActivateRoute extends Route {
    constructor() {
        super("activate");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const activationToken = request.body.token;
        if (checkUndefinedParams(response, activationToken)) return;

        const result = await User.activateAccount(activationToken);
        if (!result) {
            badRequest(response, "Invalid token");
            return;
        }

        success(response);
    }
}