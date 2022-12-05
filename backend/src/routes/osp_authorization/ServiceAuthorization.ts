import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, success } from "../../helper/http";
import OAuth from "../../helper/oauth";
import crypto from "bcrypt";
import env from "../../helper/env";
import { handleInsert } from "../../helper/misc";
import State from "../../model/State";
import { AuthorizationTokenConfig } from "simple-oauth2";
import Authorization from "../../model/Authorization";
export default class ServiceAuthorizationRoute extends Route {


    constructor() {
        super("service-authorization", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        //const userId = request.userId;
        // Dummy user
        const userId = "6383fa049c03ea9ac5f2477a";
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

        if (!await handleInsert(response, Authorization, { userId, serviceId, oAuthToken, grantedPermissions: permissions })){
            badRequest(response);
            return;
        }

        // Delete state (should be a transaction)

        success(response);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        //const userId = request.userId;
        // Dummy userId
        const userId = "6383fa049c03ea9ac5f2477a";
        const serviceId = request.body.serviceId;
        const permissionIds = request.body.permissionId as string[];

        if (checkUndefinedParams(response, serviceId, permissionIds))
            return;

        const stateValue = await crypto.genSalt(env.SALT_ROUNDS);

        if (!await handleInsert(response, State, { value: stateValue, userId, serviceId, permissionId: permissionIds }))
            return;

        const authorizationUri = await OAuth.newAuthorizationUri(response, serviceId, permissionIds, stateValue);

        if(!authorizationUri){
            badRequest(response);
            return;
        }

        console.log(authorizationUri);

        success(response, { "redirectUri": authorizationUri });
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}