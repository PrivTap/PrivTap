import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, success } from "../../helper/http";
import OAuth from "../../helper/oauth";
import crypto from "bcrypt";
import env from "../../helper/env";
import { handleInsert } from "../../helper/misc";
import State from "../../model/State";
export default class ServiceAuthorizationRoute extends Route {


    constructor() {
        super("service-authorization", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
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