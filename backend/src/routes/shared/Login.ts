import { compareSync } from "bcrypt";
import User from "../../model/User";
import { createJWT } from "../../helper/authentication";
import { badRequest, internalServerError, success } from "../../helper/http";
import Route from "../../Route";
import { CookieOptions, Request, Response } from "express";

export default class LoginRoute extends Route {
    constructor() {
        super("login");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const password = request.body.password;

        if (!username || !password) {
            badRequest(response, "Undefined parameters")
            return;
        }

        let user;
        try {
            user = await User.queryUser("username", username);
        } catch (e) {
            internalServerError(response);
            return;
        }

        if (user == null) {
            badRequest(response, "Wrong credentials");
            return;
        }

        const passwordValid = compareSync(password, user.password);
        if (!passwordValid) {
            badRequest(response, "Wrong credentials");
            return;
        }

        const jwt = createJWT(user);
        if (!jwt) {
            internalServerError(response);
            return;
        }

        let cookieExpires = Number.parseInt(process.env.JWT_EXPIRE || "86400");
        cookieExpires *= 1000; // Convert to ms

        const cookieOptions: CookieOptions = {
            expires: new Date(Date.now() + cookieExpires),
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        };

        if (process.env.NODE_ENV != "production") {
            cookieOptions.sameSite = "none";
            response.header("Access-Control-Allow-Credentials", "true");
            response.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173")
            response.header("Access-Control-Allow-Headers", "Set-Cookie")
        }

        response.cookie("_jwt", jwt, cookieOptions);

        success(response, {"username": username, "email": user.email, "isConfirmed": user.isConfirmed})
    }
}