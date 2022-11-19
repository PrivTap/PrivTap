import Route from "../../Route";
import { Request, Response } from "express";
import User from "../../model/User";
import { badRequest, checkUndefinedParams, internalServerError, success } from "../../helper/http";
import { sendRegistrationEmail } from "../../helper/mailer";

import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";
import env from "../../helper/env";
import logger from "../../helper/logger";
import ModelError from "../../model/ModelError";

export default class RegisterRoute extends Route {
    constructor() {
        super("register");
    }
    protected async httpPost(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;
        if (checkUndefinedParams(response, username, email, password)) return;

        // Check password field length
        if (password.length < 8 || password.length > 20){
            badRequest(response);
            return;
        }

        const hash = hashSync(password, env.SALT_ROUNDS);
        const activateToken = randomBytes(64).toString("hex");

        try {
            if (!await User.insertNewUser(username, hash, email, activateToken)) {
                internalServerError(response);
                return;
            }
        } catch (e) {
            if (e instanceof ModelError) {
                badRequest(response, e.message);
            }
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
