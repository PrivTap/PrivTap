import env from "./env";
import Mailjet from "node-mailjet";
import logger from "./logger";

// URL where users will get redirected to activate their account
// This is just the base URL, it will be needed to append the account activation token to it
const accountActivationBaseURL = env.DEPLOYMENT_URL + "/?activate=";

let mailer: Mailjet | undefined = undefined;
// If we are in production, initialize the Mailjet REST client
if (env.PROD) {
    mailer = new Mailjet({ apiKey: env.MAILJET_API_KEY, apiSecret: env.MAILJET_SECRET_KEY });
}

/**
 * Sends the account activation email to a newly registered user.
 * @param username the username of the user
 * @param userEmailAddress the email address of the user
 * @param activationToken the activation token that the user will need to activate its account
 */
export async function sendRegistrationEmail(username: string, userEmailAddress: string, activationToken: string) {
    // If we are not in production, mailer will be undefined, and we can just print the token to console
    if (mailer == undefined) {
        logger.log(`Activate ${userEmailAddress} account at: ${env.FRONTEND_URL}/?activate=${activationToken}`);
        return;
    }

    // Build the full activation URL and make sure that all special characters are properly URL-encoded
    const activationUrl = encodeURI(accountActivationBaseURL + activationToken);

    // Send the email
    await mailer
        .post("send", { "version": "v3.1" })
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": env.MAILJET_SENDER,
                        "Name": "PrivTAP"
                    },
                    "To": [
                        {
                            "Email": userEmailAddress,
                            "Name": username
                        }
                    ],
                    "Subject": "PrivTAP - Activate your account",
                    "TextPart": `
                        Welcome to PrivTAP!\n
                        We just need to validate your email address to activate your PrivTAP account. Simply click the following link: ${activationUrl}\n
                        Welcome aboard!\n
                        The PrivTAP Team`,
                    "HTMLPart": `
                        <div>
                            <div style="background-color: rgb(245,245,245); color: rgb(140, 140, 140); font-family: Roboto, Helvetica, Arial, sans-serif, serif;">
                                <div style="padding: 80px 0; text-align: center; line-height: 22px; font-size: 14px;">
                                    <div style="margin:0 auto; max-width:600px; background:#FFFFFF; border-top: 3px solid #6F67D9; padding: 10px;">
                                        <p style="color: rgb(85, 87, 93); font-size: 22px; font-weight: 700;"><b>Welcome to PrivTAP!</b></p>
                                        <p>We just need to validate your email address to activate your PrivTAP account. Simply click the following button:</p>
                                        <a href="${activationUrl}" target="_blank" style="display: inline-block; padding: 10px; margin: 20px 0; text-decoration: none; background: #195a6a; color: #fff;">Activate my account</a>
                                        <p>If the button doesn't work copy and paste this URL into your browser: <br> <a href="${activationUrl}" target="_blank">${activationUrl}</a></p>
                                        <p>Welcome aboard! <br> The PrivTAP Team</p>
                                    </div>
                                    <div style="margin:0 auto; max-width:600px; font-size: 12px">
                                        <p>This email was sent to you by PrivTAP because you signed up for a PrivTAP account. Please let us know if you feel that this email was sent to you by error.</p>
                                        <p>&copy; 2022 PrivTAP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                }
            ]
        });
}