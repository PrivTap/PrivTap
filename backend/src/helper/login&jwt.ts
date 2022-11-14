import express from "express";
import User, {IUser} from "../model/documents/User";
import jwt from "jsonwebtoken";
import Response from "../model/Response";

/**
 * Given a request and an HTTP response check if the user who did the request is logged.<br>
 * If the user is logged then it returns the user, otherwise it fails (MUST CATCH) and send back a 401 response. <br>
 * Use like this checkLogin(request).then((user)=>"code_for_success").catch()
 * @return If it's logged then return a promise with the user inside otherwise it fails. Also, the user is inserted inside the request as an attribute
 * @param request Http request
 * @param response Http response
 *
 */
export async function checkLogin(request: express.Request, response: express.Response): Promise<IUser> {
    try {
        return await checkJWT(request);
    } catch (error) {
        response.status(401);
        const responseContent = new Response();
        responseContent.status = false;
        responseContent.message = (error instanceof Error) ? error.message : "Access forbidden";
        response.send(responseContent);
        throw (error);
    }
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