import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Rule from "../../model/Rule";
import { deleteReqHttp, handleInsert, postReqHttp } from "../../helper/misc";
import Authorization from "../../model/Authorization";
import logger from "../../helper/logger";
import Trigger from "../../model/Trigger";
import RuleExecution from "../../helper/rule_execution";
import Action from "../../model/Action";

export default class RulesRoute extends Route {
    constructor() {
        super("rules");
    }

    // Implement filter option?
    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;

        const rules = await Rule.findAllForUser(userId);

        const responseContent = rules ? rules : [];
        success(response, responseContent);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const name = request.body.name;
        const triggerId = request.body.triggerId;
        const actionId = request.body.actionId;

        if (checkUndefinedParams(response, name, triggerId, actionId)) return;

        //CHECK IF TRIGGER AND ACTION ARE EFFECTIVELY COMPATIBLE
        if (!(await RuleExecution.areActionTriggerCompatible(actionId, triggerId))) {
            badRequest(response, "Action and trigger are not compatible");
            return;
        }

        //To check if trigger and action are authorized we check if the parent services are authorized
        const trigger = await Trigger.findById(triggerId);
        const action = await Action.findById(actionId);

        //This verifies that Trigger and Action actually exist
        if (!trigger || !action) {
            badRequest(response, "Trigger or Action not found");
            return;
        }

        const isTriggerAuthorized = (await Authorization.findToken(userId, trigger.serviceId)) != null;
        let isActionAuthorized = isTriggerAuthorized;
        if (action.serviceId != trigger.serviceId) {
            isActionAuthorized = (await Authorization.findToken(userId, action.serviceId) != null);
        }

        if (!isTriggerAuthorized || !isActionAuthorized) {
            badRequest(response, "Trigger or Action not authorized");
            return;
        }

        //TODO the response should go down after the control of the token
        const ruleId = await handleInsert(response, Rule, { userId, name, triggerId, actionId });
        if (!ruleId) return;
        success(response);

        //every time a rule is created then we should notify the service of the trigger by sending to him
        //triggerId and user Id
        const triggerService = await Trigger.getTriggerServiceNotificationServer(triggerId);
        if (triggerService != null) {
            const token = triggerService.serviceId != undefined ? await Authorization.findToken(userId, triggerService.serviceId) : null;
            if (token != null) {
                if (triggerService.triggerNotificationServer != undefined) {
                    //TODO should respond to the user that he can't create this rule because he didn't authorize the service (do this also for action)
                    //console.log("seding req");
                    await postReqHttp(triggerService.triggerNotificationServer, token, {
                        userId,
                        triggerId,
                        "triggerName": trigger.name
                    });
                }
            }
        } else
            logger.error("/rules: triggerService == null");
        return;
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const ruleId = request.body.ruleId;
        const userId = request.userId;
        if (checkUndefinedParams(response, ruleId)) return;

        // Checks if the rule is associated to the user
        if (!await Rule.isCreator(request.userId, ruleId)) {
            forbiddenUserError(response, "You are not the owner of this rule");
            return;
        }
        const triggerService = await Rule.getTriggerServiceNotificationServer(ruleId);
        //deleting the rule
        if (!await Rule.delete(ruleId)) {
            internalServerError(response);
            return;
        }
        success(response);

        //notifying the OSP that he doesn't need to notify us for the trigger anymore
        if (triggerService != null) {
            const token = triggerService.serviceId != undefined ? await Authorization.findToken(userId, triggerService.serviceId) : null;
            if (token != null) {
                const triggerId = triggerService.triggerId;
                const referencedRules = await Rule.findAll({ userId: userId, triggerId: triggerId });
                if (triggerService.triggerNotificationServer != undefined && referencedRules?.length == 0)
                    await deleteReqHttp(triggerService.triggerNotificationServer, token, { userId, triggerId });
            } else {
                //TODO do a generic error when a user doesn't have the token for a service?
            }
        }
        return;
    }

    // TODO: Implement PUT
}