import {CookieOptions, NextFunction, Request, Response} from "express";
import logger from "./logger";
import env from "./env";
import {JwtPayload, sign, verify} from "jsonwebtoken";
import {IUser} from "../model/User";

export default abstract class Authentication {

    /**
     * Middleware function used to check for a valid JWT authentication token in the cookies of a request.
     * Automatically sends back unauthorized response if the token is not valid.
     * @param request the HTTP request
     * @param response the HTTP response
     * @param next function to call if the request authentication is valid
     */
    static checkAuthentication(request: Request, response: Response, next: NextFunction) {
        let decodedJWT;
        try {
            decodedJWT = Authentication.checkJWT(request);
        } catch (e) {
            logger.debug("Auth check failed, JWT is not valid: ", e);
            response.status(401).send();
            return;
        }

        request.userId = decodedJWT.userId;

        next();
    }


    /**
     * Checks in the cookies of the request if a JWT token is present. If so, tries to decode it
     * @param request the HTTP request
     * @throws AuthError if the cookie does not exist or if it is not possible to decode it
     * @throws Error if the JWT_SECRET env variable is not defined
     * @return Returns the userId and the activation status
     */
    static checkJWT(request: Request): { userId: string } {
        const secret = env.JWT_SECRET;

        const cookieJWT: string | undefined = request.cookies?.__session;
        if (!cookieJWT) {
            logger.debug("__session cookie is undefined, headers are: ", request.headers);
            throw new Error("JWT Cookie is undefined");
        }

        let decoded;
        try {
            decoded = verify(cookieJWT, secret) as JwtPayload;
        } catch (e) {
            let errMessage = "JWT Cookie can't be verified";

            if (e instanceof Error) {
                errMessage += ": " + e.message;
            }

            throw new Error(errMessage);
        }

        if (!decoded) {
            throw new Error("JWT Cookie can't be decoded");
        }

        const userId = decoded["userId"];
        if (!userId || typeof userId != "string") {
            throw new Error("JWT Cookie is invalid");
        }

        return { userId };
    }

    /**
     Create a json web token encrypted using the secret in the env
     @param user: the user of which you want to create the token
     */
    static createJWT(user: IUser): string | undefined {
        const secret = env.JWT_SECRET;
        if (secret) {
            return sign({ "userId": user._id }, secret, {
                expiresIn: env.JWT_EXPIRE
            });
        }
    }

    /**
     * Sets the appropriate headers in the response to send back the authentication cookie to the client.
     * @param response the response that will set the cookie
     * @param user the user for which the cookie will be generated
     * @protected
     */
    static setAuthenticationCookie(response: Response, user: IUser): boolean {
        // Create a JWT token for the user
        const jwt = Authentication.createJWT(user);
        if (!jwt){
            console.log("Not jwt")
            return false;
        }

        // Calculate the expiration time for the cookie.
        // We set it the same as the expiration time of the JWT token, but we need to convert
        // it to milliseconds, as JWT expiration time is in seconds
        let cookieExpires = env.JWT_EXPIRE;
        cookieExpires *= 1000;

        // Set default cookie options:
        // - expires at the same time as the JWT does, so that the browser can recognize it and delete it
        // - HTTPOnly to ensure that it is not vulnerable to XSS
        // - Secure to ensure that it won't be passed through unsecure http connections (localhost is an exception)
        // - SameSite=strict to ensure that it won't be passed to external websites
        const cookieOptions: CookieOptions = {
            expires: new Date(Date.now() + cookieExpires),
            httpOnly: true,
            secure: true,
            // If we are in a development environment we set SameSite=none to ensure that the cookie will be
            // set on the frontend even if it is running on a different port
            sameSite: env.PROD ? "strict" : "none"
        };

        // Set the cookie header
        response.cookie("__session", jwt, cookieOptions);
        console.log("Headers set correctly");
        return true;
    }

}