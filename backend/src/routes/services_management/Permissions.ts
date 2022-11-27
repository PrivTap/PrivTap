import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class ManageActionsRoute extends Route {
    constructor() {
        super("permissions");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {

        success(response);
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response);
    }

    protected async httpPut(request: Request, response: Response): Promise<void> {
        success(response);
    }
}
