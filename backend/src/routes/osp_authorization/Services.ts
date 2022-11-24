import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import Service from "../../model/Service";


export default class ServicesRoute extends Route {
    constructor() {
        super("services");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        // TODO: Rewrite this so that it returns a list of services where it is added if the user has authorized it or not

        const services = await Service.findAll();

        if (services)
            success(response, services);
        else
            success(response, []);

        // We don't really need to worry about pagination now, if we want to implement it, we will do it later with a plugin
        /*
        const itemsPerPageS = request.query.items;
        const pageS = request.query.page;
        const itemsPerPageN = itemsPerPageS === undefined ? undefined : Number.parseInt(itemsPerPageS.toString());
        const pageN = pageS === undefined ? undefined : Number.parseInt(pageS.toString());

        const services = await Service.findServices(itemsPerPageN, pageN);
        if (services!=null) {
            success(response,services);
        } else {
            internalServerError(response);
        }

         */
    }
}