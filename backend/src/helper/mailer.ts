import { createTransport, Transporter } from "nodemailer";

// SMTP server parameters
const emailHost = (process.env.EMAIL_HOST || "example.com:465").split(":");
const smtpServerAddress = emailHost[0];
const smtpServerPort = Number.parseInt(emailHost[1]);
const useSSL = smtpServerPort == 465;
const adminEmail = process.env.EMAIL_USER || "";
const adminPassword = process.env.EMAIL_PASSWORD || "";

// URL where users will get redirected to activate their account
// This is just the base URL, it will be needed to append the account activation token to it
const accountActivationBaseURL = (process.env.DEPLOYMENT_URL || "") + "/?activate=";

// Create the transport layer that will forward the emails to the SMTP server
let transporter: Transporter|undefined = undefined;
if (process.env.NODE_ENV == "production")
    transporter = createTransport(
        {
            host: smtpServerAddress,
            port: smtpServerPort,
            secure: useSSL,
            auth: {
                user: adminEmail,
                pass: adminPassword,
            },
        }
    );

/**
 * Sends the account activation email to a newly registered user.
 * @param userEmailAddress the email address of the user
 * @param activationToken the activation token that the user will need to activate its account
 */
export async function sendRegistrationEmail(userEmailAddress: string, activationToken: string) {
    if (transporter == undefined) {
        console.log(`Activation token for ${userEmailAddress}: ${activationToken}`);
        return;
    }

    const activationUrl = encodeURI(accountActivationBaseURL + activationToken);
    await transporter.sendMail({
        from: {
            name: "PrivTAP",
            address: adminEmail
        },
        to: userEmailAddress,
        subject: "PrivTAP - Activate your account",
        text: `
        Welcome to PrivTAP!\n
        We just need to validate your email address to activate your PrivTAP account. Simply click the following link: ${activationUrl}\n
        Welcome aboard!\n
        The PrivTAP Team`,
        html: `
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
    });
}