import Route from "../../Route";
import { Request, Response } from "express";
import {
    badRequest,
    checkUndefinedParams,
    forbiddenUserError,
    internalServerError,
} from "../../helper/http";
import Rule from "../../model/Rule";
import Trigger from "../../model/Trigger";
import Action from "../../model/Action";
import logger from "../../helper/logger";
import Authorization from "../../model/Authorization";
import Service from "../../model/Service";
import { dataDefinitionIDs } from "../../helper/dataDefinition";
import Permission from "../../model/Permission";
import { getReqHttp, postReqHttp } from "../../helper/misc";

export default class TriggersDataRoute extends Route {
    // TODO: figure out how to restrict this to only authorized services

    constructor() {
        super("triggers-data", false, false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        //We received an event notification from the OSP
        const triggerId = request.body.triggerId;
        const userId = request.body.userId;
        const api = request.body.apiKey;

        if (checkUndefinedParams(response, triggerId, userId, api)) {
            return;
        }

        //Check that the user with the specified ID owns the service
        const referencedRule = await Rule.find({ userId: userId, triggerId: triggerId });
        const triggerData = await Trigger.findById(triggerId);

        if (!triggerData || !referencedRule) {
            forbiddenUserError(response, "You are not the owner of this rule");
            return;
        }

        //Verify that the API key is bound to the service owning the trigger
        const isValidAPIKey = await Service.isValidAPIKey(triggerData.serviceId, api);
        if (!isValidAPIKey) {
            forbiddenUserError(response, "Invalid key");
            return;
        }

        const actionData = await Action.findById(referencedRule!.actionId);
        if (!actionData?.endpoint) {
            internalServerError(response);
            return;
        }
        //Get the OAuth token for the trigger
        let oauthToken = await Authorization.findToken(userId, triggerData.serviceId);

        //Get the data from the resourceServer (if needed)
        let dataToForwardToActionAPI: object | null = null;
        if (triggerData?.resourceServer) {
            if (!oauthToken) {
                forbiddenUserError(response, "Trigger not authorized");
                return;
            }

            //TODO: RAR data MUST NOT be sent manually since it is already included in the token
            const permissionIds: string[] = (triggerData.permissions ?? []) as string[];
            const aggregateAuthorizationDetails = await Permission.getAggregateAuthorizationDetails(permissionIds);

            let axiosResponse;
            try {
                axiosResponse = await getReqHttp(triggerData?.resourceServer, oauthToken, {
                    filter: dataDefinitionIDs(actionData.inputs),
                    authDetails: aggregateAuthorizationDetails
                });
                dataToForwardToActionAPI = axiosResponse?.data;
                if (!dataToForwardToActionAPI){
                    logger.debug("Axios response data not found");
                    internalServerError(response);
                    return;
                }
                //console.log("data =", dataToForwardToActionAPI);
            } catch (e){
                logger.debug("Axios response status =", axiosResponse?.status);
            }
        }

        //Forward the data to the Action API endpoint

        const actionEndpoint = actionData.endpoint;
        oauthToken = await Authorization.findToken(userId, actionData.serviceId);

        if (!actionEndpoint) {
            internalServerError(response);
            return;
        }

        // TODO: Do we need to show some kind of rule execution error??
        let actionResponse;
        try {
            actionResponse = await postReqHttp(actionEndpoint, oauthToken, { content: dataToForwardToActionAPI });
        } catch (e) {
            logger.debug("Could not execute rule with id " + referencedRule?._id + " with error " + actionResponse?.status);
        }

        if (actionResponse?.status.toString() != "200") {
            logger.error("Could not execute rule with id " + referencedRule?._id + " with error " + actionResponse?.status.toString());
        }

        response.status(200).send();
    }
}
