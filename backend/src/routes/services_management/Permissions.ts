import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Service from "../../model/Service";
import Permission from "../../model/Permission";
import { handleInsert, handleUpdate } from "../../helper/misc";

export default class ManageActionsRoute extends Route {
    constructor() {
        super("permissions");
    }

    // Suggestion: middleware for creator check

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;
        const userId = request.userId;

        if(checkUndefinedParams(response, serviceId)) {
            return;
        }

        if(! await Service.findById(serviceId)){
            badRequest(response, "This service doesn't exists");
            return;
        }

        if (! await Service.isCreator(userId, serviceId)){
            forbiddenUserError(response, "You don't have enough privileges to modify this service");
            return;
        }

        const permissions = await Permission.findByServiceId(serviceId);
        if (!permissions) {
            internalServerError(response);
            return;
        }
        success(response, permissions);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const name = request.body.name;
        const description = request.body.description;
        const serviceId = request.body.serviceId;
        const rarObject = request.body.rarObject;

        if(checkUndefinedParams(response, name, description, serviceId, rarObject)){
            return;
        }

        if(! await Service.findById(serviceId)){
            badRequest(response, "This service doesn't exists");
            return;
        }

        if (! await Service.isCreator(userId, serviceId)){
            forbiddenUserError(response, "You don't have enough privileges to modify this service");
            return;
        }

        const permissionId = await handleInsert(response, Permission, { name, description, serviceId, rarObject });
        if (!permissionId) return;

        success(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const serviceId = request.body.serviceId;
        const permissionId = request.body.permissionId;

        if(checkUndefinedParams(response, serviceId, permissionId)){
            return;
        }

        if(! await Service.findById(serviceId)){
            badRequest(response, "This service doesn't exists");
            return;
        }

        if (! await Service.isCreator(userId, serviceId)){
            forbiddenUserError(response, "You don't have enough privileges to modify this service");
            return;
        }

        if (! await Permission.belongsToService(permissionId, serviceId)){
            forbiddenUserError(response, "You don't have enough privileges to modify this permission");
            return;
        }

        if (! await Permission.delete(permissionId)){
            internalServerError(response);
            return;
        }

        success(response);
    }

    protected async httpPut(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const name = request.body.name;
        const description = request.body.description;
        const serviceId = request.body.serviceId;
        const rarObject = request.body.rarObject;
        const permissionId = request.body.permissionId;

        if(checkUndefinedParams(response, serviceId, permissionId)){
            return;
        }

        if(! await Service.findById(serviceId)){
            badRequest(response, "This service doesn't exists");
            return;
        }

        if (! await Service.isCreator(userId, serviceId)){
            forbiddenUserError(response, "You don't have enough privileges to modify this service");
            return;
        }

        if (! await Permission.belongsToService(permissionId, serviceId)){
            forbiddenUserError(response, "You don't have enough privileges to modify this permission");
            return;
        }

        const queriedPermissionId = await handleUpdate(response, Permission, { permissionId }, { name, description, serviceId, rarObject });
        if (!queriedPermissionId) return;

        success(response);
    }
}
