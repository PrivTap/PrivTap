import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, internalServerError, success } from "../../helper/http";
import State from "../../model/State";
import OAuth from "../../helper/oauth";
import { AuthorizationTokenConfig } from "simple-oauth2";
import { handleInsert } from "../../helper/misc";
import Authorization from "../../model/Authorization";

export default class OAuthRoute extends Route {
    constructor() {
        super("oauth");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const { code } = request.query;
        const stateValue = request.query.state as string;
        const options = {
            code,
        };

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
        const oAuthToken = await OAuth.retrieveToken(serviceId, options as AuthorizationTokenConfig);
        if (!oAuthToken){
            badRequest(response);
            return;
        }

        // This should be an atomic transaction

        if (!await handleInsert(response, Authorization, { userId, serviceId, oAuthToken, grantedPermissions: permissions })){
            badRequest(response);
            return;
        }

        if (! await State.delete(state._id)){
            internalServerError(response);
            return;
        }

        success(response);
    }
}
