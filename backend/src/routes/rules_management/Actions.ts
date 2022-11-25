import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import Action, { IAction } from "../../model/Action";
import { IService } from "../../model/Service";
import Authorization from "../../model/Authorization";

type ServiceActions = { serviceName: string, serviceId: string, actions: Partial<IAction>[] }

export default class ActionsRoute extends Route {
    constructor() {
        super("actions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.params.search;

        const data: ServiceActions[]  = [];

        const authorizedServices = await Authorization.findAllServicesAuthorizedByUser(request.userId);
        if (authorizedServices) {
            for (const result of authorizedServices) {
                const service: IService = result.service as IService;

                let actions = await Action.findAllForService(service._id);
                if(!actions)
                    actions = [];

                const dataEntry: ServiceActions = {
                    serviceName: service.name,
                    serviceId: service._id,
                    actions
                };

                data.push(dataEntry);
            }
        }

        success(response, data);
    }
}