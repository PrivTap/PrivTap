import Route from "../../Route";
import {Request, Response} from "express";
import {TriggerData} from "../../helper/dataDefinition";
import {getReqHttp} from "../../helper/misc";
import logger from "../../helper/logger";

export default class Middleware extends Route {
    constructor() {
        super("middleware", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        logger.debug("middleware called");
        const bearer = request.headers.authorization as string;
        const eventDataParameters = request.query.eventDataParameters;
        const actionDataFilter: string[] = (request.query.filter as string[] | null) ?? []; //Used to filter retrieved data with only what was requested by the action

        //Receive the data from the trigger internal resource server endpoint
        let resourceServerData;
        let axiosResponse;
        try {
            let queryParams = {};
            if (eventDataParameters) {
                queryParams = {
                    eventDataParameters
                };
            }
            axiosResponse = await getReqHttp(request.protocol + '://' + request.get("host") + "/resources", bearer, queryParams);
            resourceServerData = axiosResponse?.data;
            if (!resourceServerData) {
                logger.debug("Axios response data not found - sending empty data...");
                response.status(200).send(new TriggerData([], [], []));
                return;
            }
        } catch (e) {
            logger.debug("Axios response status =", axiosResponse?.status, "Error:", e);
            response.status(200).send(new TriggerData([], [], []));
            return;
        }

        //Format the received post data into the standard format
        let retrievedDataIdentifiers: string[] = [];
        let retrievedDataArrayed: unknown[] = [];

        const postData = resourceServerData.postData[0]??"";
        if (postData.content) {
            retrievedDataArrayed.push(postData.content);
            retrievedDataIdentifiers.push("post-text");
        }
        if (postData.creationDate) {
            retrievedDataArrayed.push(postData.creationDate);
            retrievedDataIdentifiers.push("creation-date")
        }

        const userData = resourceServerData.userData[0]??"";
        if (userData.username) {
            retrievedDataArrayed.push(userData.username);
            retrievedDataIdentifiers.push("username");
        }
        if (userData.email) {
            retrievedDataArrayed.push(userData.email);
            retrievedDataIdentifiers.push("email")
        }

        const formattedData = new TriggerData(retrievedDataArrayed, retrievedDataIdentifiers, actionDataFilter); //TODO: Change with actionDataFiletr when the PrivTap FE supports adding data definition objects to triggers and actions
        response.status(200).send(formattedData);
    }
}