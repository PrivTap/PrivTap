import {BaseClient, generators} from 'openid-client';
import { Issuer } from 'openid-client';
import env from "./env";

export default class OAuth {
    // Temporary solution just to check the flow: Has to be stored and resumed with state
    static code_verifier: string;

    static async buildClient(): Promise<BaseClient> {
        const googleIssuer = await Issuer.discover('https://accounts.google.com');
        const client = new googleIssuer.Client({
            client_id: env.CLIENT_ID,
            client_secret: env.CLIENT_SECRET,
            redirect_uris: ['http://127.0.0.1:8001/callback'],
            response_types: ['code'],
        });
        return client;
    }

    static async gerRedirectUrl(client: BaseClient): Promise<string> {
        const code_verifier = generators.codeVerifier();
        const code_challenge = generators.codeChallenge(code_verifier);
        OAuth.code_verifier = code_verifier;

        const redirectUrl = client.authorizationUrl({
            scope: 'openid email profile',
            code_challenge,
            code_challenge_method: 'S256',
            state: "testState",
        });
        return redirectUrl;
    }
}