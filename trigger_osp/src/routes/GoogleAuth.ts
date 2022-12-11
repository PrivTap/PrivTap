import Route from "../Route";
import {Request, Response} from "express";
import OAuth from "../helper/OAuth";

export default class LoginRoute extends Route {
    constructor() {
        super("google-auth");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const client = await OAuth.buildClient();
        const redirectUrl = await OAuth.gerRedirectUrl(client);
        console.log(redirectUrl);
        response.redirect(redirectUrl);
    }

}