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
        const userID = request.userId;
        const rules = await Rule.findByUserID(userID);
        const responseContent = { "rules": rules };
        success(response, responseContent);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userID = request.userId;
        const triggerID = request.body.triggerId;
        const actionId = request.body.actionId;

        if (checkUndefinedParams(triggerID, actionId)){
            return;
        }
        if (await Rule.insertNewRule(new Types.ObjectId(userID), new Types.ObjectId(triggerID), new Types.ObjectId(actionId)))
            success(response, {}, "Not implemented");
        else
            internalServerError(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        const userID = request.userId;
        const ruleId = request.body.ruleId;

        if (checkUndefinedParams(ruleId)){
            return;
        }

        const rules = await Rule.findByUserID(userID);

        // Checks if the rule is associated to the user
        if (rules?.filter(rule => rule._id.toString() == ruleId).length != 1){
            badRequest(response);
            return;
        }

        if (! await Rule.deleteRule(ruleId)){
            internalServerError(response);
            return;
        }

        const updatedRules = await Rule.findByUserID(userID);
        const responseContent = { "rules": updatedRules };
        success(response, responseContent);
    }

}
// 637a9f0d80258262920259fb