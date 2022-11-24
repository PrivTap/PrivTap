import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError, internalServerError, success } from "../../helper/http";
import Rule from "../../model/Rule";
import { handleInsert } from "../../helper/misc";

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

        if (checkUndefinedParams(response, triggerId, actionId)) return;

        if (!await handleInsert(response, Rule, { userId, triggerId, actionId })) return;

        success(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const ruleId = request.body.ruleId;

        if (checkUndefinedParams(response, ruleId)) return;

        // Checks if the rule is associated to the user
        if (!await Rule.isCreator(request.userId, ruleId)) {
            forbiddenUserError(response, "You are not the owner of this rule");
            return;
        }

        if (!await Rule.delete(ruleId)){
            internalServerError(response);
            return;
        }

        success(response);
    }

}