import Route from "../../Route";
import { Request, Response } from "express";
import { internalServerError, success } from "../../helper/http";
import Authorization, { ServiceActions } from "../../model/Authorization";
import RuleExecution from "../../helper/rule_execution";

export default class ActionsRoute extends Route {
    constructor() {
        super("actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.query.search;

        let data: ServiceActions[]  = [];

        //query only compatible actions
        const triggerId = request.query.triggerId as string;
        let authorizedServices = await Authorization.findAllServicesAuthorizedByUserWithActions(request.userId);
        if (!authorizedServices) {
            internalServerError(response);
            return;
        }

        //TODO: Can we check compatibility on the DB?
        if (triggerId) {
            authorizedServices = authorizedServices.map((service) => {
                return {
                    serviceId: service.serviceId,
                    serviceName: service.serviceName,
                    actions: service.actions.filter((action) => RuleExecution.areActionTriggerCompatible(action._id ?? "", triggerId))
                };
            }).filter((service) => service.actions.length > 0);
        }

        data = authorizedServices;
        success(response, data);
    }
}