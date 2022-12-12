import Route from "../../Route";
import {Request, Response} from "express";
import Authentication from "../../helper/authentication";
import Permission, {IPermission} from "../../model/Permission";

export default class AuthorizeRoute extends Route {
    constructor() {
        super("authorize", true);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const clientId = request.query.client_id;
        const redirectUri = request.query.redirect_uri;
        const state = request.query.state;
        let authorization_details = request.query.authorization_details as string;

        if(!clientId || !redirectUri || !authorization_details) {
            console.log("Invalid params")
            response.status(400).send();
            return;
        }

        let authorization_details_json: IPermission[];

        try {
            // Don't ask me why...
            authorization_details_json = JSON.parse(JSON.parse(authorization_details)) as IPermission[];
        } catch (e){
            console.log("parse error")
            console.log(e);
            response.status(500).send();
            return;
        }

        try {
            Authentication.checkJWT(request);
            for (let i = 0; i < authorization_details_json.length; i++) {
                let permission = authorization_details_json[i];
                permission.userId = request.userId;
                console.log("request userId =", request.userId);
                console.log(authorization_details_json[i]);
                try{
                    if(!await Permission.insert(permission)){
                        response.status(500).send();
                        return;
                    }
                } catch (e) {
                    // The json doesn't confor to the IPermission schema
                    console.log("Wrong json format");
                    response.status(400);
                    return;
                }

            }
            // TODO:
            const formData = Permission.getAggregateData(request.userId);
            //response.render("oauth_form")
        } catch (e){
            console.log("Not authenticated?")
            console.log(e);
            // The user needs to authenticate and then will get redirected to the same endpoint
            // with the same query parameters
            const queryParams = ""
            response.redirect("/" + queryParams)
        }

    }

}