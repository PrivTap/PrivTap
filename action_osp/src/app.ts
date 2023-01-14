import express, {Express} from "express";
import cookieParser from "cookie-parser";
import Route from "./Route";
import {getFilesInDir} from "./helper/misc";
import {join} from "path";
import logger from "./helper/logger";
import env from "./helper/env";
import {connect, ConnectOptions} from "mongoose";
import bodyParser from "body-parser";
import multer from "multer";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}


/**
 * Represents the Dummy Action application. Contains useful configuration data and exposes methods to connect
 * to the database and start the application server.
 */
class OSP {
    // Domain where this app will be deployed in production
    readonly deploymentURL: string;
    // Port where to start the application server on
    readonly port: number;
    // Base url where REST endpoints will be registered, relative to the address, default is '/'
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
        // Load environment variables defaults
        this.deploymentURL = env.DEPLOYMENT_URL;
        this.port = env.PORT;
        this.baseURL = env.BASE_URL;
        this.dbString = env.DB_STRING;

        // Create and configure Express app
        this.express = this.createExpressApp();

        // Register routes defined in /routes
        this.registerAllRoutes();
    }

    /**
     * Creates a new Express application server and configures all the needed extensions.
     * @private
     * @return the newly created application server
     */
    protected createExpressApp() {
        const app = express();
        app.use(bodyParser.json());
        app.use(express.urlencoded({extended: false}));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use('/public', express.static('./public'));
        app.enable('trust proxy');
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'uploads')
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '-' + Date.now())
            }
        });

        return app;
    }

    /**
     * Registers a new route from a TypeScript file. The file should export as default a class declaration
     * that extends Route.
     * @param filePath the path from where to import the route class
     * @protected
     */
    protected async registerRoute(filePath: string) {
        const routeClass = (await import(filePath)).default as typeof Route;
        const routeInstance = new routeClass();
        this.express.use(
            this.baseURL + routeInstance.endpointName,
            routeInstance.router
        );
    }

    /**
     * Registers all the routes defines in the 'routes/' directory to the Express app server.
     * @private
     */
    protected registerAllRoutes() {
        const routeFiles = getFilesInDir(join(__dirname, "routes")).map(
            (filePath) => filePath.slice(0, -3)
        ); // Remove file extension
        for (const filePath of routeFiles) {
            this.registerRoute(filePath).then();
        }
    }

    /**
     * Connects to a MongoDB database instance.
     * @param dbString the connection string to use
     */
    async connectToDB(dbString: string) {
        await connect(dbString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
    }

    /**
     * Starts the Express application server on the configured port.
     */
    async startApp() {
        await this.express.listen(this.port);
    }
}

// Create a new instance of our backend application
const app = new OSP();

if (require.main === module) {
    // Connect to the database
    app.connectToDB(app.dbString).then(() => {
        // Once connected to the database, start the application server
        app.startApp().then(() => {
            // Print to console the URL of the application server
            let url = `http://127.0.0.1:${app.port}`;
            if (env.PROD) {
                url = app.deploymentURL;
            }
            logger.info(`Server listening at: ${url}${app.baseURL}`);
        });
    });
}

// Export app for testing
export default app;
