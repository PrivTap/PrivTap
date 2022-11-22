import { NextFunction, Request, Response } from "express";
import { internalServerError, unauthorizedUserError } from "./http";
import User from "../model/User";
import logger from "./logger";

export default abstract class Confirmation {
    /**
     * Middleware function used to check if a certain user is confirmed.
     * Automatically sends back unauthorized response if the account is not confirmed
     * @param request the HTTP request
     * @param response the HTTP response
     * @param next function to call if the request authentication is valid
     */
    static async checkValidation(request: Request, response: Response, next: NextFunction){
        const userId = request.userId;
        if (!userId) {
            logger.warn("Activation check has run without auth check being run");
            internalServerError(response);
            return;
        }

        const queryResult = await User.findById(userId);
        if (queryResult == null) {
            logger.warn("Activation check failed, db query is empty");
            internalServerError(response);
            return;
        }
        if (!queryResult.isConfirmed){
            logger.debug("Activation check failed, user is not confirmed");
            unauthorizedUserError(response, "This account is not confirmed yet");
            return;
        }

        next();
    }
}