import Route from "../../Route";
import { Request, Response } from "express";
import {TriggerData} from "../../helper/dataDefinition";
import {getReqHttp} from "../../helper/misc";

export default class AccessPostRoute extends Route {
    constructor() {
        super("resources", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        console.log("middleware called");
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
                    eventParams: eventDataParameters
                };
            }
            axiosResponse = await getReqHttp(request.protocol + '://' + request.get("host") + "/resource-server-internal", bearer, queryParams);
            resourceServerData = axiosResponse?.data;
            if (!resourceServerData) {
                console.log("Axios response data not found - sending empty data...");
            }
        } catch (e) {
            console.log("Axios response status =", axiosResponse?.status, "Error:", e);
        }

        //Format the received post data into the standard format
        let retrievedDataIdentifiers: string[] = [];
        let retrievedDataArrayed: unknown[] = [];
        if (resourceServerData.content) {
            retrievedDataArrayed.push(resourceServerData.content);
            retrievedDataIdentifiers.push("post-text");
        }
        if (resourceServerData.creationDate) {
            retrievedDataArrayed.push(resourceServerData.creationDate);
            retrievedDataIdentifiers.push("creation-date")
        }
        const formattedData = new TriggerData(retrievedDataArrayed, retrievedDataIdentifiers, actionDataFilter); //TODO: Change with actionDataFiletr when the PrivTap FE supports adding data definition objects to triggers and actions
        response.status(200).send(formattedData);
    }
}