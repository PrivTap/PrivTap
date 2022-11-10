import express from "express";
import User, {IUser} from "../model/User";
import jwt from "jsonwebtoken";
import {Types} from "mongoose";

/**
 * Given a request and an HTTP response check if the user who did the request is logged.<br>
 * Example of code for using this <br>
 * <pre>
 * checkLogin(request, response).then(function (user) {
 *      response.status(200);
 *      response.send(user.toJSON());})<pre>
 * @return If it's logged then return a promise with the user inside otherwise it fails. Also, the user is inserted inside the request as an attribute
 * @param request Http request
 * @param response Http response
 */
export async function checkLogin(request: express.Request, response: express.Response): Promise<IUser> {
    return checkJWTToken(request).then((user) => {
        return user;
    }, (reason) => {
        response.status(401);
        response.send(reason);
        return Promise.reject();
    });
}


/**
 * Given a request check if the jwt stored in its cookies is valid. Then proceed to check on the database if exist a user associated with the corresponding token.
 * @return If it's logged then return a promise with the user inside otherwise it fails.Also, the user is inserted inside the request as an attribute
 * @param request the HTTP request
 */

async function checkJWTToken(request: express.Request): Promise<IUser> {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const cookieJWT: string | undefined = request.cookies._jwt;
        if (cookieJWT !== undefined) {
            const decoded = jwt.verify(cookieJWT, secret);
            if (decoded) {
                try {
                    const user_id = (<any>decoded).user_id;
                    console.log(user_id);
                    const user = await User.findById(user_id).exec();
                    if (user != null) {
                        request.user = user;
                        return user;
                    } else {
                        return Promise.reject("User not found in database");
                    }
                } catch (error) {
                    console.error(error);
                    if (error instanceof Error) {
                        return Promise.reject(error.message);
                    } else
                        return Promise.reject("Generic error");
                }
            } else {
                console.log("Wrong format of the token");
                return Promise.reject("Wrong format of the token");
            }

        } else {
            console.log("Token inside cookie not present");
            return Promise.reject("Token inside cookie not present");
        }
    } else
        return Promise.reject("Could not retrieve env variable");
}

/**
 Create a json web token encrypted using the secret in the env, then it will attach it to the cookie of the http response
 @param user: the user of which you want to create the token
 @param response: the HTTP response needed to attach the cookie with the token

 */
export function createJwtToken(user: IUser & { _id: Types.ObjectId }, response: express.Response): string | undefined {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const token = jwt.sign({"user_id": user._id}, secret, {
            expiresIn: process.env.JWT_EXPIRE
        });
        response.cookie("_jwt", token);
        return token;
    } else return undefined;
}