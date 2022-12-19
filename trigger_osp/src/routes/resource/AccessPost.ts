import Route from "../../Route";
import {Request, Response} from "express";

export default class AccessPostRoute extends Route {
    constructor() {
        super("resources/posts", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const oauthToken = request.headers.authorization as string;
        const requestedType = request.params.filter;
        const authorizationDetails = request.params.authorization_details;
        console.log(request.params);
        console.log(oauthToken)

        /*
        const authorization = await Authorization.findByToken(oauthToken);
        if(!authorization){
            response.status(401).send();
            return;
        }

         */

        console.log(authorizationDetails);
    }
}