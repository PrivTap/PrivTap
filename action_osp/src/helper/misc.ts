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