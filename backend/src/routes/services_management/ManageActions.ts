import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, internalServerError, success } from "../../helper/http";
import Action from "../../model/Action";
import { Permission } from "../../model/Permission";
import mongoose from "mongoose";

export default class ManageActionsRoute extends Route {
    constructor() {
        super("manage-actions", true);
    }

    /*
    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceId = request.body.parentId;

        if (!parentServiceId) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Action.findAllChildrenOfService(parentServiceId)) {
            success(response);
        } else {
            badRequest(response, "Error while querying available actions for the service");
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const actionName = request.body.name;
        const actionDesc = request.body.description;
        const parentServiceId = request.body.parentId;
        const availablePermissions = request.body.permissions as ([Permission] | null);
        const endpoint = request.body.endpoint;
        const creatorId = request.userId.toString();

        if (!(actionName && actionDesc && parentServiceId && availablePermissions && creatorId && endpoint && mongoose.isValidObjectId(parentServiceId) && mongoose.isValidObjectId(creatorId))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Action.insert(actionName, actionDesc, parentServiceId, creatorId, availablePermissions, endpoint)) {
            success(response);
        } else {
            badRequest(response, "Error while creating action");
        }
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceId = request.body.serviceId;
        const actionId = request.body.actionId;
        const userId = request.userId.toString();

        if (!(serviceId && actionId && userId && mongoose.isValidObjectId(serviceId) && mongoose.isValidObjectId(actionId) && mongoose.isValidObjectId(userId))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        if (await Action.delete(actionId, serviceId, userId)) {
            success(response);
        } else {
            internalServerError(response);
        }
    }

     */
}
