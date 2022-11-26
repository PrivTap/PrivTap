import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Action, { IAction } from "../../model/Action";
import Service from "../../model/Service";
import { handleInsert } from "../../helper/misc";

export default class ManageActionsRoute extends Route {
    constructor() {
        super("manage-actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;

        if (checkUndefinedParams(response, serviceId)) return;

        let actions: Partial<IAction>[] = [];

        const res = await Action.findAllForService(serviceId);
        if (res)
            actions = res;

        success(response, actions);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const name = request.body.name;
        const description = request.body.description;
        const serviceId = request.body.serviceId;
        const permissions = request.body.permissions;
        const endpoint = request.body.endpoint;

        if (checkUndefinedParams(response, name, description, serviceId, endpoint)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, serviceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        // Insert the action
        if (!await handleInsert(response, Action, { name, description, serviceId, endpoint, permissions })) return;

        success(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const actionId = request.body.actionId;

        if (checkUndefinedParams(response, actionId)) return;

        // Check that the user is the owner of the action
        if (!await Action.isCreator(request.userId, actionId)) {
            forbiddenUserError(response, "You are not the owner of this action");
            return;
        }

        if (await Action.delete(actionId)) {
            success(response);
        } else {
            internalServerError(response);
        }
    }
}
