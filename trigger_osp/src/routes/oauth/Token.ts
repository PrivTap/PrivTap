import Route from "../../Route";
import {Request, Response} from "express";
import env from "../../helper/env";
import crypt from "bcrypt";
import Authorization from "../../model/Authorization";

export default class TokenRoute extends Route {
    constructor() {
        super("token", false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const base64 = request.headers.authorization as string;
        const code = request.body.code;
        if(!base64 || !code){
            response.status(400).send();
            return;
        }

        const base64Value = base64.split(" ")[1];
        const decoded = atob(base64Value).split(":");
        const clientId = decoded[0];
        const clientSecret = decoded[1];

        if (clientId != env.PRIVTAP_CLIENT_ID || clientSecret != env.PRIVTAP_CLIENT_SECRET){
            response.status(401).send();
            return;
        }

        const oauthToken = await crypt.genSalt(env.SALT_ROUNDS);
        const successfulUpdate = await Authorization.update({ oauthToken }, { code });
        if (!successfulUpdate){
            response.status(500).send();
            return;
        }
        response.status(200).send({ "access_token": oauthToken, "grant_type": "authorization_code"});
    }
}