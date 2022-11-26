import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import Authorization, { ServiceTriggers } from "../../model/Authorization";

export default class TriggersRoute extends Route {
    constructor() {
        super("triggers");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.params.search;

        let data: ServiceTriggers[]  = [];

        const authorizedServices = await Authorization.findAllServicesAuthorizedByUserWithTriggers(request.userId);
        if (authorizedServices) {
            data = authorizedServices;
        }

        success(response, data);
    }

}