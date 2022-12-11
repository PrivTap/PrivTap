import Route from "../Route";
import {Request, Response} from "express";
import OAuth from "../helper/OAuth";
import State from "../model/State";

export default class LoginRoute extends Route {
    constructor() {
        super("callback");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const client = await OAuth.buildClient();
        const params = client.callbackParams(request);
        const stateValue = params.state;
        if (!stateValue){
            response.status(400);
            return;
        }
        const state = await State.findByStateValue(stateValue);
        if(!state){
            response.status(400);
            return;
        }
        const code_verifier = state.code_verifier;
        const tokenSet = await client.callback('http://127.0.0.1:8001/callback', params, { code_verifier, state: params.state });
        console.log('received and validated tokens %j', tokenSet);
        console.log('validated ID Token claims %j', tokenSet.claims());
        response.redirect("http://127.0.0.1:8001/personal-page")
    }


}