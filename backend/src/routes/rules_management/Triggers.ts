import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import Authorization from "../../model/Authorization";
import { IService } from "../../model/Service";
import Trigger, { ITrigger } from "../../model/Trigger";

type ServiceTriggers = { serviceName: string, serviceId: string, triggers: Partial<ITrigger>[] }

export default class TriggersRoute extends Route {
    constructor() {
        super("triggers");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: If we have time implement search https://www.mongodb.com/docs/atlas/atlas-search/query-syntax/#mongodb-pipeline-pipe.-search
        // const searchQuery = request.query.search;

        const data: ServiceTriggers[]  = [];

        const authorizedServices = await Authorization.findAllServicesAuthorizedByUser(request.userId);
        if (authorizedServices) {
            for (const result of authorizedServices) {
                const service: IService = result.service as IService;

                let triggers = await Trigger.findAllForService(service._id);
                if(!triggers)
                    triggers = [];

                const dataEntry: ServiceTriggers = {
                    serviceName: service.name,
                    serviceId: service._id,
                    triggers
                };

                data.push(dataEntry);
            }
        }

        success(response, data);
    }

}