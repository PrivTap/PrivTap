import { config } from "dotenv";

// Read environment variables from a .env file if we are not in a testing environment
if (process.env.NODE_ENV != "testing")
    config();

/**
 * Interface containing all the possible environment variables needed by PrivTAP Backend.
 */
interface EnvVariables {
    // Port where the app server will run
    PORT: number,
    // Relative URL where all routes will start from, this MUST be a relative URL
    BASE_URL: string,
    // Flag representing if we are in a production environment
    PROD: boolean,
    // Flag representing if we are in a development environment
    DEV: boolean,
    // Absolute URL where the app server will be deployed in production
    DEPLOYMENT_URL: string,
    // The minimum level of messages to log
    LOG_LEVEL: "log"|"trace"|"debug"|"info"|"warn"|"error"|"fatal",
    // The database connection string for a MongoDB database
    DB_STRING: string,
    // The api key provided by privTap
    API_KEY: string,
    // Google OAuthClient client Id
    CLIENT_ID: string,
    // Google OAuthClient client secret
    CLIENT_SECRET:string,
    // Rounds of salting that will be applied to password hashes before storing them in the database
    SALT_ROUNDS: number
    // Secret key used to sign the JWT tokens
    JWT_SECRET: string,
    // Expiration time (in seconds) of the JWT tokens
    JWT_EXPIRE: number,
    // PrivTap's client Id
    PRIVTAP_CLIENT_ID: string,
    // PrivTap's client secret
    PRIVTAP_CLIENT_SECRET: string,
    //API KEY with openai
    AI_API_KEY: string,
}

// Default values for some of the env variables
const defaults = {
    PORT: 8002,
    BASE_URL: "/",
    DEPLOYMENT_URL: "https://osp_dummy.it",
    LOG_LEVEL: "info",
    SALT_ROUNDS: 8,
    JWT_SECRET: "this_is_an_insecure_secret",
    JWT_EXPIRE: 86400,
    AI_API_KEY: "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",
    PRIVTAP_CLIENT_ID: "clientId",
    PRIVTAP_CLIENT_SECRET: "clientSecret"
};

/**
 * Load the environment variables into a EnvVariables object.
 * @throws Error if variables are invalid or if a variable without a default is not set
 */
function loadEnvVariables(): EnvVariables {
    const res: {[name: string]: string|number|boolean} = {};

    // Check if the defaults should be overwritten
    for (const [name, value] of Object.entries(defaults)) {
        const envVariable = process.env[name];
        if (envVariable) {
            let newEnvVariable: string|number = envVariable;

            // If the default value for this variable is a number, try to convert the new value to a number
            if (typeof value == "number") {
                newEnvVariable = Number.parseInt(envVariable);
                if (Number.isNaN(newEnvVariable))
                    throw Error(`Environment variable ${name} is not a valid number`);
            }

            res[name] = newEnvVariable;
        }
        else
            res[name] = value;
    }

    // Check if we are in a production environment
    res.PROD = process.env.NODE_ENV == "production";

    // Check if we are in a development environment
    res.DEV = process.env.NODE_ENV == "development";

    // Check if the DB connection string is set, if not throw an error
    res.DB_STRING = process.env.DB_STRING || "";
    if (res.DB_STRING == "")
        throw Error("Database connection string environment variable is not set");
    res.API_KEY = process.env.API_KEY || "";
    if (res.API_KEY == "")
        throw Error("API key string environment variable is not set");

    res.CLIENT_ID = process.env.CLIENT_ID || "";

    res.CLIENT_SECRET = process.env.CLIENT_SECRET || "";

    return res as unknown as EnvVariables;
}

// Save the environment variables to an object and export it
const env: EnvVariables = loadEnvVariables();
export default env;