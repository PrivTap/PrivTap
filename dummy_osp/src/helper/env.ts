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
}

// Default values for some of the env variables
const defaults = {
    PORT: 8001,
    BASE_URL: "/",
    DEPLOYMENT_URL: "https://osp_dummy.it",
    LOG_LEVEL: "info"
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

    return res as unknown as EnvVariables;
}

// Save the environment variables to an object and export it
const env: EnvVariables = loadEnvVariables();
export default env;