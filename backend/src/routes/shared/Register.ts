import Route from "../../Route";
import { Request, Response } from "express";
import User from "../../model/User";
import { badRequest, internalServerError, success } from "../../helper/http";
import Mailer from "../../helper/mailer";
import { Error } from "mongoose";
import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";
import env from "../../helper/env";
import logger from "../../helper/logger";

export default class RegisterRoute extends Route {
    constructor() {
        super("register");
    }
    protected async httpPost(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;

        // Check password field length
        if (!password || password.length < 8 || password.length > 20){
            badRequest(response);
            return;
        }

        const hash = hashSync(password, env.SALT_ROUNDS);
        const activateToken = randomBytes(64).toString("hex");

        try {
            await User.insertNewUser(username, hash, email, activateToken);
        } catch (e) {
            const error = e as Error;
            // Check if it's a ValidationError (integrity check failed)
            // or if it is a MongoServerError (duplicate key)
            if (error.name == "ValidationError"){
                badRequest(response);
                return;
            } else if (error.name == "MongoServerError"){
                badRequest(response, "Username or email taken");
                return;
            }
            internalServerError(response);
            return;
        }
        try {
            await Mailer.sendRegistrationEmail(username, email, activateToken);
        } catch (e) {
            logger.error("Unexpected error: ", e);
            internalServerError(response);
            return;
        }
        success(response);
    }
}
