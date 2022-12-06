import {AuthorizationCode, AuthorizationTokenConfig} from "simple-oauth2";
import {Response} from "express";
import Permission, {IPermission} from "../model/Permission";
import {badRequest} from "./http";
import Service from "../model/Service";
import env from "../helper/env";

export default class OAuth {
    static async newAuthorizationUri(response: Response, serviceId: string, permissionIds: string[] | string, state: string): Promise<string | null> {
        const authorization_details = [];

        if (typeof permissionIds == "string")
            permissionIds = [permissionIds];

        for await (const permissionId of permissionIds) {
            const permission = await Permission.findById(permissionId) as IPermission;
            if (!permission) {
                badRequest(response);
                return null;
            }
            if (permission.serviceId != serviceId) {
                badRequest(response, "This permission is not associated to the specified OSP");
                return null;
            }
            authorization_details.push(permission.authorization_details);
        }

        const client = await OAuth.buildClient(serviceId);

        if (!client) {
            badRequest(response);
            return null;
        }

        let redirectUri;
        if (env.PROD) {
            redirectUri = "https://privtap.it/modifyauth/" + serviceId;
        } else {
            redirectUri = "http://127.0.0.1:5173/modifyauth/" + serviceId;
        }

        let authorizationUri = client.authorizeURL({
            redirect_uri: redirectUri,
            state: state,
        });

        authorizationUri = OAuth.appendAuthDetails(authorizationUri, authorization_details);

        return authorizationUri;
    }


    private static splitURL(authURL: string): { tokenHost: string, authorizePath: string } {
        const splitURL = authURL.split(/^(.*\/\/[a-z.-]*)/);
        return {tokenHost: splitURL[1], authorizePath: splitURL[2]};
    }


    private static appendAuthDetails(authorizationUri: string, authorization_details: object): string {
        const authorizationUriStringify = JSON.stringify(authorization_details);
        console.log(authorizationUriStringify);
        return authorizationUri + "&" + encodeURI(authorizationUriStringify);
    }

    // TODO: Specify the token path in the Service model
    private static async buildClient(serviceId: string, tokenPath = "/login/oauth/access_token"): Promise<AuthorizationCode | null>{
        const service = await Service.findById(serviceId);
        if (!service) {
            return null;
        }
        const path = OAuth.splitURL(service.authServer);
        const config = {
            client: {
                id: service.clientId,
                secret: service.clientSecret,
            },
            auth: {
                tokenHost: path.tokenHost,
                authorizePath: path.authorizePath,
                // This is the resource server, has to be modified
                // TODO: Service needs a little refactor
                // This token path is a separate url which can differ from the auth path
                tokenPath: tokenPath
            }
        };
        return new AuthorizationCode(config);
    }

    static async retrieveToken(serviceId: string, authConfig: AuthorizationTokenConfig): Promise<string | null> {
        const client = await OAuth.buildClient(serviceId);
        if (!client) {
            return null;
        }
        try {
            const accessToken = await client.getToken(authConfig);
            return accessToken.token.access_token;
        } catch (e) {
            console.error("Access Token Error");
            console.log(e);
        }
        return null;
    }
}