import { NextFunction, Request, Response } from "express";
import { internalServerError, unauthorizedUserError } from "./http";
import User from "../model/User";
import Authentication, { AuthError } from "./authentication";

export default abstract class Confirmation {
    /**
     * Middleware function used to check if a certain user is confirmed.
     * Automatically sends back unauthorized response if the account is not confirmed
     * @param request the HTTP request
     * @param response the HTTP response
     * @param next function to call if the request authentication is valid
     */
    static async checkValidation(request: Request, response: Response, next: NextFunction){
        let userID;
        try {
            userID = Authentication.checkJWT(request);
        } catch (e){
            if (e instanceof AuthError) {
                unauthorizedUserError(response);
            } else {
                internalServerError(response);
            }
            return;
        }
        const queryResult = await User.findById(userID);
        if (queryResult == null) {
            internalServerError(response);
            return;
        }
        if (!queryResult.isConfirmed){
            unauthorizedUserError(response, "This account is not confirmed yet");
            return;
        }

        next();
    }
}