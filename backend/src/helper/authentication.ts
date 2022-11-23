import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../model/User";
import { verify, sign, JwtPayload } from "jsonwebtoken";
import { internalServerError, unauthorizedUserError } from "./http";
import env from "./env";
import logger from "./logger";

export class AuthError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

export default abstract class Authentication {
    /**
     * Middleware function used to check for a valid JWT authentication token in the cookies of a request.
     * Automatically sends back unauthorized response if the token is not valid.
     * @param request the HTTP request
     * @param response the HTTP response
     * @param next function to call if the request authentication is valid
     */
    static checkAuthentication(request: Request, response: Response, next: NextFunction) {
        let userId;
        try {
            userId = Authentication.checkJWT(request);
        } catch (e) {
            if (e instanceof AuthError) {
                logger.debug("Auth check failed, JWT is not valid: ", e.message);
                unauthorizedUserError(response);
            } else {
                logger.warn("Auth check failed, something bad happened\n", e);
                internalServerError(response);
            }
            return;
        }

        request.userId = userId;

        next();
    }

    /**
     * Middleware function used to check if a certain user has activated its account.
     * Automatically sends back unauthorized response if the account is not activated
     * @param request the HTTP request
     * @param response the HTTP response
     * @param next function to call if the request authentication is valid
     */
    static async checkActivation(request: Request, response: Response, next: NextFunction){
        const userId = request.userId;
        if (!userId) {
            logger.warn("Activation check has run without auth check being run");
            internalServerError(response);
            return;
        }

        // TODO It would be better to keep info about account inside the JWT token, to avoid querying the DB for every request

        const queryResult = await User.findById(userId);
        if (queryResult == null) {
            logger.warn("Activation check failed, user does not exist in DB");
            internalServerError(response);
            return;
        }
        if (!queryResult.isConfirmed){
            logger.debug("Activation check failed, user is not confirmed");
            unauthorizedUserError(response, "To visit this page your account must be activated, check your email for the activation link");
            return;
        }

        next();
    }

    /**
     * Checks in the cookies of the request if a JWT token is present. If so, tries to decode it
     * @param request the HTTP request
     * @throws AuthError if the cookie does not exist or if it is not possible to decode it
     * @throws Error if the JWT_SECRET env variable is not defined
     * @return Returns the userId
     */
    static checkJWT(request: Request): string {
        const secret = env.JWT_SECRET;
        if (!secret) {
            throw Error();
        }

        const cookieJWT: string | undefined = request.cookies.__session;
        if (!cookieJWT) {
            logger.debug("__session cookie is undefined, 'cookie' header is: ", request.headers.cookie);
            throw new AuthError("JWT Cookie is undefined");
        }

        let decoded;
        try {
            decoded = verify(cookieJWT, secret) as JwtPayload;
        } catch (e) {
            let errMessage = "JWT Cookie can't be verified";

            if (e instanceof Error) {
                errMessage += ": " + e.message;
            }

            throw new AuthError(errMessage);
        }

        const userId = decoded["user_id"];
        if (!decoded || !userId || typeof userId != "string") {
            throw new AuthError("JWT Cookie is invalid");
        }

        return userId;
    }

    /**
     Create a json web token encrypted using the secret in the env
     @param user: the user of which you want to create the token
     */
    static createJWT(user: IUser): string | undefined {
        const secret = env.JWT_SECRET;
        if (secret) {
            return sign({ "user_id": user._id }, secret, {
                expiresIn: env.JWT_EXPIRE
            });
        }
    }

}
