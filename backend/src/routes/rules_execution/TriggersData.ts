import Route from "../../Route";
import { Request, Response } from "express";
import {
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
import { DataDefinition, dataDefinitionIDs } from "../../helper/dataDefinition";
import { checkActionDataFormat, getReqHttp, postReqHttp } from "../../helper/misc";

export default class TriggersDataRoute extends Route {

    constructor() {
        super("triggers-data", false, false);
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        //We received an event notification from the OSP
        const triggerId = request.body.triggerId;
        const userId = request.body.userId;
        const api = request.body.apiKey;
        const optionalEventDataParameters = request.body.eventDataParameters;

        if (checkUndefinedParams(response, triggerId, userId, api)) {
            return;
        }

        //Check that the user with the specified ID owns the service
        const referencedRules = await Rule.findAll({ userId: userId, triggerId: triggerId });
        const trigger = await Trigger.findById(triggerId);

        if (!trigger || !referencedRules) {
            logger.debug("You are not the owner of this rule");
            forbiddenUserError(response, "You are not the owner of this rule");
            return;
        }

        for (const referencedRule of referencedRules) {
            //Verify that the API key is bound to the service owning the trigger
            const isValidAPIKey = await Service.isValidAPIKey(trigger.serviceId, api);
            if (!isValidAPIKey) {
                forbiddenUserError(response, "Invalid key");
                return;
            }

            const action = await Action.findById(referencedRule.actionId as string);
            if (!action?.endpoint) {
                internalServerError(response);
                return;
            }

            //Get the OAuth token for the trigger
            let oauthToken = await Authorization.findToken(userId, trigger.serviceId);

            //Get the data from the resourceServer (if needed)
            let dataToForwardToActionAPI: object | null = null;
            const parsed = JSON.parse(action.inputs) as DataDefinition;
            const actionRequiredIDs = dataDefinitionIDs(parsed);
            if (trigger?.resourceServer) {
                if (!oauthToken) {
                    forbiddenUserError(response, "Trigger not authorized");
                    return;
                }

                let axiosResponse;
                try {
                    const queryParams: Record<string, unknown> = {
                        filter: actionRequiredIDs,
                    };
                    if (optionalEventDataParameters) {
                        queryParams.eventDataParameters = optionalEventDataParameters;
                    }
                    axiosResponse = await getReqHttp(trigger?.resourceServer, oauthToken, queryParams);
                    dataToForwardToActionAPI = axiosResponse?.data;
                    logger.debug("Data received by trigger =", dataToForwardToActionAPI);
                    if (!dataToForwardToActionAPI) {
                        logger.debug("Axios response data not found");
                        internalServerError(response);
                        return;
                    }
                } catch (e){
                    logger.debug("Axios response status =", axiosResponse?.status);
                    return;
                }
            }

            //Forward the data to the Action API endpoint
            const actionEndpoint = action.endpoint;
            oauthToken = await Authorization.findToken(userId, action.serviceId);

            if (!actionEndpoint || !oauthToken) {
                internalServerError(response);
                return;
            }

            //Check that the data sent to action is compatible with the action data format (i.e. contains all the data required by it)
            const triggerDataIDs = dataDefinitionIDs(dataToForwardToActionAPI as DataDefinition);

            if (!triggerDataIDs || checkActionDataFormat(actionRequiredIDs, triggerDataIDs)) {
                logger.debug("Trigger Sending Less Data than what the Action requires! Rule execution skipped...");
                internalServerError(response);
                return;
            }

            // TODO: Do we need to show some kind of rule execution error??
            let actionResponse;
            try {
                actionResponse = await postReqHttp(actionEndpoint, oauthToken, dataToForwardToActionAPI ?? {});
            } catch (e) {
                logger.debug("Could not execute rule with id " + referencedRule?._id + " with error " + actionResponse?.status);
            }
            if (actionResponse?.status.toString() != "200") {
                logger.error("Could not execute rule with id " + referencedRule?._id + " with error " + actionResponse?.status.toString());
                internalServerError(response);
                return;
            }
        }

        response.status(200).send();
    }
}
