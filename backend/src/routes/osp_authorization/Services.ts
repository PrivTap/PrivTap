import Route from "../../Route";
import { Request, Response } from "express";
import {  internalServerError, success } from "../../helper/http";
import Service from "../../model/Service";


export default class ServicesRoute extends Route {
    constructor() {
        super("services", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
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
    }
}