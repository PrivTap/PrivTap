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

        const action = await Action.findById(referencedRule!.actionId);
        if (!action?.endpoint) {
            internalServerError(response);
            return;
        }

        //Get the OAuth token for the trigger
        let oauthToken = await Authorization.findToken(userId, trigger.serviceId);
        if (!oauthToken){
            forbiddenUserError(response, "Trigger not authorized");
            return;
        }

        //Get the data from the resourceServer (if needed)
        if (!trigger.resourceServer){
            badRequest(response);
            return;
        }

        const permissionIds = trigger.permissions ? trigger.permissions as string[] : [];
        const aggregateAuthorizationDetails = await Permission.getAggregateAuthorizationDetails(permissionIds);

        let axiosResponse;
        try {
            axiosResponse = await getReqHttp(trigger?.resourceServer, oauthToken, aggregateAuthorizationDetails);
        } catch (e){
            logger.debug("Axios respose status =", axiosResponse?.status);
        }

        if (!axiosResponse?.data){
            logger.debug("Axios response data not found");
            internalServerError(response);
            return;
        }

        const dataToForwardToActionAPI = axiosResponse.data;
        console.log("data =", dataToForwardToActionAPI);

        //Forward the data to the Action API endpoint

        const actionEndpoint = action.endpoint;
        oauthToken = await Authorization.findToken(userId, action.serviceId);

        if(!oauthToken){
            forbiddenUserError(response);
            return;
        }

        // TODO: Do we need to show some kind of rule execution error??
        try{
            axiosResponse = await postReqHttp(actionEndpoint, oauthToken, { content: dataToForwardToActionAPI });
        } catch (e) {
            logger.debug("Could not execute rule with id " + referencedRule?._id + " with error " + axiosResponse?.status);
        }

        response.status(200).send();
    }
}