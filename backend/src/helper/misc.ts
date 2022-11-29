import { readdirSync, statSync } from "fs";
import Model, { ModelSaveError } from "../Model";
import { badRequest, internalServerError } from "./http";
import { Response } from "express";
import axios, {AxiosResponse } from "axios";


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
 * Checks if an url is valid or not through a regex.
 * @param url The URL to validate
 */
export function checkURL(url: string): boolean {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}

/**
 * Recursively replaces all resource URLs with new URLs corresponding to DB items
 * @param object The object where URLs need to be replaced
 */
export function replaceResourceURLs<K extends string>(object: Record<K, unknown>) {
    for (const key in object) {
        if ((typeof object[key]) === "object" && object[key] != null && object[key] != undefined) {
            replaceResourceURLs(object[key] as Record<K, unknown>);
        } else {
            if ((typeof object[key]) == "string" && checkURL(object[key] as string)) {
                object[key] = "INSERT_NEW_URL_HERE";
            }
        }
    }
}

/**
 * Handles an insertion from a route to a model. If an error occurs send back the associated response to the client.
 * @param response the response object to send back the response to the client
 * @param model the model to insert to
 * @param document the document to insert
 * @return id of the object that has been created
 */
export async function handleInsert<T>(response: Response, model: Model<T>, document: object): Promise<string | null> {
    try {
        const isInserted = await model.insert(document);
        if (!isInserted) {
            internalServerError(response);
            return null;
        } else {
            return isInserted;
        }
    } catch (e) {
        if (e instanceof ModelSaveError) {
            badRequest(response, e.message);
        } else {
            internalServerError(response);
        }
        return null;
    }
}

/**
 * Handles an update from a route to a model. If an error occurs send back the associated response to the client.
 * @param response the response object to send back the response to the client
 * @param model the model to insert to
 * @param filter the filter to find the document to update
 * @param update the document containing the updates
 */
export async function handleUpdate<T>(response: Response, model: Model<T>, filter: object, update: object) {
    try {
        const isModified = await model.updateWithFilter(filter, update);
        if (!isModified) {
            badRequest(response, "A service with this id does not exist");
            return false;
        }
    } catch (e) {
        if (e instanceof ModelSaveError) {
            badRequest(response, e.message);
        } else {
            internalServerError(response);
            return false;
        }
    }
    return true;
}


/**
 * Make a get http request to a specific url
 * @param url the url of the request
 * @param token use this if you want to put an auth token
 * @param queryString the object containing the field and the value of the query string
 */
export async function getHttp(url: string, token?: string, queryString?: object): Promise<AxiosResponse> {
    const config = {};
    if (token != undefined)
        Object.assign(config, { headers: { "Authorization": `Bearer ${token}` } });
    if (queryString != undefined)
        Object.assign(config, { params: queryString });
    return await axios.get(url, config);
}

/**
 * Make a delete http request to a specific url
 * @param url the url of the request
 * @param token use this if you want to put an auth token
 * @param body the object containing the field and the value of the query string
 */
export async function deleteHttp(url: string, token?: string, body?: object): Promise<AxiosResponse> {
    const config = {};
    if (token != undefined)
        Object.assign(config, { headers: { "Authorization": `Bearer ${token}` } });
    if (body != undefined)
        Object.assign(config, { data: body });
    return await axios.delete(url, config);
}