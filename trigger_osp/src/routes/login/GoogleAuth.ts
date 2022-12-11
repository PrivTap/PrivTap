import Route from "../../Route";
import {Request, Response} from "express";
import OAuth from "../../helper/OAuth";
import env from "../../helper/env";
import crypto from "bcrypt";

export default class LoginRoute extends Route {
    constructor() {
        super("google-auth", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const client = await OAuth.buildClient();
        const stateValue  = await crypto.genSalt(env.SALT_ROUNDS);
        const redirectUrl = await OAuth.gerRedirectUrl(client, stateValue);
        console.log(redirectUrl);
        response.redirect(redirectUrl);
    }

}