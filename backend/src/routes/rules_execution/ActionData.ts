import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError } from "../../helper/http";


export default class ActionData extends Route {

    constructor() {
        super("action-data",false,false);
    }

    // THIS CLASS IS FUCKING USELESS

    /*
    protected async httpGet(request: Request, response: Response): Promise<void> {
        const dataId = request.query.dataId as string;
        const apiKey = request.query.apiKey as string;
        if (checkUndefinedParams(response, dataId, apiKey))
            return;
        const data = await dataRuleExecution.findById(dataId);
        if (data == null || data.apiKey != apiKey) {
            forbiddenUserError(response);
            return;
        }
        if (await dataRuleExecution.downloadAndDeleteFile(dataId, data.fileId, response)) {
            response.status(200);
            response.send();
        } else {
            response.status(500);
            response.send();
        }
    }

     */
}

