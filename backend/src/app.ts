import express from "express";
import dotenv from "dotenv";
import {connectDB, getFilesInDir} from "./helper";
import logger from "morgan";

// Read environment variables from a .env file
dotenv.config();

// Get AppServer port from environment variables
const port = process.env.PORT || 3000;

// Create and configure Express app
const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Connect to db cluster
const dbUri = "mongodb+srv://testUsername:testPassword@testcluster.r0idyk9.mongodb.net/testDB?retryWrites=true&w=majority";
connectDB(dbUri).then(() => {
    //testNewUser("someUsername", "somePassword", "someEmail");
    //testNewAction("someData");
    //testNewService("someDescription", "someName", "someAuthServer", "someClientId", "someSecret");
});

// Register routes to our Express app
getFilesInDir("src/routes")
    .map(filePath => filePath.slice(0,-3))  // Remove file extension
    .forEach(async filePath => {            // For each file, register the route to our express app
        filePath = "." + filePath.replace("src", ""); // Remove '/src' from file path to avoid errors when this gets compiled
        const endpoint = (await import(filePath)).default;
        const filePathArray = filePath.split("/");
        const endpointName = filePathArray[filePathArray.length - 1];
        app.use("/" + endpointName, endpoint);
    });

// Start the app server
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});