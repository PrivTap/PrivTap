import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, internalServerError, success } from "../../helper/http";
import State from "../../model/State";
import OAuth from "../../helper/oauth";
import { AuthorizationTokenConfig } from "simple-oauth2";
import { handleUpdate } from "../../helper/misc";
import Authorization from "../../model/Authorization";
import env from "../../helper/env";

export default class OAuthRoute extends Route {
    constructor() {
        super("oauth");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const { code } = request.query;
        const stateValue = request.query.state as string;
        const state = await State.findByValue(stateValue);
        if (!state){
            badRequest(response);
            return;
        }
        if (state.userId != userId){
            badRequest(response);
            return;
        }
        const serviceId = state.serviceId;
        const permissions = state.permissionId;

        const options = {
            code,
            //TODO: is this done in the right way?
            redirect_uri: env.PROD ? "https://privtap.it/modifyauth/" + serviceId : "http://127.0.0.1:5173/modifyauth/" + serviceId
        };

        console.log(options);
        if (! await State.delete(state._id)){
            internalServerError(response);
            return;
        }
        const oAuthToken = await OAuth.retrieveToken(serviceId, options as AuthorizationTokenConfig);
        console.log(oAuthToken);
        if (!oAuthToken){
            badRequest(response, "Problem while contacting this service. Avoid to use it");
            return;
        }
        // This should be an atomic transaction
        if (!await handleUpdate(response, Authorization, { userId:userId, serviceId:serviceId },{ userId, serviceId, oAuthToken, grantedPermissions: permissions }, false, true)){
            return;
        }
        success(response);
    }
}
