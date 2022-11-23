import Route from "../../Route";
import { Request, Response } from "express";
import { badRequest, success } from "../../helper/http";
import Action from "../../model/Action";

export default class ActionsRoute extends Route {
    constructor() {
        super("actions", true);
    }

    /*
    //Do we need filters here?
    protected async httpGet(request: Request, response: Response): Promise<void> {
        const parentServiceID = request.body.parentId;

        if (!parentServiceID) {
            badRequest(response, "Invalid parameters");
            return;
        }

        // Insert the trigger
        if (await Action.findAllChildrenOfService(parentServiceID)) {
            success(response);
        } else {
            badRequest(response, "Error while querying available triggers for the service");
        }
    }

     */
}