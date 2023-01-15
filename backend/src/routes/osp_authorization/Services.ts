import Route from "../../Route";
import {Request, Response} from "express";
import {badRequest, success} from "../../helper/http";
import Service from "../../model/Service";
import Authorization from "../../model/Authorization";


export default class ServicesRoute extends Route {
    constructor() {
        super("services");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const authorized = request.query.authorized;
        const userId = request.userId;
        const serviceId = request.query.serviceId;
        let services = null;
        if (authorized) {
            services = await Authorization.findAllAuthorizedServices(userId);
        } else {
            if (serviceId) {
                const tmp = await Service.findAll({_id: serviceId}, "_id name description baseUrl");
                if (tmp !== null) {
                    services = tmp[0];
                }
            } else services = await Service.findAll({}, "_id name description baseUrl");
        }

        if (services)
            success(response, services);
        else
            badRequest(response, "No services found");
    }
}