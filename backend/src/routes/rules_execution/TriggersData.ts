import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError, internalServerError } from "../../helper/http";
import Rule from "../../model/Rule";
import Trigger from "../../model/Trigger";
import axios from "axios";
import { replaceResourceURLs } from "../../helper/misc";
import Action from "../../model/Action";
import logger from "../../helper/logger";

export default class TriggersDataRoute extends Route {
    // TODO: figure out how to restrict this to only authorized services

    constructor() {
        super("triggers-data");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        //We received an event notification from the OSP

        const triggerId = request.body.triggerId;
        const userId = request.body.userId;
        const api = request.body.apiKey;
        const dataFetchInfo = request.body.dataFetchInfo;

        if (checkUndefinedParams(response, triggerId, userId, api)) {
            return;
        }

        //TODO: Verify that the API key is bound to the service owning the trigger

        //Check that the user with the specified ID owns the service
        const referencedRule = await Rule.find({ userId: userId, triggerId: triggerId });
        const triggerData = await Trigger.findById(triggerId);
        if (!triggerData || !referencedRule) {
            forbiddenUserError(response, "You are not the owner of this rule");
        }

        //TODO: Get the OAuth token for the trigger
        const oauthToken = "ASampleToken";

        //Get the data from the resourceServer (if needed)
        let dataToForwardToActionAPI: object | null = null;
        if (triggerData?.resourceServer) {
            const response = await axios.get(triggerData?.resourceServer ?? "", {
                headers: {
                    Authorization: "Bearer " + oauthToken
                },
                params: dataFetchInfo
            });
            //Now we replace all URLs
            dataToForwardToActionAPI = response.data;
            if (dataToForwardToActionAPI) {
                replaceResourceURLs(dataToForwardToActionAPI);
            } else {
                dataToForwardToActionAPI = null;
            }
        }

        //Forward the data to the Action API endpoint
        const actionEndpoint = (await Action.findById(referencedRule!.actionId, "endpoint"))?.endpoint;
        if (!actionEndpoint) {
            internalServerError(response);
            return;
        }

        //TODO: Do we need to show some kind of rule execution error??
        const actionResponse = await axios.post(actionEndpoint, dataToForwardToActionAPI, {
            headers: {
                Authorization: "Bearer " + oauthToken
            }
        });
        if (actionResponse.status.toString() != "200") {
            logger.error("Could not execute rule with id " + referencedRule?._id + " with error " + actionResponse.status.toString());
        }
    }
}
