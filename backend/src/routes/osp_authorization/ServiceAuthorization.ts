import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";
import * as oauth from "../../helper/oauth";

export default class ServiceAuthorizationRoute extends Route {
    constructor() {
        super("service-authorization", false, false);
    }

    protected async httpGet(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const issuer = new URL("https://accounts.google.com");
        const authServerMetaData = await oauth
            .discoveryRequest(issuer, { algorithm: "oidc" });

        const redirect_uri = "http:/127.0.0.1:8000/service-authorization";
        const code_verifier = oauth.generateRandomCodeVerifier();
        const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier);
        const code_challenge_method = "S256";

        const client: oauth.Client = {
            client_id: "116309827086-k1i6vtu7r26f6a0pr0vp2nf005uen4b2.apps.googleusercontent.com",
            client_secret:
                "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",
            token_endpoint_auth_method: "client_secret_basic",
        };
        let discoveryResponse;

        if (authServerMetaData) {
            discoveryResponse = await oauth.processDiscoveryResponse(issuer, authServerMetaData);
        } else {
            console.log("error during the discovery process");
        }

        if (!discoveryResponse){
            return;
        }

        const authorizationUrl = new URL(discoveryResponse.authorization_endpoint!);
        authorizationUrl.searchParams.set("client_id", client.client_id);
        authorizationUrl.searchParams.set("code_challenge", code_challenge);
        authorizationUrl.searchParams.set("code_challenge_method", code_challenge_method);
        authorizationUrl.searchParams.set("redirect_uri", redirect_uri);
        authorizationUrl.searchParams.set("response_type", "code");
        authorizationUrl.searchParams.set("scope", "api:read");

        console.log(authorizationUrl);

        success(response, {}, "Not implemented");
    }

    protected async httpDelete(request: Request, response: Response): Promise<void> {
        success(response, {}, "Not implemented");
    }
}