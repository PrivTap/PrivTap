import Route from "../../Route";
import { Request, Response } from "express";
import User from "../../model/User";
import { badRequest, checkUndefinedParams, internalServerError, success } from "../../helper/http";
import Mailer from "../../helper/mailer";

import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";
import env from "../../helper/env";
import logger from "../../helper/logger";
import { handleInsert } from "../../helper/misc";

export default class RegisterRoute extends Route {
    constructor() {
        super("register", false, false);
    }
    protected async httpPost(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;

        if (checkUndefinedParams(response, username, email, password)) return;

        // Check password field length
        // Cannot check this in the model, because we hash the password
        if (password.length < 8 || password.length > 20){
            badRequest(response);
            return;
        }

        const hash = hashSync(password, env.SALT_ROUNDS);
        const activationToken = randomBytes(64).toString("hex");

        if (!await handleInsert(response, User, { username, password: hash, email, activationToken })) return;

        try {
            await Mailer.sendRegistrationEmail(username, email, activationToken);
        } catch (e) {
            logger.error("Unexpected error while sending email\n", e);
            internalServerError(response);
            return;
        }

        success(response);
    }
}
