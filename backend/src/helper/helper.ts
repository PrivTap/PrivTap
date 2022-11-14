import {readdirSync, statSync} from "fs";
import express from "express";
import Response from "../model/Response";

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
 * Checks if an url is valid or not through a regex
 * @param url The URL to validate
 */
export function checkURL(url: string): boolean {
    return /^(http|https):\/\/[^ "]+$/.test(url);
}

/**
 * Sends to the client a response signalling a generic "501 Internal Server Error"
 * @param error The generic error that the server encountered while processing the request
 * @param response The Express response used to send the error to
 */
export function internalServerError(error: unknown, response: express.Response) {
    response.status(500);
    const responseContent = new Response();
    responseContent.status = false;
    responseContent.message = "Internal Server Error: " + (error instanceof Error ? error.message : "Generic error");
    response.send(responseContent);
}

/**
 * Sends to the client a response signalling "401 Unauthenticated"
 * @param response The Express response used to send the error to
 */
export function unauthenticatedUserError(response: express.Response) {
    const responseContent = new Response();

    response.status(401);
    responseContent.status = false;
    responseContent.message = "401: User not authenticated";
    response.send(responseContent);
}

