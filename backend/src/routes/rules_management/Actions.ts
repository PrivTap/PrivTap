import Route from "../../Route";
import { Request, Response } from "express";
import { internalServerError, success } from "../../helper/http";
import Authorization, { ServiceActions } from "../../model/Authorization";

export default class ActionsRoute extends Route {
    constructor() {
        super("actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.query.search;

        let data: ServiceActions[]  = [];

        // TODO: query only compatible actions
        // const triggerId = request.query.triggerId;
        const authorizedServices = await Authorization.findAllServicesAuthorizedByUserWithActions(request.userId);
        if (!authorizedServices) {
            internalServerError(response);
            return;
        }

        data = authorizedServices;
        success(response, data);
    }
}