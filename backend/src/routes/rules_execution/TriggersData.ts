import Route from "../../Route";
import { Request, Response } from "express";
import { checkUndefinedParams, forbiddenUserError, internalServerError } from "../../helper/http";
import Rule from "../../model/Rule";
import Trigger from "../../model/Trigger";
import axios from "axios";
import Action from "../../model/Action";
import logger from "../../helper/logger";
import Authorization from "../../model/Authorization";
import Service from "../../model/Service";
import Permission from "../../model/Permission";

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

        console.log("body=", request.body);

        if (checkUndefinedParams(response, triggerId, userId, api)) {
            return;
        }

        //Check that the user with the specified ID owns the service
        const referencedRule = await Rule.find({ userId: userId, triggerId: triggerId });
        const trigger = await Trigger.findById(triggerId);

        if (!trigger || !referencedRule) {
            forbiddenUserError(response, "You are not the owner of this rule");
            return;
        }

        //Verify that the API key is bound to the service owning the trigger
        const isValidAPIKey = await Service.isValidAPIKey(trigger.serviceId, api);
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
        const oauthToken = await Authorization.findToken(userId, trigger.serviceId);

        //Get the data from the resourceServer (if needed)
        let dataToForwardToActionAPI: object | null = null;

        if (trigger?.resourceServer) {
            if (!oauthToken) {
                forbiddenUserError(response, "Trigger not authorized");
                return;
            }

            // We were not specifying the granularity! That is contained in the trigger's permission field.

            const permissionIds = trigger.permissions ? trigger.permissions as string[] : [];
            const aggregateAuthorizationDetails = await Permission.getAggregateAuthorizationDetails(permissionIds);

            const axiosResponse = await axios.get(trigger?.resourceServer ?? "", {
                headers: {
                    Authorization: "Bearer " + oauthToken
                },
                params: {
                    filter: actionData.inputs,
                    "authorization_details": JSON.stringify(aggregateAuthorizationDetails)
                }
            });
            //Now we replace all URLs
            dataToForwardToActionAPI = axiosResponse.data;
        }

        //Forward the data to the Action API endpoint

        const actionEndpoint = actionData.endpoint;

        // TODO: Do we need to show some kind of rule execution error??
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
