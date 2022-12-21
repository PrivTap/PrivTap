import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, internalServerError, success } from "../../helper/http";
import Action from "../../model/Action";
import RuleExecution from "../../helper/rule_execution";

export default class ActionsRoute extends Route {
    constructor() {
        super("actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.query.search;

        const serviceId = request.query.serviceId as string;
        const userId = request.userId;
        const triggerId = request.query.triggerId as string;
        if (checkUndefinedParams(response, serviceId))
            return;
        const data = await Action.findAllActionAddingAuthorizedTag(userId, serviceId);
        if (data == null) {
            internalServerError(response);
            return;
        }

        //TODO: Can we check compatibility on the DB?
        if (triggerId) {
            data.filter((action) => RuleExecution.areActionTriggerCompatible(action._id ?? "", triggerId));
        }
        success(response, data);
    }
}