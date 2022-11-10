import express from "express";
import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import {insertNewUser} from "../../helper";
import {sendRegistrationEmail} from "../../mailer";

const router = express.Router();

// The error message will be filled during the checks
const errorMessage: { [index: string]: string[] } = {};
const key = "error";
errorMessage[key] = [];

/* POST endpoint for the Register operation */
router.post("/", (request, response) => {
    console.log("Received post");
    const saltRounds = 8;
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    if (checkValidInput(username, email, password)) {
        const hash = bcrypt.hashSync(password, saltRounds);
        const accessToken = randomBytes(64).toString("hex");
        insertNewUser(username, hash, email, accessToken);

        response.status(200);
        response.send("Register: 200 OK");
        if (process.env.NODE_ENV == "development") {
            console.log(accessToken);
        } else {
            sendRegistrationEmail(email, accessToken).then(() => console.log(`An email has been sent to ${email}`));
        }
    } else {
        response.status(400);
        response.send(errorMessage);
        errorMessage[key] = [];
    }
});

/**
 * Checks if the provided email is valid (format-wise)
 * If the email is not valid an error message is appended to the response
 * @param email The email found in the request body
 * @result True if the email is valid. False otherwise
 */
function checkEmail(email: string): boolean {
    const regex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const emailCheck = regex.test(email);
    if (!emailCheck) {
        errorMessage[key].push("Email error");
    }
    return emailCheck;
}

/**
 * Checks if the parameter retrieved from the request body are undefined (they are not in the request body)
 * If at least one of the parameters is undefined an error message is appended to the response
 * @param username The username found in the request body
 * @param email The email found in the request body
 * @param password The password found in the request body
 * @result True if none of the paramenters are undefined. False otherwise
 */
function checkUndefined(username: string, email: string, password: string): boolean {
    const undefinedCheck = !(typeof username == "undefined" || typeof email == "undefined" || typeof password == "undefined");
    if (!undefinedCheck) {
        errorMessage[key].push("Undefined parameters error");
    }
    return undefinedCheck;
}

/**
 * Checks if the username contains special characters
 * If the username contains invalid characters an error messa is appended to the response
 * @param username The username found in the request body
 * @resutl True if the username doesn't contain any special character. False otherwise
 */
function checkInvalidChar(username: string): boolean {
    const regex = /[^a-zA-Z0-9]/;
    const invalidCharCheck = !regex.test(username);
    if (!invalidCharCheck) {
        errorMessage[key].push("Username error, special characters");
    }
    return invalidCharCheck;
}

/**
 * Checks the length of the parameters
 * If at least one of the parameters doesn't satisfy the constraints an error message is appended to the response
 * @param username The username found in the request body
 * @param email The email found in the request body
 * @param password The password found in the request body
 * @result True if all the parameters satisfy the length constraints. False otherwise
 */
function checkLength(username: string, email: string, password: string): boolean {
    const usernameConstraint = username?.length > 3 && username?.length < 15;
    const emailConstraint = email?.length > 3 && email?.length < 255;
    const passwordConstraint = password?.length > 8 && username?.length < 20;
    const lengthCheck = usernameConstraint && emailConstraint && passwordConstraint;
    if (!lengthCheck) {
        errorMessage[key].push("Length error");
    }
    return lengthCheck;
}

/**
 * Groups all the checks in a single function
 * @param username The username found in the request body
 * @param email The email found in the request body
 * @param password The password found in the request body
 * @result True if all the parameters satisfy the called checks. False otherwise
 */
function checkValidInput(username: string, email: string, password: string): boolean {
    const emailCheck = checkEmail(email);
    const undefinedCheck = checkUndefined(username, email, password);
    const usernameCheck = checkInvalidChar(username);
    const lengthCheck = checkLength(username, email, password);

    return emailCheck && undefinedCheck && usernameCheck && lengthCheck;
}

export default router;