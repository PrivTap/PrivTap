import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError } from "../../helper/http";
import dataRuleExecution from "../../model/DataRuleExecution";

export default class ActionData extends Route {
    // TODO: figure out how to restrict this to only authorized services

    constructor() {
        super("action-data",false,false);
    }

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
}
