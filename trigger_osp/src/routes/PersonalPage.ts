import Route from "../Route";
import {Request, Response} from "express";

export default class PersonalPageRoute extends Route {
    constructor() {
        super("personal-page");
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {

    }

}