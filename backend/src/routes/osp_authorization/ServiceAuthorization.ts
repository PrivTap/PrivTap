import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import { AuthorizationCode, AuthorizationTokenConfig, ModuleOptions } from "simple-oauth2";
import env from "../../helper/env";

export default class ServiceAuthorizationRoute extends Route {
    static config: ModuleOptions;
    static client: AuthorizationCode;

    constructor() {
        super("service-authorization", false, false);
        ServiceAuthorizationRoute.config = {
            client: {
                id: env.CLIENT_ID,
                secret: env.CLIENT_SECRET
            },
            auth: {
                tokenHost: "https://github.com",
                tokenPath: "/login/oauth/access_token",
                authorizePath: "/login/oauth/authorize",
            }
        };
        ServiceAuthorizationRoute.client = new AuthorizationCode(ServiceAuthorizationRoute.config);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        const { code } = request.query;
        const options = {
            code,
        };
        console.log(code);

        console.log(options);
        try {
            const accessToken = await ServiceAuthorizationRoute.client.getToken(options as AuthorizationTokenConfig);
            console.log("The resulting token: ", accessToken.token);
        } catch (e) {
            console.error("Access Token Error");
        }

        success(response, {}, "Not implemented");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const authorizationUri = ServiceAuthorizationRoute.client.authorizeURL({
            redirect_uri: "http://127.0.0.1:8000/api/service-authorization",
            scope: "user",
        });

        console.log(authorizationUri);

        success(response, { "redirectUri": authorizationUri });
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}