import User from "../../model/User";
import { badRequest, internalServerError, success } from "../../helper/http";
import Route from "../../Route";
import { Request, Response } from "express";

export default class ActivateRoute extends Route {
    constructor() {
        super("activate");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const activationToken = request.body.token;
        if (!activationToken) {
            badRequest(response, "Undefined parameters");
            return;
        }

        let result;
        try {
            result = await User.modifyUser("activationToken", activationToken, "isConfirmed", true);
        } catch (e) {
            internalServerError(response);
            return;
        }

        if (result["modifiedCount"] == 0 || result["matchedCount"] == 0) {
            badRequest(response, "Invalid token");
            return;
        }

        success(response);
    }
}