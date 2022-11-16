import Route from "../../Route";
import { Request, Response } from "express";
import User from "../../model/User";
import { badRequest, internalServerError, success } from "../../helper/http";
import { sendRegistrationEmail } from "../../helper/mailer";

import { hashSync } from "bcrypt";
import { randomBytes } from "crypto";


export default class RegisterRoute extends Route {
    constructor() {
        super("register");
    }

    protected async httpPost(request: Request, response: Response): Promise<void> {
        const username = request.body.username;
        const email = request.body.email;
        const password = request.body.password;

        try {
            await RegisterRoute.checkValidInput(username, email,  password);
        } catch (e) {
            if (e instanceof Error)
                badRequest(response, e.message);
            else {
                console.log("Unexpected error: ", e);
                internalServerError(response);
            }
            return;
        }

        const hash = hashSync(password, Number.parseInt(process.env.SALT_ROUND || "1"));
        const activateToken = randomBytes(64).toString("hex");

        try {
            await sendRegistrationEmail(username, email, activateToken);
        } catch (e) {
            console.log("Unexpected error while sending email: ", e);
            internalServerError(response);
            return;
        }

        try {
            await User.insertNewUser(username, hash, email, activateToken);
        } catch (e) {
            console.log("Unexpected error: ", e);
            internalServerError(response);
            return;
        }

        success(response);
    }

    /**
     * Checks if the provided email is valid (format-wise).
     * @param email The email found in the request body
     */
    protected static checkEmail(email: string) {
        const regex = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        const emailCheck = regex.test(email);

        if (!emailCheck) {
            throw Error("Email not valid");
        }
    }

    /**
     * Checks if the parameter retrieved from the request body are undefined (they are not in the request body).
     * @param username The username found in the request body
     * @param email The email found in the request body
     * @param password The password found in the request body
     */
    protected static checkUndefined(username: string, email: string, password: string) {
        if (!username || !email || !password) {
            throw Error("Undefined parameters");
        }
    }

    /**
     * Checks if the username contains special characters.
     * @param username The username found in the request body
     */
    protected static checkInvalidChar(username: string) {
        const regex = /[^a-zA-Z0-9.\-_]/;
        const invalidCharCheck = !regex.test(username);

        if (!invalidCharCheck) {
            throw Error("Username contains special characters");
        }
    }

    /**
     * Checks the length of the parameters.
     * @param username The username found in the request body
     * @param email The email found in the request body
     * @param password The password found in the request body
     */
    protected static checkLength(username: string, email: string, password: string) {
        const usernameConstraint = username?.length > 3 && username?.length < 20;
        const emailConstraint = email?.length > 3 && email?.length < 255;
        const passwordConstraint = password?.length > 8 && username?.length < 20;
        const lengthCheck = usernameConstraint && emailConstraint && passwordConstraint;

        if (!lengthCheck) {
            throw Error("Username, email or password have invalid length");
        }
    }

    /**
     * Checks if the username is already taken.
     * @param username The username found in the request body
     */
    protected static async checkUserTaken(username: string) {
        const queryResult = await User.queryUser("username", username);

        if (queryResult != null) {
            throw Error("Username or email already taken");
        }
    }

    /**
     * Checks if the email is already associated to another account.
     * @param email The email found in the request body
     */
    protected static async checkEmailTaken(email: string) {
        const queryResult = await User.queryUser("email", email);

        if (queryResult != null) {
            throw Error("Username or email already taken");
        }
    }

    /**
     * Groups all the checks in a single function
     * @param username The username found in the request body
     * @param email The email found in the request body
     * @param password The password found in the request body
     */
    protected static async checkValidInput(username: string, email: string, password: string) {
        this.checkEmail(email);
        this.checkUndefined(username, email, password);
        this.checkInvalidChar(username);
        this.checkLength(username, email, password);
        await this.checkUserTaken(username);
        await this.checkEmailTaken(email);
    }
}
