import {readdirSync, statSync} from "fs";
import express from "express";
import mongoose, {ConnectOptions} from "mongoose";
import jwt from "jsonwebtoken";
import User, {IUser} from "./model/User";
import dotenv from "dotenv";
import jwt_Decode from "jwt-decode";


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

/**
 * Checks if a jwt is valid and if it exists a user associated in the database.<p>
 * The jwt should be stored in the cookie with parameter "_jwt".<p>
 * If the check is successful then the user is put as an attribute of the request otherwise "request.user" is undefined and is returned to the form of a promise
 * @param request the HTTP request
 * @param response the HTTP response: when the server can't retrieve data from database it sends ERROR 500
 *
 */

export async function checkLogin(request: express.Request, response: express.Response): Promise<IUser | undefined> {
    console.log("cookie+ " + request.cookies);
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const cookieJWT = request.cookies._jwt;
        if (cookieJWT) {
            const decoded = jwt.verify(cookieJWT, secret);
            if (decoded) {
                const userDecoded = jwt_Decode<IUser>(cookieJWT);
                try {
                    const user = await User.findOne({
                        _id: userDecoded._id
                    }).exec();
                    if (user != null) {
                        request.user = user;
                        return user;
                    }
                } catch (error) {
                    console.log("Error in retrieving user from database");
                    response.status(500);
                    response.send({"error": error}
                    );
                    return undefined;
                }
            } else {
                console.log("Wrong format of the token");
                request.user = undefined;
                return undefined;
            }

        } else {
            console.log("Cookie with token not present");
            return;
        }
    } else
        return undefined;
}

/**
 Create a json web token encrypted using the secret in the env, then it will attach it to the http response
 @param user: the user of which you want to create the token
 @param response: the HTTP response needed to attach the cookie with the token

 */
export function createJwtToken(user: IUser, response: express.Response): string | undefined {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const token = jwt.sign(user._id, secret, {
            expiresIn: process.env.JWT_EXPIRE
        });
        response.cookie("_jwt", token);
        return token;
    } else return undefined;
}
