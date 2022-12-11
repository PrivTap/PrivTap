import Route from "../../Route";
import {Request, Response} from "express";

export default class NewPostRoute extends Route {
    constructor() {
        super("newPost", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {

    }

}