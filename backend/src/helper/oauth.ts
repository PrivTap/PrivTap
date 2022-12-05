import { AuthorizationCode, AuthorizationTokenConfig } from "simple-oauth2";
import { Response } from "express";
import Permission, { IPermission } from "../model/Permission";
import { badRequest } from "./http";
import Service from "../model/Service";

export default class OAuth {
    static async newAuthorizationUri(response: Response, serviceId: string, permissionIds: string[] | string, state: string): Promise<string | null>{
        const authorization_details = [];

        if(typeof permissionIds == "string")
            permissionIds = [permissionIds];

        for await (const permissionId of permissionIds){
            const permission = await Permission.findById(permissionId) as IPermission;
            if (!permission){
                badRequest(response);
                return null;
            }
            if (permission.serviceId != serviceId){
                badRequest(response, "This permission is not associated to the specified OSP");
                return null;
            }
            authorization_details.push(permission.authorization_details);
        }

        const client = await OAuth.buildClient(serviceId);

        if (!client){
            badRequest(response);
            return null;
        }

        let authorizationUri = client.authorizeURL({
            // This uri has to be front-end
            redirect_uri: "http://127.0.0.1:8000/api/service-authorization",
            // I don't think we actually need the scope field
            scope: "user",
            state: state
        });

        authorizationUri = OAuth.appendAuthDetails(authorizationUri, authorization_details);

        return authorizationUri;
    }


    private static splitURL(authURL: string): {tokenHost: string, authorizePath: string} {
        const splitURL = authURL.split(/^(.*\/\/[a-z.-]*)/);
        return { tokenHost: splitURL[1], authorizePath: splitURL[2] };
    }


    private static appendAuthDetails(authorizationUri: string, authorization_details: object): string{
        const authorizationUriStringify = JSON.stringify(authorization_details);
        console.log(authorizationUriStringify);
        return authorizationUri + "&" + encodeURI(authorizationUriStringify);
    }

    private static async buildClient(serviceId: string, ): Promise<AuthorizationCode | null>{
        const service = await Service.findById(serviceId);
        if (!service){
            console.log("service not found");
            return null;
        }
        const path = OAuth.splitURL(service.authServer);
        const config = {
            client: {
                id: service.clientId,
                secret: service.clientSecret
            },
            auth: {
                tokenHost: path.tokenHost,
                authorizePath: path.authorizePath,
                tokenPath: "/login/oauth/access_token"
            }
        };
        return new AuthorizationCode(config);
    }

    static async retrieveToken(serviceId: string, authConfig: AuthorizationTokenConfig): Promise<string | null>{
        const client = await OAuth.buildClient(serviceId);
        if (!client){
            return null;
        }
        try {
            const accessToken = await client.getToken(authConfig);
            return accessToken.token.access_token;
        } catch (e) {
            console.error("Access Token Error");
        }
        return null;
    }
}