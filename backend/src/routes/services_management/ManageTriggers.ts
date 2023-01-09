import Route from "../../Route";
import {Request, Response} from "express";
import {badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success} from "../../helper/http";
import Trigger, {ITrigger} from "../../model/Trigger";
import Permissions from "../../model/Permission";
import Service from "../../model/Service";
import {handleInsert, handleUpdate} from "../../helper/misc";
import {transformStringInDataDef} from "../../helper/dataDefinition";


export default class ManageTriggersRoute extends Route {
    constructor() {
        super("manage-triggers", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const serviceId = request.query.serviceId as string;

        if (checkUndefinedParams(response, serviceId)) return;

        // Insert the trigger
        const triggers = await Trigger.findAllForService(serviceId, true);
        console.log(triggers);
        if (!triggers) {
            internalServerError(response);
            return;
        }
        let outputstrigger;
        for (const trigger of triggers) {
            try {
                if (trigger.outputs !== undefined) {
                    outputstrigger = (JSON.parse(trigger.outputs)).trigger_data;
                }
            } catch (e) {
                outputstrigger = [];
            }
            outputstrigger = JSON.stringify(outputstrigger);
            trigger.outputs=outputstrigger;
        }
        success(response, triggers);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const name = request.body.name;
        const description = request.body.description;
        const serviceId = request.body.serviceId;
        const permissions = request.body.permissions;
        const resourceServer = request.body.resourceServer;
        const out = request.body.outputs;
        const service = await Service.findById(serviceId);
        if (checkUndefinedParams(response, name, description, serviceId, out)) return;

        // Check that the user is the owner of the service
        if (!await Service.isCreator(request.userId, serviceId)) {
            forbiddenUserError(response, "You are not the owner of this service");
            return;
        }
        const outputs = transformStringInDataDef(out);
        if (outputs === null) {
            badRequest(response, "outputs are not in the valid format");
            return;
        }
        //check if the service has a trigger notification server
        if (service !== null && !service.triggerNotificationServer) {
            badRequest(response, "This service does not have a trigger notification server");
            return;
        }
        // Insert the trigger
        const insertedTrigger = await handleInsert(response, Trigger, {
            name,
            description,
            serviceId,
            permissions,
            resourceServer,
            outputs
        }, true) as ITrigger;
        if (!insertedTrigger) return;
        const associatedPermissions = await Permissions.getAllPermissionAndAddBooleanTag(serviceId, insertedTrigger.permissions as string[]);
        let outputsTrigger;
        try {
            outputsTrigger = (JSON.parse(insertedTrigger.outputs)).trigger_data;
        } catch (e) {
            outputsTrigger = [];
        }
        outputsTrigger = JSON.stringify(outputsTrigger);
        const triggerResult: Partial<ITrigger> = {
            name: insertedTrigger.name,
            _id: insertedTrigger._id,
            resourceServer: insertedTrigger.resourceServer,
            description: insertedTrigger.description,
            permissions: associatedPermissions ? associatedPermissions : [],
            outputs: outputsTrigger
        };

        success(response, triggerResult);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const triggerId = request.body.triggerId;

        if (checkUndefinedParams(response, triggerId)) return;

        // Check that the user is the owner of the Trigger
        if (!await Trigger.isCreator(request.userId, triggerId)) {
            forbiddenUserError(response, "You are not the owner of this trigger");
            return;
        }

        if (await Trigger.delete(triggerId)) {
            success(response);
        } else {
            badRequest(response, "This trigger doesn't exists");
            return;
        }
    }

    protected async httpPut(request: Request, response: Response): Promise<void> {
        const triggerId = request.body.triggerId;
        const name = request.body.name;
        const description = request.body.description;
        const permissions = request.body.permissions;
        const resourceServer = request.body.resourceServer;
        const out = request.body.outputs;
        //check if the outputs is valid
        const outputs = transformStringInDataDef(out);
        if (outputs === null) {
            badRequest(response, "The outputs is not in the valid format");
            return;
        }
        if (checkUndefinedParams(response, triggerId)) return;

        if (!await Trigger.isCreator(request.userId, triggerId)) {
            forbiddenUserError(response, "You are not the owner of this trigger");
            return;
        }

        const modifiedTrigger = await handleUpdate(response, Trigger, {"_id": triggerId}, {
            name,
            description,
            permissions,
            resourceServer,
            outputs
        }, true) as ITrigger;
        if (!modifiedTrigger) return;
        let outputsTrigger;
        try {
            outputsTrigger = (JSON.parse(modifiedTrigger.outputs)).trigger_data;
        } catch (e) {
            outputsTrigger = [];
        }
        outputsTrigger = JSON.stringify(outputsTrigger);
        const associatedPermissions = await Permissions.getAllPermissionAndAddBooleanTag(modifiedTrigger.serviceId, modifiedTrigger.permissions as string[]);
        const triggerResult: Partial<ITrigger> = {
            name: modifiedTrigger.name,
            _id: modifiedTrigger._id,
            resourceServer: modifiedTrigger.resourceServer,
            description: modifiedTrigger.description,
            permissions: associatedPermissions ? associatedPermissions : [],
            outputs: outputsTrigger
        };

        success(response, triggerResult);
    }
}
