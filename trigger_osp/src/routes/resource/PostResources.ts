import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";

export default class PostResources extends Route {
    constructor() {
        super("resources", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        console.log("resource server called");
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];

        let resourcesToRequest = JSON.parse(request.query.resourceToRequest as string);
        if (typeof resourcesToRequest == "string")
            resourcesToRequest = JSON.parse(resourcesToRequest) as {userGranularity: string[], postGranularity: string[]};
        else
            resourcesToRequest = resourcesToRequest as {userGranularity: string[], postGranularity: string[]};
        if (!resourcesToRequest || !oauthToken){
            response.status(400).send();
            return;
        }

        if (!await Authorization.isAuthorized(oauthToken, resourcesToRequest)){
            response.status(401).send();
            return;
        }

        const data = await Authorization.retrieveData(oauthToken, resourcesToRequest);

        response.status(200).send(data);
    }
}