import Route from "../../Route";
import {Request, Response} from "express";
import Authentication from "../../helper/authentication";

export default class LoginRoute extends Route {
    constructor() {
        super("", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        try {
            Authentication.checkJWT(request);
            response.redirect("/personal-page");
        } catch (e) {
            response.render("login");
        }
    }
}