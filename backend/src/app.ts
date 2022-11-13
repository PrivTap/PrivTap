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
app.use(cors({ origin: '*'}));

if (process.env.NODE_ENV == "development") app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static("public"));
app.use(cookieParser());

// Connect to db cluster
connectDB(process.env.DB_STRING!).then(() => {
    //testNewUser("someUsername", "somePassword", "someEmail");
    //testNewAction("someData");
    //testNewService("someDescription", "someName", "someAuthServer", "someClientId", "someSecret");
});

// Register routes to our Express app
getFilesInDir(join(__dirname, "routes"))
    .map(filePath => filePath.slice(0,-3))  // Remove file extension
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