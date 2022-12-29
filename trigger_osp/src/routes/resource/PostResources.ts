import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";
import Permission from "../../model/Permission";
import {TriggerData} from "../../helper/dataDefinition";

export default class PostResources extends Route {
    constructor() {
        super("post-resources", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        console.log("resource server called");
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];
        const resourcesToRequest = JSON.parse(request.query.resourceToRequest as string) as {userGranularity: string[], postGranularity: string[]};
        console.log("resourcesToRequest =", resourcesToRequest);

        if (!resourcesToRequest || !oauthToken){
            response.status(400).send();
            return;
        }

        if (!await Authorization.isAuthorized(oauthToken, resourcesToRequest)){
            response.status(401).send();
            return;
        }

        const data = await Authorization.retrieveData(oauthToken, resourcesToRequest);

        //Format the received post data into the standard format
        //response.status(200).send(formattedData);
    }
}