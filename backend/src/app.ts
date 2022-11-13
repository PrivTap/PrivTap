import express from "express";
import dotenv from "dotenv";
import {connectDB, getFilesInDir} from "./helper/helper";
import {join} from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";


// Read environment variables from a ..env file
dotenv.config();

// Get AppServer port from environment variables
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || "/";

// Create and configure Express app
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

// Connect to db cluster
connectDB(process.env.DB_STRING!).then(() => {
    //testNewUser("someUsername", "somePassword", "someEmail");
    //testNewAction("someData");
    //testNewService("someDescription", "someName", "someAuthServer", "someClientId", "someSecret");
});

// Register routes to our Express app
getFilesInDir(join(__dirname, "routes"))
    .map(filePath => filePath.slice(0, -3))  // Remove file extension
    .forEach(async filePath => {            // For each file, register the route to our express app
        // filePath = "." + filePath.replace("src", ""); // Remove '/src' from file path to avoid errors when this gets compiled
        const endpoint = (await import(filePath)).default;
        const filePathArray = filePath.split("/");
        const endpointName = filePathArray[filePathArray.length - 1];
        app.use(baseUrl + endpointName, endpoint);
    });

// Start the app server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});