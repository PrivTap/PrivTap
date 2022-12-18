import {BaseClient, generators, Issuer} from 'openid-client';
import env from "./env";
import State from "../model/State";
import logger from "./logger";

export default class OAuthClient {
    static async buildClient(): Promise<BaseClient> {
        const googleIssuer = await Issuer.discover('https://accounts.google.com');
        return new googleIssuer.Client({
            client_id: env.CLIENT_ID,
            client_secret: env.CLIENT_SECRET,
            // TODO: check url for deployment
            redirect_uris: ['http://127.0.0.1:8002/callback'],
            response_types: ['code'],
        });
    }

    static async gerRedirectUrl(client: BaseClient, stateValue: string): Promise<string> {
        const code_verifier = generators.codeVerifier();
        const code_challenge = generators.codeChallenge(code_verifier);

        const redirectUrl = client.authorizationUrl({
            scope: 'openid email profile',
            code_challenge,
            code_challenge_method: 'S256',
            state: stateValue,
        });

        try {
            await State.insert({stateValue, code_verifier})
        } catch (e){
            logger.error("Error inserting state.", e);
        }

        return redirectUrl;
    }
}