import Route from "../../Route";
import {Request, Response} from "express";

export default class PersonalPageRoute extends Route {
    constructor() {
        super("personal-page", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        response.status(200).send("Orcoddio");
    }

}