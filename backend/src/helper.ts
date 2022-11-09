import { readdirSync, statSync } from "fs";
import mongoose, {ConnectOptions} from "mongoose";

/**
 * Gets all files recursively from a directory.
 * @param dirPath the path of the directory
 * @param arrayOfFiles the array of already found files, as this is a recursive function
 * @return an array containing the name of all the files present in the directory and in all subdirectories
 */
export function getFilesInDir(dirPath:string, arrayOfFiles:string[]=[]) {
    const files = readdirSync(dirPath);

    files.forEach(function(file) {
        if (statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getFilesInDir(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(dirPath + "/" + file);
        }
    });

    return arrayOfFiles;
}

/**
 * Connects to MongoDB database using the mongoose library
 * @param uri: the uri specifying the db user credential cluster and db identifier
 */

export async function connectDB(uri: string){
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect(uri,
            { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
            () => {
                console.log("Correctly connected to MongoDB");
            }
        );
    } catch (e) {
        console.log("Error connecting to MongoDB");
    }
}

// The methods below will be deleted soon, are here just to test if the database interaction goes as planned
// Proper tests will be written soon

/*
export function testNewUser(username: string, password: string, email: string){
    const user = new User({
        username: username,
        password: password,
        email: email
    });
    try {
        user.save();
        console.log("User added");
    } catch (e) {
        console.log("Error inserting new user");
    }
}

export function testNewAction(data: string){
    const op = new Operation({
        description: "someDescription",
        name: "someOperationName",
        service: "someService",
        permission: "somePermission"
    });
    const action = new Action({
        data: data,
        operation: op
    });
    try {
        action.save();
        console.log("Action added");
    } catch (e) {
        console.log("Error inserting new action");
    }
}

export function testNewService(description: string, name: string, authServer: string, clientId: string, secret: string){
    const service = new Service({
        description: description,
        name: name,
        authServer: authServer,
        clientId: clientId,
        secret: secret
    });
    try {
        service.save();
        console.log("Service added");
    } catch (e) {
        console.log("Error inserting new service");
    }
}

 */