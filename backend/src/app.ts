import express, {Express} from "express";
import {config} from "dotenv";
import {getFilesInDir} from "./helper/misc";
import {join} from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose, {ConnectOptions} from "mongoose";
import Route from "./Route";

// Expand the Express request definition to include the userId
declare global {
    namespace Express {
        interface Request {
            /**
             * The id of the user that sent this request.
             * Optionally set by PrivTAP authentication middleware if JWT cookie is provided and valid.  Can be used by other middleware.
             * [Declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) can be used to add your own properties.
             */
            userId?: string;
        }
    }
}

/**
 * Represents the PrivTAP backend application. Contains useful configuration data and exposes methods to connect
 * to the database and start the application server.
 */
class BackendApp {
    // Domain where this app will be deployed in production
    readonly deploymentURL: string;
    // Port where to start the application server on
    readonly port: number;
    // Base url where REST endpoints will be registered, relative to the address, default is '/api/'
    readonly baseURL: string;
    // Connection string for a MongoDB database instance
    readonly dbString: string;

    // Express application server
    readonly express: Express;

    /**
     * Creates a new BackendApp instance, initializing the configuration data and configuring the app server
     * with all the routes.
     */
    constructor() {
        // Read environment variables from a .env file
        config();

        // Load environment variables defaults
        this.deploymentURL = process.env.DEPLOYMENT_URL || "";
        this.port = Number.parseInt(process.env.PORT || "3000");
        this.baseURL = process.env.BASE_URL || "/api/";
        this.dbString = process.env.DB_STRING || "";

        // Create and configure Express app
        this.express = this.createExpressApp();

        // Register routes defined in /routes
        this.registerRoutes();
    }

    /**
     * Creates a new Express application server and configures all the needed extensions.
     * @private
     * @return the newly created application server
     */
    private createExpressApp() {
        const app = express();

        app.use(cors({origin: "*"}));
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        app.use(cookieParser());

        // Log all requests to console if we are in a development environment
        if (process.env.NODE_ENV == "development")
            app.use(logger("dev"));

        // Set up Express to serve static files from the path in the environment variable.
        // This is used to test backend and frontend locally: we can make Express serve the generated static files
        // of our frontend.
        if (process.env.EXPRESS_STATIC_FILES)
            app.use(express.static(process.env.EXPRESS_STATIC_FILES));

        return app;
    }

    /**
     * Registers all the routes defines in the 'routes/' directory to the Express app server.
     * @private
     */
    private registerRoutes() {
        getFilesInDir(join(__dirname, "routes"))
            .map(filePath => filePath.slice(0, -3))  // Remove file extension
            .forEach(async filePath => {            // For each file, register the route to our express app
                // filePath = "." + filePath.replace("src", ""); // Remove '/src' from file path to avoid errors when this gets compiled
                const routeClass = (await import(filePath)).default as typeof Route;
                const routeInstance = new routeClass();
                console.log(routeInstance.endpointName, routeInstance.requiresAuth);

                this.express.use(this.baseURL + routeInstance.endpointName, routeInstance.router);
            });
    }

    /**
     * Connects to a MongoDB database instance.
     * @param dbString the connection string to use
     */
    async connectToDB(dbString: string) {
        await mongoose.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions);
    }

    /**
     * Starts the Express application server on the configured port.
     */
    async startApp() {
        await this.express.listen(this.port);
    }
}

// Create a new instance of our backend application
const app = new BackendApp();

// If this is being run as a script, connect to the db and start the application server.
// Otherwise, this is being imported for testing and the testing library will take care of the setup
if (require.main === module){
    // Connect to the database
    app.connectToDB(app.dbString)
        .then(() => {
            // Once connected to the database, start the application server
            app.startApp()
                .then(() => {
                    // Print to console the URL of the application server
                    let url = `http://localhost:${app.port}`;
                    if (process.env.NODE_ENV == "production") {
                        url = app.deploymentURL;
                    }

                    console.log(`Server listening at: ${url}${app.baseURL}`);
                });
        });
}

// Export app for testing
export default app;