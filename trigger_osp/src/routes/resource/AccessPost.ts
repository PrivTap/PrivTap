import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";
import Permission from "../../model/Permission";
import {TriggerData} from "../../helper/dataDefinition";

export default class AccessPostRoute extends Route {
    constructor() {
        super("resources", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        console.log("resource server called");
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];
        const permissions = request.query.authDetails as {[id:string]:string}[];
        const authorization = await Authorization.findByToken(oauthToken);
        const actionDataFilter = request.query.filter; //TODO: Filter retrieved data with only what was requested by the action

        if (!authorization){
            console.log("couldn't find authorization");
            response.status(400).send();
            return;
        }
        const userId = authorization.userId;

        if (!await Permission.authorized(userId, permissions)){
            response.status(401).send();
            return;
        }

        const data = await Permission.retrieveData(userId, permissions);

        /*
        const authorization = await Authorization.findByToken(oauthToken);
        if(!authorization){
            response.status(401).send();
            return;
        }
         */

        //Format the received post data into the standard format
        const formattedData = new TriggerData([data.content, data.creationDate], ["post-text", "creation-date"], ["post-text"]); //TODO: Change with actionDataFiletr when the PrivTap FE supports adding data definition objects to triggers and actions
        response.status(200).send(formattedData);
    }
}