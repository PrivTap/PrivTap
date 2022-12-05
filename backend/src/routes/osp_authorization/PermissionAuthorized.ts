import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, success } from "../../helper/http";
import Permission, { permissionAuthorized } from "../../model/Permission";
import Authorization from "../../model/Authorization";

export default class PermissionAuthorized extends Route {
    constructor() {
        super("permission-authorized");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;
        const userId = request.userId;
        if (checkUndefinedParams(response, serviceId))
            return;
        //TODO This is NOT EFFICIENT -> try to do this with a single query or concat array in a better way
        const permissions = await Permission.findByServiceId(serviceId, "name description") as permissionAuthorized[];
        const permissionsAuthorized = await Authorization.findAllPermission(serviceId, userId);
        const data: permissionAuthorized[] = [];
        permissions.forEach((permission) => {
            const insertP = new permissionAuthorized(permission._id, permission.name, permission.description);
            insertP.authorized = false;
            permissionsAuthorized.forEach((permissionAuthorized) => {
                if (permissionAuthorized.name === permission.name)
                    insertP.authorized = true;
            });
            data.push(insertP);
        });
        success(response, data);
    }

}