import Route from "../../Route";
import {Request, Response} from "express";
import Permission from "../../model/Permission";
import OAuthServer from "../../helper/OAuthServer";
import Authorization from "../../model/Authorization";
import {appendUserId, parsePermissions, rollBackAuthorization} from "../../helper/misc";
import Authentication from "../../helper/authentication";
import logger from "../../helper/logger";

export default class AuthorizeRoute extends Route {
    constructor() {
        super("authorize", false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const clientId = request.query.client_id;
        const redirectUri = request.query.redirect_uri;
        const state = request.query.state;
        let authorization_details = request.query.authorization_details as string;
        let userId;
        try {
            userId = Authentication.checkJWT(request).userId;
            request.userId = userId;
        } catch (e) {
            response.render("oauth_login", {
                url: "/google-auth?oAuthAuthorization=" + encodeURI(JSON.stringify({
                    clientId,
                    redirectUri,
                    state,
                    authorization_details
                }))
            });
            return;
        }
        if (!clientId || !redirectUri || !authorization_details) {
            logger.debug("Invalid params")
            response.status(400).send();
            return;
        }
        logger.debug(authorization_details);
        // Parses input
        let permissions = parsePermissions(authorization_details);
        if (!permissions) {
            response.status(500).send();
            return;
        }

        // Append userId to the permission object
        if (!appendUserId(permissions, userId)) {
            // Provided permissions don't conform to the defined schema
            response.status(400).send();
            return;
        }

        const permissionIds = await Permission.insertAll(permissions);

        if (!permissionIds) {
            response.status(500).send();
            return;
        }

        // Get aggregate data
        const aggregateData = Permission.getAggregateData(permissions);
        // Create authorization
        // Should work, check if a new authorization with only userId and permissions exists
        logger.debug("permissionIds:", permissionIds);
        const auth = await Authorization.update({userId, permissionIds}, {userId}, true)
        if (auth != null)
            response.render("oauth_form", {fieldData: aggregateData, state, redirectUri});
        else
            response.status(500).send();
        return;
    }


    // Button callback
    protected async httpPost(request: Request, response: Response): Promise<void> {
        let userId;

        try {
            userId = Authentication.checkJWT(request).userId;
            request.userId = userId;
        } catch (e) {
            response.status(401).send();
            return;
        }
        const status = request.body.status;
        const state = request.body.state;
        let redirectUri = request.body.redirectUri;
        if (status != "accept") {
            if (!await rollBackAuthorization(userId)) {
                logger.debug("rollback error");
                response.status(500).send();
                return;
            }
            // redirect
            logger.debug("not accepted");
            response.status(200).send("Not accepted");
            return;
        }
        const permissionIds = await Permission.authorizePermissions(userId);
        if (!permissionIds) {
            logger.debug("no permissionIds");
            response.status(500).send();
            return;
        }
        // create code
        const code = await OAuthServer.generateCode(userId);
        if (!code) {
            response.status(500).send();
            return;
        }
        redirectUri = redirectUri + "?&code=" + encodeURIComponent(code) + "&state=" + encodeURIComponent(state);
        logger.debug(redirectUri);
        response.status(302).send({redirectUri});
    }
}