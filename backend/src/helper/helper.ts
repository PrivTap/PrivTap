import {readdirSync, statSync} from "fs";
import mongoose, {ConnectOptions} from "mongoose";
import dotenv from "dotenv";


// Read environment variables from a ..env file
dotenv.config();

/**
 * Gets all files recursively from a directory.
 * @param dirPath the path of the directory
 * @param arrayOfFiles the array of already found files, as this is a recursive function
 * @return an array containing the name of all the files present in the directory and in all subdirectories
 */
export function getFilesInDir(dirPath: string, arrayOfFiles: string[] = []) {
    const files = readdirSync(dirPath);

    files.forEach(function (file) {
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

export async function connectDB(uri: string) {
    try {
        // Connect to the MongoDB cluster
        await mongoose.connect(uri,
            {useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions,
            () => {
                console.log("Correctly connected to MongoDB");
            }
        );
    } catch (e) {
        console.log("Error connecting to MongoDB");
    }
}
