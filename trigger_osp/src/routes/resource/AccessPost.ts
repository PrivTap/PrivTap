import Route from "../../Route";
import {Request, Response} from "express";
import Authorization from "../../model/Authorization";
import Permission from "../../model/Permission";

export default class AccessPostRoute extends Route {
    constructor() {
        super("resources", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        console.log("resource server called");
        const bearer = request.headers.authorization as string;
        const oauthToken = bearer.split(" ")[1];
        const queryStr = request.query.authDetails as string;
        let query = {};
        try {
            query = JSON.parse(queryStr);
        } catch (error) {
            console.log(error);
        }
        const permissions: {[id:string]:string}[] = []
        const authorization = await Authorization.findByToken(oauthToken);
        const actionDataFilter = request.query.filter; //TODO: Filter retrieved data with only what was requested by the action

        if (!authorization){
            console.log("couldn't find authorization");
            response.status(400).send();
            return;
        }
        const userId = authorization.userId;

        Object.values(query).forEach(value => permissions.push(value as {[id:string]:string}));

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


        response.status(200).send(data);
    }
}