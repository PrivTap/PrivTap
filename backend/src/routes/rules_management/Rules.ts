import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Rule from "../../model/Rule";
import { deleteHttp, getHttp, handleInsert } from "../../helper/misc";
import Authorization from "../../model/Authorization";
import logger from "../../helper/logger";

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
        const triggerId = request.body.triggerId;
        const actionId = request.body.actionId;
        //TODO CHECK IF TRIGGER AND ACTION ARE EFFECTIVELY COMPATIBLE AND AUTHORIZED
        if (checkUndefinedParams(response, triggerId, actionId)) return;
        //TODO the response should go down after the control of the token
        const ruleId = await handleInsert(response, Rule, { userId, triggerId, actionId });
        if (!ruleId) return;
        success(response);
        //every time a rule is created then we should notify the service of the trigger by sending to him
        //triggerId and user Id
        const triggerService = await Rule.getTriggerServiceNotificationServer(ruleId);

        if (triggerService != null) {
            const token = await Authorization.findToken(userId, triggerService.serviceId);
            if (token != null)
                //TODO should respond to the user that he can't create this rule because he didn't authorize the service (do this also for action)
                await getHttp(triggerService.triggerNotificationServer, token);
        } else
            logger.error("Error while");
        return;
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const ruleId = request.body.ruleId;

        if (checkUndefinedParams(response, ruleId)) return;

        // Checks if the rule is associated to the user
        if (!await Rule.isCreator(request.userId, ruleId)) {
            forbiddenUserError(response, "You are not the owner of this rule");
            return;
        }

        if (!await Rule.delete(ruleId)) {
            internalServerError(response);
            return;
        }
        success(response);
        //notifying the OSP that he doesn't need to notify us for the trigger anymore
        const triggerService = await Rule.getTriggerServiceNotificationServer(ruleId);

        if (triggerService != null) {
            const token = await Authorization.findToken(request.userId, triggerService.serviceId);
            if (token != null)
                //TODO should respond to the user that he can't create this rule because he didn't authorize the service (do this also for action)
                await deleteHttp(triggerService.triggerNotificationServer, token);
            else {
                //TODO do a generic error when a user doesn't have the token for a service?
            }
            return;
        }

    }
}