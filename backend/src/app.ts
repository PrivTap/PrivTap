import express, {Express} from "express";
import {config} from "dotenv";
import {getFilesInDir} from "./helper/helper";
import {join} from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose, {ConnectOptions} from "mongoose";

class BackendApp {
    readonly DEPLOYMENT_DOMAIN = "privtap.it";

    readonly port: number;
    readonly baseURL: string;
    readonly dbString: string;

    readonly express: Express;

    constructor() {
        // Read environment variables from a .env file
        config();

        // Load environment variables defaults
        this.port = Number.parseInt(process.env.PORT || "3000");
        this.baseURL = process.env.BASE_URL || "/api/";
        this.dbString = process.env.DB_STRING || "";

        // Create and configure Express app
        this.express = this.createExpressApp();

        // Register routes defined in /routes
        this.registerRoutes();
    }

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

    private registerRoutes() {
        getFilesInDir(join(__dirname, "routes"))
            .map(filePath => filePath.slice(0, -3))  // Remove file extension
            .forEach(async filePath => {            // For each file, register the route to our express app
                // filePath = "." + filePath.replace("src", ""); // Remove '/src' from file path to avoid errors when this gets compiled
                const endpoint = (await import(filePath)).default;
                const filePathArray = filePath.split("/");
                const endpointName = filePathArray[filePathArray.length - 1];
                this.express.use(this.baseURL + endpointName, endpoint);
            });
    }

    async connectToDB(dbString: string) {
        await mongoose.connect(dbString, {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions);
    }

    async startApp() {
        await this.express.listen(this.port);
    }
}

const app = new BackendApp();

// If this is being run as a script, start the app server
// Else this is being imported for testing and the testing library will take care of managing the app server
if (require.main === module){
    app.connectToDB(app.dbString)
        .then(() => {
            app.startApp()
                .then(() => {
                    let protocol = "http";
                    let address = "localhost";
                    if (process.env.NODE_ENV == "production") {
                        protocol = "https";
                        address = app.DEPLOYMENT_DOMAIN;
                    }

                    console.log(`Server listening at: ${protocol}://${address}:${app.port}${app.baseURL}`);
                });
        });
}

// Export app for testing
export default app;