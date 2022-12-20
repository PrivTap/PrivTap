import Route from "../../Route";
import {Request, Response} from "express";
import OAuthClient from "../../helper/OAuthClient";
import env from "../../helper/env";
import crypto from "bcrypt";
import {oAuthAuthorization} from "../../model/State";

export default class LoginRoute extends Route {
    constructor() {
        super("google-auth", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const client = await OAuthClient.buildClient();
        const stateValue = await crypto.genSalt(env.SALT_ROUNDS);
        let param = request.query.oAuthAuthorization;
        let oAuthState: oAuthAuthorization | undefined = undefined;
        try {
            if (param != undefined)
                oAuthState = JSON.parse(request.query.oAuthAuthorization as string) as oAuthAuthorization
        } catch (e) {
            response.status(400).send("Invalid oAuthAuthorization");
            return
        }
        const redirectUrl = await OAuthClient.gerRedirectUrl(client, stateValue, oAuthState);
        console.log(redirectUrl);
        response.redirect(redirectUrl);
    }

}