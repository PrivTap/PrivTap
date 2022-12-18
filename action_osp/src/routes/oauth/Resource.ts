import Route from "../../Route";
import {Request, Response} from "express";

export default class ResourceRoute extends Route {
    constructor() {
        super("resource");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {

    }

}