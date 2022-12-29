import {readdirSync, statSync} from "fs";
import Permission, {IPermission} from "../model/Permission";
import logger from "./logger";
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

export function parsePermissions(data: string): IPermission[] | null{
    try {
        // Don't ask me why...
        if (typeof JSON.parse(data) == "string"){
            return JSON.parse(JSON.parse(data)) as IPermission[];
        }
        return JSON.parse(data) as IPermission[];
    } catch (e){
        logger.error("parse error: provided data", data);
        logger.error("error:", e);
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
 * Checks if an url is valid or not through a regex.
 * @param url The URL to validate
 */
export function checkURL(url: string): boolean {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
}
