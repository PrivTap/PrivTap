import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, internalServerError, success } from "../../helper/http";
import Authorization from "../../model/Authorization";

export default class PermissionAuthorized extends Route {
    constructor() {
        super("permission-authorized");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;
        const userId = request.userId;
        if (checkUndefinedParams(response, serviceId)) {
            return;
        }
        const permissionsAuthorized = await Authorization.findAllPermissionsAddingAuthorizationTag(serviceId, userId);
        if(permissionsAuthorized===null){
            internalServerError(response);
            return ;
        }
        success(response, permissionsAuthorized);
    }
}