import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, success } from "../../helper/http";
import Action from "../../model/Action";

export default class ActionsRoute extends Route {
    constructor() {
        super("actions", true);
    }


    protected async httpGet(request: Request, response: Response): Promise<void> {

    }
}