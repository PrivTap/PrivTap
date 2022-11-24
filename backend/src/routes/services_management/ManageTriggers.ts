import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Trigger from "../../model/Trigger";
import Service from "../../model/Service";
import { ModelError } from "../../helper/model";

export default class ManageTriggersRoute extends Route {
    constructor() {
        super("manage-triggers", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceId = request.body.parentId;

        if (checkUndefinedParams(response, parentServiceId)) return;

        // Insert the trigger
        if (await Trigger.findAllForService(parentServiceId)) {
            success(response);
        } else {
            badRequest(response, "Error while querying available triggers for the service");
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const triggerName = request.body.name;
        const triggerDesc = request.body.description;
        const parentServiceId = request.body.parentId;
        const availablePermissions = request.body.permissions;

        if (checkUndefinedParams(response, triggerName, triggerDesc, parentServiceId)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, parentServiceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        // Insert the trigger
        try {
            const res = await Trigger.insert(triggerName, triggerDesc, parentServiceId, availablePermissions);
            if (!res) {
                internalServerError(response);
                return;
            }
        } catch (e) {
            if (e instanceof ModelError) {
                badRequest(response, e.message);
            }
            return;
        }

        success(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const triggerId = request.body.triggerId;

        if (checkUndefinedParams(response, triggerId)) return;

        // Check that the user is the owner of the action
        if (!await Trigger.isCreator(request.userId, triggerId)) {
            forbiddenUserError(response, "You are not the owner of this trigger");
            return;
        }

        if (await Trigger.delete(triggerId)) {
            success(response);
        } else {
            internalServerError(response);
        }
    }
}
