import Route from "../Route";
import {Request, Response} from "express";
import { join } from "path";

export default class AuthorizeRoute extends Route {
    constructor() {
        super("authorize");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {

    }

}