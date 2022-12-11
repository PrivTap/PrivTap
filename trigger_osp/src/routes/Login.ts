import Route from "../Route";
import {Request, Response} from "express";

export default class LoginRoute extends Route {
    constructor() {
        super("");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        response.render("login");
    }
}