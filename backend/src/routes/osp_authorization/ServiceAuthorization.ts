import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, success } from "../../helper/http";
import OAuth from "../../helper/oauth";

export default class ServiceAuthorizationRoute extends Route {


    constructor() {
        super("service-authorization", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const { code } = request.query;
        const state = request.query.state;
        const options = {
            code,
        };

        console.log(code, state, options);

        success(response, {}, "Not implemented");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const serviceId = request.body.serviceId;
        const permissionIds = request.body.permissionId as string[];

        if (checkUndefinedParams(response, serviceId, permissionIds))
            return;

        const state = "someState";

        const authorizationUri = await OAuth.newAuthorizationUri(response, serviceId, permissionIds, state);

        if(!authorizationUri){
            return;
        }

        console.log(authorizationUri);
        // https://github.com/login/oauth/authorize?response_type=code&client_id=c468f4e8010a3623b430&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fapi%2Fservice-authorization&scope=user

        success(response, { "redirectUri": authorizationUri });
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}