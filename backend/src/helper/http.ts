import { Response } from "express";

/**
 * Standard response object that will be sent in the body of HTTP responses.
 */
export class APIResponse {
    // Flag representing if the request succeeded or not
    readonly status: boolean;
    // Message that will be sent back to clients, DO NOT put sensitive info here
    readonly message: string;
    // Additional data that is needed by the client, optional
    readonly data?: object;

    /**
     * Creates a new APIResponse with the given options.
     * @param status if the request was successful or not, default true
     * @param message message that will be sent back to client, mainly used for errors, default ""
     * @param data additional data that will be sent back to client, mainly used on successful requests to pass the needed data
     */
    constructor(status = true, message = "", data?: object) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

/**
 * Checks if the specified parameters are undefined. Sends 400 BAD REQUEST response if so.
 * @param response the provided response
 * @param params the parameters to checjk
 * @returns true if one of the parameters is undefined, false otherwise
 */

export function checkUndefinedParams(response: Response, ...params: (string | string[] | undefined)[]): boolean {
    for (const param of params) {
        if (param === undefined) {
            badRequest(response, "One of the parameters is missing");
            return true;
        }
    }
    return false;
}

/**
 * Sends to the client a response signalling a successful request.
 * @param response The Express response used to send the success response to
 * @param data The data needed by the client after the successful request
 * @param message The message that will be sent, for the majority of successful responses this should be left as default, use data to pass information needed by the client
 */
export function success(response: Response, data?: object , message = "") {
    response.status(200).json(new APIResponse(true, message, data));
}

/**
 * Sends to the client a response signalling a generic "500 Internal Server Error".
 * @param response The Express response used to send the error to
 */
export function internalServerError(response: Response) {
    response.status(500).json(new APIResponse(false, "Internal server error"));
}

/**
 * Sends to the client a response signalling "403 Forbidden".
 * @param response The Express response used to send the error to
 * @param message The message to send to the client along with the error
 */
export function forbiddenUserError(response: Response, message = "Forbidden") {
    response.status(403).json(new APIResponse(false, message));
}

/**
 * Sends to the client a response signalling "401 Unauthorized".
 * @param response The Express response used to send the error to
 * @param message The message to send to the client along with the error
 */
export function unauthorizedUserError(response: Response, message = "Unauthorized") {
    response.status(401).json(new APIResponse(false, message));
}

/**
 * Sends to the client a response signalling "400 Bad Request".
 * @param response The Express response used to send the error to
 * @param message The message to send to the client along with the error
 */
export function badRequest(response: Response, message = "Bad request") {
    response.status(400).json(new APIResponse(false, message));
}