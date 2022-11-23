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
    /*

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceId = request.body.parentId;

        if (!parentServiceId) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Trigger.findAllChildrenOfService(parentServiceId)) {
            success(response);
        } else {
            badRequest(response, "Error while querying available triggers for the service");
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const triggerName = request.body.name;
        const triggerDesc = request.body.description;
        const parentServiceId = request.body.parentId;
        const availablePermissions = request.body.permissions as ([Permission] | null);
        const creatorId = request.userId.toString();

        if (!(triggerName && triggerDesc && parentServiceId && availablePermissions && creatorId && mongoose.isValidObjectId(parentServiceId) && mongoose.isValidObjectId(creatorId))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Trigger.insert(triggerName, triggerDesc, parentServiceId, creatorId, availablePermissions)) {
            success(response);
        } else {
            badRequest(response, "Error while creating trigger");
        }
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const serviceId = request.body.serviceId;
        const triggerId = request.body.triggerId;
        const userId = request.userId.toString();

        if (!(serviceId && triggerId && userId && mongoose.isValidObjectId(serviceId) && mongoose.isValidObjectId(triggerId) && mongoose.isValidObjectId(userId))) {
            badRequest(response, "Invalid parameters");
            return;
        }

        if (await Trigger.delete(triggerId, serviceId, userId)) {
            success(response);
        } else {
            internalServerError(response);
        }
    }

     */
}
