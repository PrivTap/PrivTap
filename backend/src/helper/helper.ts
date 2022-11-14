import {readdirSync, statSync} from "fs";
import dotenv from "dotenv";
import express from "express";


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
 * Check if an url is valid or not through a regex
 */
export function checkURL(url: string) {
    return /^(http|https):\/\/[^ "]+$/.test(url);
}

/**
 *
 */
export function internalServerError(error: any, response: express.Response) {
    response.status(500);
    response.send("Internal Server Error: The server encountered the following error while creating the user.\n" + error);
}

