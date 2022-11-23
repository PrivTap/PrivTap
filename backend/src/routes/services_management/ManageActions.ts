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

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceID = request.body.parentId;

        if (!parentServiceID) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Action.findAllChildrenOfService(parentServiceID)) {
            success(response);
        } else {
            badRequest(response, "Error while querying available actions for the service");
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const actionName = request.body.name;
        const actionDesc = request.body.description;
        const parentServiceID = request.body.parentId;
        const availablePermissions = request.body.permissions as ([Permission] | null);
        const endpoint = request.body.endpoint;
        const creatorID = request.userId.toString();

        if (!(actionName && actionDesc && parentServiceID && availablePermissions && creatorID && endpoint && mongoose.isValidObjectId(parentServiceID) && mongoose.isValidObjectId(creatorID))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Action.insert(actionName, actionDesc, parentServiceID, creatorID, availablePermissions, endpoint)) {
            success(response);
        } else {
            badRequest(response, "Error while creating action");
        }
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceID = request.body.serviceID;
        const actionID = request.body.actionID;
        const userID = request.userId.toString();

        if (!(serviceID && actionID && userID && mongoose.isValidObjectId(serviceID) && mongoose.isValidObjectId(actionID) && mongoose.isValidObjectId(userID))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        if (await Action.delete(actionID, serviceID, userID)) {
            success(response);
        } else {
            internalServerError(response);
        }
    }
}
