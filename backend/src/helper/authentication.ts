import {NextFunction, Request, Response} from "express";
import {IUser} from "../model/User";
import {verify, sign, JwtPayload} from "jsonwebtoken";
import {internalServerError, unauthorizedUserError} from "./http";
import env from "./env";

class AuthError extends Error {
    constructor(message?: string) {
        super(message);
    }
}

/**
 * Middleware function used to check for a valid JWT authentication token in the cookies of a request.
 * Automatically sends back unauthorized response if the token is not valid.
 * @param request the HTTP request
 * @param response the HTTP response
 * @param next function to call if the request authentication is valid
 */
export function checkAuthentication(request: Request, response: Response, next: NextFunction) {
    let userId;
    try {
        userId = checkJWT(request);
    } catch (e) {
        if (e instanceof AuthError) {
            unauthorizedUserError(response);
        } else {
            internalServerError(response);
        }
        return;
    }

    // TODO: Do we need to check if the user exists and load it from the DB here, or is it enough to pass only the id
    //  and then the endpoint makes db calls if needed?
    // const user = await User.findById(user_id);
    request.userId = userId;

    next();
}

/**
 * Checks in the cookies of the request if a JWT token is present. If so, tries to decode it and returns the userId.
 * @param request the HTTP request
 * @throws AuthError if the cookie does not exist or if it is not possible to decode it
 * @throws Error if the JWT_SECRET env variable is not defined
 */
function checkJWT(request: Request): string {
    const secret = env.JWT_SECRET;
    if (!secret) {
        throw Error();
    }

    const cookieJWT: string | undefined = request.cookies._jwt;
    if (!cookieJWT) {
        throw new AuthError("JWT Cookie is undefined");
    }

    let decoded;
    try {
        decoded = verify(cookieJWT, secret) as JwtPayload;
    } catch (e) {
        let errMessage = "JWT Cookie can't be verified";

        if (e instanceof Error) {
            errMessage += ": " + e.message;
        }

        throw new AuthError(errMessage);
    }

    const userId = decoded["user_id"];
    if (!decoded || !userId || typeof userId != "string") {
        throw new AuthError("JWT Cookie is invalid");
    }

    return userId;
}

/**
 Create a json web token encrypted using the secret in the env
 @param user: the user of which you want to create the token
 */
export function createJWT(user: IUser): string | undefined {
    const secret = env.JWT_SECRET;
    if (secret) {
        return sign({"user_id": user._id}, secret, {
            expiresIn: env.JWT_EXPIRE
        });
    }
}