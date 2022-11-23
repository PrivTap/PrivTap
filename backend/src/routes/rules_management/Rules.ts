import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, checkUndefinedParams, internalServerError, success } from "../../helper/http";
import Rule from "../../model/Rule";
import { Types } from "mongoose";

export default class RulesRoute extends Route {
    constructor() {
        super("rules", true, true);
    }

    // Implement filter option?
    protected async httpGet(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const rules = await Rule.findByUserId(userId);
        const responseContent = { "rules": rules };
        success(response, responseContent);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const triggerId = request.body.triggerId;
        const actionId = request.body.actionId;

        if (checkUndefinedParams(triggerId, actionId)){
            return;
        }
        if (await Rule.insertNewRule(new Types.ObjectId(userId), new Types.ObjectId(triggerId), new Types.ObjectId(actionId)))
            success(response);
        else
            internalServerError(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const ruleId = request.body.ruleId;

        if (checkUndefinedParams(ruleId)){
            return;
        }

        const rules = await Rule.findByUserId(userId);

        // Checks if the rule is associated to the user
        if (rules?.filter(rule => rule._id.toString() == ruleId).length != 1){
            badRequest(response);
            return;
        }

        if (! await Rule.deleteRule(ruleId)){
            internalServerError(response);
            return;
        }

        const updatedRules = await Rule.findByUserId(userId);
        const responseContent = { "rules": updatedRules };
        success(response, responseContent);
    }

}