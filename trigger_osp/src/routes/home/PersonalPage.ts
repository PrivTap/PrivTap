import Route from "../../Route";
import {Request, Response} from "express";
import ejs from "ejs";

export default class PersonalPageRoute extends Route {
    constructor() {
        super("personal-page", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const user = {name: "Lorenzo"}
        response.render("personal_page", {user: user});
    }
    protected async httpPost(request: Request, response: Response): Promise<void> {
        console.log(request.body);
    }
}