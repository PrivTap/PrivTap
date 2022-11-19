import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, internalServerError, success } from "../../helper/http";
import Service from "../../model/Service";

export default class ServicesRoute extends Route {
    constructor() {
        super("services", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        let itemsPerPage = request.body.items;
        let page = request.body.page;
        try {
            itemsPerPage = Number.parseInt(itemsPerPage);
            page = Number.parseInt(page);
        } catch (e) {
            badRequest(response);
            return;
        }
        try {
            const services = await Service.findServices(itemsPerPage, page);
            success(response, new Object({ "services": services }));
        } catch (e) {
            internalServerError(response);
        }
    }
}