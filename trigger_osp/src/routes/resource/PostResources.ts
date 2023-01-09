import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";

export default class PostResources extends Route {
    constructor() {
        super("resources", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];

        let eventDataParameters = JSON.parse(request.query.eventDataParameters as string);
        if (typeof eventDataParameters == "string")
            eventDataParameters = JSON.parse(eventDataParameters) as {userGranularity: string[], postGranularity: string[]};
        else
            eventDataParameters = eventDataParameters as {userGranularity: string[], postGranularity: string[]};
        if (!eventDataParameters || !oauthToken){
            response.status(400).send();
            return;
        }

        if (!await Authorization.isAuthorized(oauthToken, eventDataParameters)){
            response.status(401).send();
            return;
        }

        const data = await Authorization.retrieveData(oauthToken, eventDataParameters);

        response.status(200).send(data);
    }
}