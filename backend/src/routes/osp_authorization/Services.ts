import Route from "../../Route";
import { Request, Response } from "express";
import { internalServerError, success } from "../../helper/http";
import Service from "../../model/Service";
import Authorization from "../../model/Authorization";


export default class ServicesRoute extends Route {
    constructor() {
        super("services");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const authorized = request.query.authorized;
        const userId = request.userId;

        let services;
        if (authorized){
            services = await Authorization.findAllAuthorizedServices(userId);
        } else {
            services = await Service.findAll({}, "_id name description");
        }

        if (services)
            success(response, services);
        else
            internalServerError(response);
    }
}