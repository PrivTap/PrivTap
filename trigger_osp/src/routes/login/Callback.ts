import Route from "../../Route";
import {Request, Response} from "express";
import OAuthClient from "../../helper/OAuthClient";
import State from "../../model/State";
import User, {IUser} from "../../model/User";
import Authentication from "../../helper/authentication";

export default class LoginRoute extends Route {
    constructor() {
        super("callback", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const client = await OAuthClient.buildClient();
        const params = client.callbackParams(request);
        const stateValue = params.state;
        if (!stateValue){
            response.status(400).send();
            return;
        }
        const state = await State.findByStateValue(stateValue);
        if(!state){
            response.status(400).send();
            return;
        }
        const code_verifier = state.code_verifier;
        const tokenSet = await client.callback('http://127.0.0.1:8001/callback', params, { code_verifier, state: params.state });
        const tokenClaims = tokenSet.claims();

        if (!tokenClaims.name || !tokenClaims.email){
            response.status(500).send();
            return;
        }

        const userData = {username: tokenClaims.name, email: tokenClaims.email} as IUser;

        const successfulDelete = await State.deleteByStateValue(stateValue);
        if (!successfulDelete){
            response.status(500).send();
            return;
        }

        const user = await User.insert(userData, true) as IUser;
        if (!user){
            response.status(500).send();
            return;
        }

        if (!Authentication.setAuthenticationCookie(response, user)){
            response.status(500).send();
            return;
        }

        response.redirect("http://127.0.0.1:8001/personal-page")

    }
}