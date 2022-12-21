import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, internalServerError, success } from "../../helper/http";
import Trigger from "../../model/Trigger";

export default class TriggersRoute extends Route {
    constructor() {
        super("triggers");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.query.search;
        const serviceId = request.query.serviceId as string;
        const userId = request.userId;
        if (checkUndefinedParams(response, serviceId))
            return;
        const data = await Trigger.findAllTriggerAddingAuthorizedTag(userId, serviceId);
        if (data == null) {
            internalServerError(response);
            return;
        }

        success(response, data);
    }
}