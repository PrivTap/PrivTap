import { readdirSync, statSync } from "fs";
import Model, { ModelSaveError } from "../Model";
import { badRequest, internalServerError } from "./http";
import { Response } from "express";
import axios, { AxiosResponse } from "axios";
import logger from "./logger";
import mongoose from "mongoose";
import { IAction } from "../model/Action";
import { ITrigger } from "../model/Trigger";
import Authorization from "../model/Authorization";


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
 * @param returnObject flag used to specify if the whole object has to be returned
 * @return id of the object that has been created or the whole object if specified
 */
export async function handleInsert<T>(response: Response, model: Model<T>, document: object, returnObject = false): Promise<string | null | T> {
    try {
        let insertResult;
        if (returnObject)
            // The whole object
            insertResult = await model.insertAndReturn(document);
        else
            // Just the _id
            insertResult = await model.insert(document);
        if (!insertResult) {
            internalServerError(response);
            return null;
        }
        if (returnObject)
            return insertResult as T;
        return insertResult;
    } catch (e) {
        logger.debug(e);
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
 * @param returnObject flag used to specify if the whole object has to be returned
 * @param update the document containing the updates
 * @param upsert if you want also to insert the document if it doesn't exist in the database. Default false
 */
export async function handleUpdate<T>(response: Response, model: Model<T>, filter: object, update: object, returnObject = false, upsert = false): Promise<boolean | T> {
    try {
        let updateResult;
        if (returnObject)
            // The whole object
            updateResult = await model.updateWithFilterAndReturn(filter, update, upsert);
        else
            updateResult = await model.updateWithFilter(filter, update, upsert);
        if (!updateResult) {
            badRequest(response, "An object with this id does not exist");
            return false;
        }
        if (returnObject)
            return updateResult as T;
        return updateResult;
    } catch (e) {
        logger.debug(e);
        if (e instanceof ModelSaveError) {
            badRequest(response, e.message);
        } else {
            internalServerError(response);
            return false;
        }
    }
    return false;
}

/**
 * Make a get http request to a specific url
 * @param url the url of the request
 * @param token use this if you want to put an auth token
 * @param parameters
 */
export async function getReqHttp(url: string, token: string | null, parameters: object): Promise<AxiosResponse | null> {
    const config = token ? {
        headers: { "Authorization": `Bearer ${token}` },
        params: parameters
    } : { params: parameters };
    let res;
    try {
        res = await axios.get(url, config);
        return res;
    } catch (e) {
        logger.error("Axios response status:", res != undefined ? res.status : "undefined");
        return null;
    }
}

/**
 * Make a post http request to a specific url
 * @param url the url of the request
 * @param token use this if you want to put an auth token
 * @param body the object containing the field and the value of the query string
 */
export async function postReqHttp(url: string, token: string | null, body: object): Promise<AxiosResponse | null> {
    const config = token ? { headers: { "Authorization": `Bearer ${token}` } } : undefined;
    let res;
    try {
        res = await axios.post(url, body, config);
        return res;
    } catch (e) {
        logger.error("Axios response status:", res != undefined ? res.status : "undefined");
        return null;
    }
}

/**
 * Make a delete http request to a specific url
 * @param url the url of the request
 * @param token use this if you want to put an auth token
 * @param query the object containing the field and the value of the query string
 */
export async function deleteReqHttp(url: string, token: string, query: object): Promise<AxiosResponse | null> {
    let res;
    try {
        const config = { headers: { "Authorization": `Bearer ${token}` }, params: query };
        // TODO: manage body
        res = await axios.delete(url, config);
        return res;
    } catch (e) {
        logger.error("Axios response status:", res != undefined ? res.status : "undefined");
        return null;
    }
}

export async function findAllOperationAddingAuthorizedTag(model: mongoose.Model<IAction> | mongoose.Model<ITrigger>, userId: string, serviceId: string): Promise<Partial<IAction | ITrigger>[] | null> {
    let grantedPermissionId = await Authorization.getGrantedPermissionsId(userId, serviceId);
    if (grantedPermissionId == null)
        grantedPermissionId = [];
    try {
        return await model.aggregate([
            { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
            {
                $addFields: {
                    authorized: {
                        $cond: {
                            if: {
                                $setIsSubset: ["$permissions", grantedPermissionId]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            { $project: { "data": 0, "outputs": 0 } },
            { $lookup: { from: "permissions", localField: "permissions", foreignField: "_id", as: "permissions" } },
            {
                $project: {
                    "permissions._id": 1,
                    "permissions.name": 1,
                    "permissions.description": 1,
                    "authorized": 1,
                    _id: 1,
                    name: 1,
                    description: 1
                }
            }
        ]) as Partial<IAction | ITrigger>[];
    } catch (e) {
        return null;

    }
}

export function checkActionDataFormat(actionRequiredIDs: string[], triggerDataIDs: string[]): boolean {
    return actionRequiredIDs.filter((actionID) => !triggerDataIDs.find((triggerID) => actionID == triggerID)).length > 0;
}