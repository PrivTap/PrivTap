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
    // Rounds of salting that will be applied to password hashes before storing them in the database
    SALT_ROUNDS: number,
    // Secret key used to sign the JWT tokens
    JWT_SECRET: string,
    // Expiration time (in seconds) of the JWT tokens
    JWT_EXPIRE: number,
    // Absolute URL where the app server will be deployed in production
    DEPLOYMENT_URL: string,
    // Absolute URL of the frontend, needed to configure CORS policy in development environment
    FRONTEND_URL: string,
    // The database connection string for a MongoDB database
    DB_STRING: string,
    // API key for the Mailjet service
    MAILJET_API_KEY: string,
    // Secret key for the Mailjet service
    MAILJET_SECRET_KEY: string,
    // Address that will send emails through the Mailjet service
    MAILJET_SENDER: string
}

// Default values for some of the env variables
const defaults = {
    PORT: 8000,
    BASE_URL: "/api/",
    SALT_ROUNDS: 1,
    JWT_SECRET: "this_is_an_insecure_secret",
    JWT_EXPIRE: 86400,
    DEPLOYMENT_URL: "https://privtap.it",
    FRONTEND_URL: "http://127.0.0.1:5173"
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
    res.PROD = process.env.NODE_ENV == "development";

    // Check if the DB connection string is set, if not throw an error
    res.DB_STRING = process.env.DB_STRING || "";
    if (res.DB_STRING == "")
        throw Error("Database connection string environment variable is not set");

    // Check if the credentials for Mailjet API are set.
    // If they are not, and we are in production, throw an error
    res.MAILJET_API_KEY = process.env.MAILJET_API_KEY || "";
    res.MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY || "";
    res.MAILJET_SENDER = process.env.MAILJET_SENDER || "";
    if (res.MAILJET_API_KEY == "" || res.MAILJET_SECRET_KEY == "" || res.MAILJET_SENDER == "")
        if (res.PROD)
            throw Error("Mailjet credentials environment variables are not set");

    // Force the cast of res to EnvVariables before returning it
    // as we know that it will not contain any different properties
    return res as unknown as EnvVariables;
}

// Save the environment variables to an object and export it
const env: EnvVariables = loadEnvVariables();
export default env;