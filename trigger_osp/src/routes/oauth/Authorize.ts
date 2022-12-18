import Route from "../../Route";
import {Request, Response} from "express";
import Permission from "../../model/Permission";
import OAuthServer from "../../helper/OAuthServer";
import Authorization from "../../model/Authorization";
import {appendUserId, parsePermissions, rollBackAuthorization} from "../../helper/misc";

export default class AuthorizeRoute extends Route {
    constructor() {
        super("authorize", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const clientId = request.query.client_id;
        const redirectUri = request.query.redirect_uri;
        const state = request.query.state;
        const userId = request.userId;
        let authorization_details = request.query.authorization_details as string;

        if(!clientId || !redirectUri || !authorization_details) {
            console.log("Invalid params")
            response.status(400).send();
            return;
        }

        // Parses input
        let permissions = parsePermissions(authorization_details);
        if (!permissions){
            response.status(500).send();
            return;
        }

        // Append userId to the permission object
        if (!appendUserId(permissions, userId)){
            // Provided permissions don't conform to the defined schema
            response.status(400).send();
            return;
        }

        const permissionIds = await Permission.insertAll(permissions);

        if (!permissionIds){
            response.status(500).send();
            return;
        }

        // Get aggregate data
        const aggregateData = Permission.getAggregateData(permissions);
        // Create authorization
        if (! await Authorization.insert({ userId, permissionIds }))
        response.render("oauth_form", { fieldData: aggregateData, state, redirectUri});
    }

    // Button callback
    protected async httpPost(request: Request, response: Response): Promise<void> {
        const userId = request.userId;
        const status = request.body.status;
        const state = request.body.state;
        let redirectUri = request.body.redirectUri;
        if (status != "accept"){
            if (!await rollBackAuthorization(userId)){
                console.log("rollback error");
                response.status(500).send();
                return;
            }
            // redirect
            console.log("not accepted");
            response.status(200).send("Not accepted");
            return;
        }
        const permissionIds = await Permission.authorizePermissions(userId);
        if (!permissionIds){
            console.log("no permissionIds");
            response.status(500).send();
            return;
        }
        // create code
        const code = await OAuthServer.generateCode(userId);
        if (!code){
            response.status(500).send();
            return;
        }
        redirectUri = redirectUri + "/?&code=" + encodeURIComponent(code) + "&state=" + encodeURIComponent(state);
        console.log(redirectUri);
        response.status(302).send({ redirectUri });
    }

}