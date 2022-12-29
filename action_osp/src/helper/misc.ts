import {readdirSync, statSync} from "fs";
import Permission, {IPermission} from "../model/Permission";
import logger from "./logger";
import Authorization from "../model/Authorization";
import axios, {AxiosResponse} from "axios";

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

export function parsePermissions(data: string): IPermission[] | null{
    try {
        // Don't ask me why...
        return JSON.parse(data) as IPermission[];
    } catch (e){
        logger.error("parse error", e)
        return null;
    }
}

export function appendUserId(permissions: IPermission[], userId: string): boolean{
    for (let i = 0; i < permissions.length; i++) {
        let permission = permissions[i];
        permission.userId = userId;
        if (!Permission.checkSchema(permission)){
            // The JSON was did not conform to the Permission schema
            logger.error("Invalid JSON format");
            return false;
        }
    }
    return true;
}

export async function rollBackAuthorization(userId: string): Promise<boolean>{
    if (!await Permission.deleteUnauthorizedPermissions(userId)){
        return false
    }
    return await Authorization.delete(userId);

}

/**
 * Make a post http request to a specific url
 * @param url the url of the request
 * @param token use this if you want to put an auth token
 * @param body the object containing the field and the value of the query string
 */
export async function postReqHttp(url: string, token: string | null, body: object): Promise<AxiosResponse | null> {
    const config = token ? { headers: { "Authorization": token } } : undefined;
    let res;
    try {
        res = await axios.post(url, body, config);
        return res;
    } catch (e) {
        logger.error("Axios response status:", res ? res.status : "undefined");
        return null;
    }
}