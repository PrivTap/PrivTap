import User from "../../model/User";
import { badRequest, checkUndefinedParams, internalServerError, success } from "../../helper/http";
import Route from "../../Route";
import { Request, Response } from "express";
import Authentication from "../../helper/authentication";

export default class ActivateRoute extends Route {
    constructor() {
        super("activate", false, false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const activationToken = request.body.token;

        if (checkUndefinedParams(response, activationToken)) return;

        const user = await User.activateAccount(activationToken);
        if (!user) {
            badRequest(response, "Invalid token");
            return;
        }

        if (!Authentication.setAuthenticationCookie(response, user)) {
            internalServerError(response);
            return;
        }

        success(response);
    }
}