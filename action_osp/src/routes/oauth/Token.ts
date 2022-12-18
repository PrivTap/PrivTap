import Route from "../../Route";
import {Request, Response} from "express";

export default class TokenRoute extends Route {
    constructor() {
        super("token");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {

    }

}