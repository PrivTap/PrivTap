import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, internalServerError, success } from "../../helper/http";
import { Permission } from "../../model/Permission";
import Trigger from "../../model/Trigger";
import mongoose  from "mongoose";

export default class ManageTriggersRoute extends Route {
    constructor() {
        super("manage-triggers", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceID = request.body.parentId;

        if (!parentServiceID) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Trigger.findAllChildrenOfService(parentServiceID)) {
            success(response);
        } else {
            badRequest(response, "Error while querying available triggers for the service");
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const triggerName = request.body.name;
        const triggerDesc = request.body.description;
        const parentServiceID = request.body.parentId;
        const availablePermissions = request.body.permissions as ([Permission] | null);
        const creatorID = request.userId.toString();

        if (!(triggerName && triggerDesc && parentServiceID && availablePermissions && creatorID && mongoose.isValidObjectId(parentServiceID) && mongoose.isValidObjectId(creatorID))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Trigger.insert(triggerName, triggerDesc, parentServiceID, creatorID, availablePermissions)) {
            success(response);
        } else {
            badRequest(response, "Error while creating trigger");
        }
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceID = request.body.serviceID;
        const triggerID = request.body.triggerID;
        const userID = request.userId.toString();

        if (!(serviceID && triggerID && userID && mongoose.isValidObjectId(serviceID) && mongoose.isValidObjectId(triggerID) && mongoose.isValidObjectId(userID))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        if (await Trigger.delete(triggerID, serviceID, userID)) {
            success(response);
        } else {
            internalServerError(response);
        }
    }
}
