import express from "express";
import User, {IUser} from "../model/documents/User";
import jwt from "jsonwebtoken";

/**
 * Given a request and an HTTP response check if the user who did the request is logged.<br>
 * Example of code for using this <br>
 * <code>
 * checkLogin(request, response).then(function (user) {
 *      response.status(200);
 *      response.send(user.toJSON());})<pre>
 * </code>
 * The promise rejection must be caught with a rejection handler
 * @return If it's logged then return a promise with the user inside otherwise it fails. Also, the user is inserted inside the request as an attribute
 * @param request Http request
 * @param response Http response
 */
export async function checkLogin_promise(request: express.Request, response: express.Response): Promise<IUser> {
    return checkJWT(request).then((user) => {
        return user;
    }, (reason) => {
        response.status(401);
        response.send(reason);
        return Promise.reject(reason);
    });
}

/**
 * Asynchronously checks that the user is logged in
 *
 * If the user is logged in, then the lambda passed as successHandler will be executed, otherwise the method internally handles any errors and the rejection of the user with HTTP status codes.
 * @param request The HTTP request coming from the user
 * @param response The HTTP response
 * @param successHandler The callback executed when the user is logged in
 */
export function checkLogin(request: express.Request, response: express.Response, successHandler: (user: IUser) => void) {
    checkJWT(request).then((user) => {
        successHandler(user);
    }, (reason) => {
        response.status(401);
        response.send(reason);
    });
}


/**
 * Given a request check if the jwt stored in its cookies is valid. Then proceed to check on the database if exist a user associated with the corresponding token.
 * @return If it's logged then return a promise with the user inside otherwise it fails.Also, the user is inserted inside the request as an attribute
 * @param request the HTTP request
 */

async function checkJWT(request: express.Request): Promise<IUser> {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        const cookieJWT: string | undefined = request.cookies._jwt;
        if (cookieJWT !== undefined) {
            const decoded = jwt.verify(cookieJWT, secret);
            if (decoded) {
                try {
                    // TODO: Create token interface (?)
                    const user_id = (<any>decoded).user_id;
                    console.log(user_id);
                    const user = await User.findById(user_id);
                    if (user != null) {
                        // request.user = user;
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
 Create a json web token encrypted using the secret in the env
 @param user: the user of which you want to create the token
 */
export function createJWT(user: IUser): string | undefined {
    const secret = process.env.JWT_SECRET;
    if (secret) {
        return jwt.sign({"user_id": user._id}, secret, {
            expiresIn: process.env.JWT_EXPIRE
        });
    } else return undefined;
}