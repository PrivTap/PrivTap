import express from "express";
import bcrypt from "bcrypt";
import {randomBytes} from "crypto";
import User from "../../model/documents/User";
import Response from "../../model/Response";
import {sendRegistrationEmail} from "../../mailer";

const router = express.Router();

// The error message will be filled during the checks
let responseMessage: Response = new Response();

/* POST endpoint for the Register operation */
router.post("/", (request, response) => {
    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;
    const saltRounds = 8;

    checkValidInput(username, email, password).then(check => {
        if (!check) {
            response.status(400);
            response.send(responseMessage);
            responseMessage = new Response();
            return;
        }
        const hash = bcrypt.hashSync(password, saltRounds);
        const accessToken = randomBytes(64).toString("hex");
        try {
            User.insertNewUser(username, hash, email, accessToken).then(() => {
                console.log("User correctly inserted in the DB");
                response.status(200);
                responseMessage.message = "Register: 200 OK";
                responseMessage.data = {"username": username, "email": email, "isConfirmed": false};
                response.send(responseMessage);
                responseMessage = new Response();

                sendRegistrationEmail(email, accessToken).then(() => console.log(""));
            });
        } catch (e) {
            console.log("Error");
            response.status(500);
            responseMessage.status = false;
            responseMessage.message = "500: Internal Error";
            response.send(responseMessage);
            responseMessage = new Response();
        }
    });
});

/**
 * Checks if the provided email is valid (format-wise)
 * If the email is not valid an error message is appended to the response
 * @param email The email found in the request body
 * @result True if the email is valid. False otherwise
 */
function checkEmail(email: string): boolean {
    const regex = /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const emailCheck = regex.test(email);
    console.log("emailCheck", emailCheck);
    console.log("status", responseMessage.status);
    if (!emailCheck && responseMessage.status) {
        console.log("error mail");
        responseMessage.status = false;
        responseMessage.message = "Error: Email not valid";
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
    if (!undefinedCheck && responseMessage.status) {
        responseMessage.status = false;
        responseMessage.message = "Error: Undefined parameters";
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
    if (!invalidCharCheck && responseMessage.status) {
        responseMessage.status = false;
        responseMessage.message = "Error: Username contains special characters";
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
    if (!lengthCheck && responseMessage.status) {
        responseMessage.status = false;
        responseMessage.message = "Error: Length error";
    }
    return lengthCheck;
}

/**
 * Checks if the username is already taken
 * @param username The username found in the request body
 * @result True if the username is not taken. False otherwise
 */
async function checkUserTaken(username: string): Promise<boolean> {
    const queryResult = await User.queryUser("username", username);
    if (queryResult == null) {
        return true;
    }
    responseMessage.status = false;
    responseMessage.message = "Error: Username taken";
    return false;
}

/**
 * Checks if the email is already associated to another account
 * @param email The email found in the request body
 * @result True if the email is not associated to another account. False otherwise
 */
async function checkEmailTaken(email: string): Promise<boolean> {
    const queryResult = await User.queryUser("email", email);
    if (queryResult == null) {
        return true;
    }
    responseMessage.status = false;
    responseMessage.message = "Error: Email taken";
    return false;
}

/**
 * Groups all the checks in a single function
 * @param username The username found in the request body
 * @param email The email found in the request body
 * @param password The password found in the request body
 * @result True if all the parameters satisfy the called checks. False otherwise
 */
async function checkValidInput(username: string, email: string, password: string): Promise<boolean> {
    const emailCheck = checkEmail(email);
    const undefinedCheck = checkUndefined(username, email, password);
    const usernameCheck = checkInvalidChar(username);
    const lengthCheck = checkLength(username, email, password);
    const usernameTakenCheck = checkUserTaken(username);
    const emailTakenCheck = checkEmailTaken(email);

    return emailCheck && undefinedCheck && usernameCheck && lengthCheck && await usernameTakenCheck && await emailTakenCheck;
}

export default router;