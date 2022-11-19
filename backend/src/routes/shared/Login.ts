import { compareSync } from "bcrypt";
import User, { IUser } from "../../model/User";
import Authentication from "../../helper/authentication";
import { badRequest, internalServerError, success } from "../../helper/http";
import Route from "../../Route";
import { CookieOptions, Request, Response } from "express";
import env from "../../helper/env";
import { checkUndefinedParams } from "../../helper/http";

export default class LoginRoute extends Route {
    constructor() {
        super("login");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const password = request.body.password;

        if (checkUndefinedParams(response, username, password)){
            return;
        }

        const user = await User.findByUsername(username);
        if (user == null) {
            badRequest(response, "The username or password is invalid");
            return;
        }

        const passwordValid = compareSync(password, user.password);
        if (!passwordValid) {
            badRequest(response, "The username or password is invalid");
            return;
        }

        if (!LoginRoute.setAuthenticationCookie(response, user)) {
            internalServerError(response);
            return;
        }

        success(response, { "username": username, "email": user.email, "isConfirmed": user.isConfirmed });
    }


    /**
     * Sets the appropriate headers in the response to send back the authentication cookie to the client.
     * @param response the response that will set the cookie
     * @param user the user for which the cookie will be generated
     * @protected
     */
    protected static setAuthenticationCookie(response: Response, user: IUser) {
        // Create a JWT token for the user
        const jwt = Authentication.createJWT(user);
        if (!jwt)
            return false;

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
        response.cookie("_jwt", jwt, cookieOptions);
        return true;
    }
}