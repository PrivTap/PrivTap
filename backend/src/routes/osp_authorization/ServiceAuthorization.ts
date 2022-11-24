import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class ServiceAuthorizationRoute extends Route {
    constructor() {
        super("service-authorization");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}