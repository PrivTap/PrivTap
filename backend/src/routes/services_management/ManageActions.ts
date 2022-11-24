import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Action, { IAction } from "../../model/Action";
import Service from "../../model/Service";
import { ModelError } from "../../helper/model";

export default class ManageActionsRoute extends Route {
    constructor() {
        super("manage-actions", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceId = request.body.parentId;

        if (checkUndefinedParams(response, parentServiceId)) return;

        let actions: IAction[] = [];

        const res = await Action.findAllForService(parentServiceId);
        if (res)
            actions = res;

        success(response, actions);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const actionName = request.body.name;
        const actionDesc = request.body.description;
        const parentServiceId = request.body.parentId;
        const permissions = request.body.permissions;
        const endpoint = request.body.endpoint;

        if (checkUndefinedParams(response, actionName, actionDesc, parentServiceId, endpoint)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, parentServiceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }

        // Insert the action
        try {
            const res = await Action.insert(actionName, actionDesc, parentServiceId, endpoint, permissions);
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
