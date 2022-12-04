import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, forbiddenUserError, success } from "../../helper/http";
import Trigger from "../../model/Trigger";
import Service from "../../model/Service";
import { handleInsert, handleUpdate } from "../../helper/misc";

export default class ManageTriggersRoute extends Route {
    constructor() {
        super("manage-triggers", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;

        if (checkUndefinedParams(response, serviceId)) return;

        // Insert the trigger
        const services = await Trigger.findAllForService(serviceId);

        if (services) {
            success(response, services);
        } else {
            success(response, []);
        }
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const name = request.body.name;
        const description = request.body.description;
        const serviceId = request.body.serviceId;
        const permissions = request.body.permissions;
        const resourceServer = request.body.resourceServer;

        if (checkUndefinedParams(response, name, description, serviceId)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, serviceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        // Insert the trigger
        if (!await handleInsert(response, Trigger, { name, description, serviceId, permissions, resourceServer })) return;

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
            badRequest(response, "This trigger doesn't exists");
        }
    }

    protected async httpPut(request: Request, response: Response): Promise<void> {
        const triggerId = request.body.triggerId;
        const name = request.body.name;
        const description = request.body.description;
        const permissions = request.body.permissions;
        const resourceServer = request.body.resourceServer;

        if (checkUndefinedParams(response, triggerId)) return;

        if (!await Trigger.isCreator(request.userId, triggerId)) {
            forbiddenUserError(response, "You are not the owner of this trigger");
            return;
        }

        const queriedTriggerId = await handleUpdate(response, Trigger, { triggerId }, { name, description, permissions, resourceServer });
        if(!queriedTriggerId) return;

        success(response);
    }
}
