import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Action, { ActionOsp, IAction } from "../../model/Action";
import Service from "../../model/Service";
import { handleInsert, handleUpdate } from "../../helper/misc";
import Permissions from "../../model/Permission";


export default class ManageActionsRoute extends Route {
    constructor() {
        super("manage-actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;

        if (checkUndefinedParams(response, serviceId)) return;

        const actions = await Action.findAllForService(serviceId);
        console.log(actions);
        if (!actions) {
            internalServerError(response);
            return;
        }

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
        const action = await handleInsert(response, Action, {
            name,
            description,
            serviceId,
            endpoint,
            permissions
        }, true) as IAction;
        if (!action) return;
        const associatedPermissions = await Permissions.getAllPermissionAndAddBooleanTag(serviceId, action.permissions);
        const actionResult: ActionOsp = {
            name: action.name,
            _id: action._id,
            endpoint: action.endpoint,
            description: action.description,
            permissions: associatedPermissions ? associatedPermissions : []
        };

        success(response, actionResult);
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

    protected async httpPut(request: Request, response: Response): Promise<void> {
        const actionId = request.body.actionId;
        const name = request.body.name;
        const description = request.body.description;
        const permissions = request.body.permissions;
        const endpoint = request.body.endpoint;

        if (checkUndefinedParams(response, actionId)) return;

        if (!await Action.isCreator(request.userId, actionId)) {
            forbiddenUserError(response, "You are not the owner of this action");
            return;
        }

        const updatedAction = await handleUpdate(response, Action, { "_id": actionId }, {
            name,
            description,
            permissions,
            endpoint
        }, true) as IAction;
        if (!updatedAction) return;
        const associatedPermissions = await Permissions.getAllPermissionAndAddBooleanTag(updatedAction.serviceId, updatedAction.permissions);
        const triggerResult: ActionOsp = {
            name: updatedAction.name,
            _id: updatedAction._id,
            endpoint: updatedAction.endpoint,
            description: updatedAction.description,
            permissions: associatedPermissions ? associatedPermissions : []
        };

        success(response, triggerResult);
    }
}
